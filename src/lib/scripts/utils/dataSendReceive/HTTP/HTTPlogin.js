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
        let end = (reg) ? "/register" : "/login";

        let result;

        try{
             result = await super.post(JSON.stringify(data), end);
             console.log("[HTTPlogin]: data", data);
             return result;
        } catch(e){
            console.log("[Логин]: не удалось залогиниться!");
            throw e;
        }
    }
}