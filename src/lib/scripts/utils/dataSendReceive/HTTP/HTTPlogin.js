import HTTPrefresher from "$lib/scripts/utils/dataSendReceive/HTTP/HTTPrefresher.js";

export default class HTTPLogin extends HTTPrefresher{
    #post = "";
    #delete = "";
    #get = "";
    path = "api/v1";
    secondPath = "/auth";

    constructor(){
        super()
    }


    async post(data, reg){
        let end = (reg) ? "/register/" : "/login/";

        let result;

        try {
             return await super.post(JSON.stringify(data), end);
        } catch(e) {
            console.log("[Логин]: не удалось залогиниться!");
            throw e;
        }
    }
}