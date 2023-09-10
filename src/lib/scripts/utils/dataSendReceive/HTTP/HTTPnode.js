import HTTPrefresher from "$lib/scripts/utils/dataSendReceive/HTTP/HTTPrefresher";

export default class HTTPnode extends HTTPrefresher{
    path = "api/v1";
    secondPath = "/project";

    constructor(){
        super();
    }

    async update(token, data){
        const route = "/node/update";
        
        if(token){
            try{
                return await this.put(token, JSON.stringify(data), route);
            } catch (e){
                console.log("[HTTPNODE] не удалось выполнить запрос,", e.message);
            }
        } else {
            console.log("[httpnode]: {update} no token");
        }
    }


    async create(token, data){
        const route = "/node/create";
        
        if(token){
            try{
                return await this.postWithHeader(token, JSON.stringify(data), route);
            } catch (e){
                console.log("[HTTPNODE] не удалось выполнить запрос,", e.message);
            }
        } else {
            console.log("[httpnode]: {update} no token");
        }
    }


    async delete(token, data){
        const route = "/node/delete";
        
        if(token){
            try{
                debugger;
                return await super.delete(token, JSON.stringify(data), route);
            } catch (e){
                console.log("[HTTPNODE] не удалось выполнить запрос DELETE,", e.message);
            }
        } else {
            console.log("[httpnode]: {update} no token");
        }
    }   
}