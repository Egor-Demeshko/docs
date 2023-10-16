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


    async post(data, reg, token){
        let end = "";

        switch(reg){
            case("registrate"):
            end = "/register/";
            break;
            case("logout"):
            end = "/logout/";
            break;
            default:
            end = "/login/";
            break;
        }

        try {
                if(reg !== "logout"){
                    return await super.post(JSON.stringify(data), end);
                } else {
                    return await super.postWithHeader(token, null, end);
                }
        } catch(e) {
            console.log("[ERROR]: ошибка котроллера auth");
            throw e;
        }
    }
}