import HTTPDemo from "$lib/scripts/utils/dataSendReceive/HTTP/HTTPDemo.js";
import JWT from "$lib/scripts/controllers/instances/JWT.js";
import DataServise from "$lib/scripts/controllers/instances/DataServise.js";
import HTTPrefresher from "$lib/scripts/utils/dataSendReceive/HTTP/HTTPrefresher.js";

/**@description класс для управления создание и апдейтом демо токенов */
export default class Demo{
    static saveData = new DataServise({save: "local"});
    static client = new HTTPrefresher();
    static JWT = new JWT({saveService: this.saveData, http: this.client});
    constructor(){

    }

    static async createDemo(){
        /**data = { expiration_delta, 
        jwt,
        name,
        refresh,
        user_id*/
        let {success, data: {
            jwt,
            refresh
        }, details } = await HTTPDemo.createDemo();
        /**насамом деле, расшифровываем и сохраняем exp данные */
        if(success){
            this.JWT.decodeJWT(jwt);
            this.JWT.saveToken({jwt, refresh});
            this.saveData.addDemo();
            return true;
        } else {
            throw new Error("Ошибка обработки запроса: ", details?.message);
        }

    }

    static async updateDemo(){

    }
}