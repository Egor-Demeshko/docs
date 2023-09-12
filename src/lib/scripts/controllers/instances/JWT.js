import Storage from "$lib/scripts/controllers/instances/Storage.js";

export default class JWT{
    #saveService;
    #http;
    #expired;

    constructor({saveService, http}){
        this.#saveService = saveService;
        this.#http = http;
    }


    /**проверяем свежий ли токен */
    isTokenFresh(){
        let expiredStamp = this.#saveService.getTokenExp();
        if(expiredStamp){

            if( Math.floor(Date.now()/1000) - expiredStamp >= 0 ){
                this.#saveService.delete();
                return false;
            }
            return true;
        } 
        console.log("[TOKEN FRESH]: no timestamp"); 
        return false;
    }


    /**@param tokens {jwt: {string}, refresh: {string}} */
    saveToken(tokens){
        console.log('[JWT]: saving token', tokens);
        this.#saveService.save({...tokens, expired: this.#expired});
    }

    /**
     * @description функция пробует получить новые токены, декодировать из записать их.
     * если не получилось возращается false или выкидывает ошибку
     * @returns boolean
     */
    async processTokens(){
        let refreshToken = this.#saveService.getToken("refresh");
        console.log('[JWT] {process token}: refreshtoken', refreshToken);

        if(refreshToken){
            try{
                /** {jwt, refresh} */
                const tokens = await this.#http.refresh(refreshToken);
                if(tokens){
                    this.decodeJWT(tokens.jwt);

                    this.saveToken(tokens);
    
                    return true;
                } else {
                    console.log("[НЕТ ТОКЕНОВ]");
                    return false;
                }
            } catch(e){
                console.log("[JWT]: не удалось обновить токен: ", e.message);
            }
        } else {
            throw new Error("не удалось получить токен из памяти");
        }
        return false;
    }


    decodeJWT(jwt){
        let arr = jwt.split('.');

        arr = arr.map( (value, i) => {
            if(i === 2) return value;

            let str = atob(value);
            return JSON.parse(str);
        });
        console.log("[JWT]: {decodeJWT}: arr", arr);
        for(let i = 0; i < arr.length; i++){
            if(arr[i].exp){
                this.#expired = arr[i].exp;
            }
        }

       //return arr;
    }

    /**@description определяет есть ли токен и/или получает его из локальной памяти*/
    async getToken(){
        let isFresh = this.isTokenFresh();

        if(Storage.isToken() && isFresh){
            return this.#saveService.getToken("jwt");
        } else if (Storage.isRefreshToken()){
            let result = await this.processTokens();
            if(result) return this.#saveService.getToken("jwt");
        } else {
            throw new Error("НЕТ АКТИВНОЙ СЕССИИ");
        }
    }
}