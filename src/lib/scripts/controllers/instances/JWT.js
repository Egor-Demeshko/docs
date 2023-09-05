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
        let token = this.#saveService.getToken();
        if(token){
            let exp = token.exp;

            if( Date.now() - exp >= 0 ){
                this.#saveService.deleteToken();
                return false;
            }

            return true;
        }
    }


    /**@param tokens {jwt: {string}, refresh: {string}} */
    saveToken(tokens){
        console.log('[JWT]: saving token');
        
        this.#saveService.save({...tokens, expired: this.#expired});
    }

    async processTokens(){
        let refreshToken = this.#saveService.getToken();
        console.log('[JWT] {process token}: token', token);

        if(refreshToken){
            try{
                const tokens = await this.#http.refresh(refreshToken);

                this.decodeJWT(tokens.jwt);

                this.saveToken(tokens);

                return true;
            } catch(e){
                console.log("[USER]: не удалось обновить токен через соединение");
            }
        } else {
            throw new Error("не удалось получить токен из памяти");
        }
        console.log("[JWT] refresh result: ", result);
    }


    decodeJWT(jwt){
        let arr = jwt.split('.');

        arr = arr.map( (value) => atob(value));
        console.log("[JWT]: {decodeJWT}: arr", arr);

        for(let i = 0; i < arr.length; i++){
            if(arr[i].exp){
                this.#expired = exp;
            }
        }

       // return arr;
    }

}