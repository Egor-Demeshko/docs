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
    #jwtClient;

    static instance;

    
    constructor({save}){
        if(User?.instance) return User.instance;

        this.#login = new HTTPLogin();
        this.#saveService = new DataService(save);
        this.#jwtClient = new JWT({saveService: this.#saveService, http: this.#login});
        User.instance = this;
    }

    /**при переходе на новый рут, ПОСЛЕ проверки наличия токена, запускает его проверку */
    async refreshSession(){
        //TODO возможно сделать сохранение данных айди пользователя
        return await this.#jwtClient.processTokens();
    }


    isTokenFresh(){
        return this.#jwtClient.isTokenFresh();
    }

}