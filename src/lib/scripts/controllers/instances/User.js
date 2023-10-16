import HTTPLogin from "$lib/scripts/utils/dataSendReceive/HTTP/HTTPlogin";
import Storage from "$lib/scripts/controllers/instances/Storage.js";
import {goto} from "$app/navigation";
import JWT from "$lib/scripts/controllers/instances/JWT.js";
import DataService from "$lib/scripts/controllers/instances/DataServise.js";

/**@param save {STRING} - где сохранять токены local cookie*/
export default class User{
    #saveService;
    #login;
    #token;
    #id;
    #mail;
    #name;
    #jwtClient;

    static instance;

    
    constructor({save}){
        if(User?.instance) return User.instance;

        this.#login = new HTTPLogin();
        this.#saveService = new DataService({save});
        this.#jwtClient = new JWT({saveService: this.#saveService, http: this.#login});
        User.instance = this;
    }

    /**при переходе на новый рут, ПОСЛЕ проверки наличия токена, запускает его проверку */
    async refreshSession(){
        //TODO возможно сделать сохранение данных айди пользователя
        return await this.#jwtClient.processTokens();
    }


    async logout(){
        let token = await this.#jwtClient.getToken();

        if(token){
            return await this.#login.post(null, "logout", token);
        } else {
            return false;
        }
    }

    async registrate(data, reg){
        return await this.#login.post(data, reg);
    }


    isTokenFresh(){
        return this.#jwtClient.isTokenFresh();
    }

    saveData(data){
        //данные надо декодировать
        //данные нужно сохранить в классе
        //данные нужно сохранить в local
        this.#token = data.jwt;
        this.#id = data.user_id;
        this.#name = data.name;

        try{
            this.#jwtClient.decodeJWT(data.jwt);

            this.#jwtClient.saveToken({jwt: data.jwt, refresh: data.refresh});
            return true;
        } catch(e) {
            console.log("[saving data error]: ", e.message);
        }   
    }


}