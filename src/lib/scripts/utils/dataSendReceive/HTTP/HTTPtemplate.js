import HTTPrefresher from "$lib/scripts/utils/dataSendReceive/HTTP/HTTPrefresher.js";

export default class HTTPtemplate extends HTTPrefresher{
    #path = "template";
    path = "api/v1";
    secondPath = "/project/template";

    constructor(){
        super();
    }

    async post(data){
        return await super.post(data, this.#path);
    }

    async delete(token, data){
        const route = "/delete";

        try{
            let response = await super.delete(token, JSON.stringify(data), route);
            return response;
        } catch(e){
            console.log("[HTTP]: ошибка запроса, удаления", {
                message: e.message,
            });
        }
    }

    async patch(data){
        return await super.patch(data, this.#path);
    }


    async postWithToken(token, data){
        const route = '/create';

        try{
            let response = await super.postWithHeader(token, JSON.stringify(data), route);
            return response;
        } catch(e){
            console.log("[HTTP]: ошибка запроса, ", {
                message: e.message,
            });
        }

    }


    async updateWithToken(token, data){
        const route = "/update";

        try{
            let response = await super.patch(token, JSON.stringify(data), route);
            return response;
        } catch (e) {
            console.log("[HTTP]: ошибка запроса, ОБНОВЛЕНИЯ patch", {
                message: e.message,
            });
        }
    }

    async sendFile(token, formData){
        const route = "/from-docx/";

        let response = await super.postFile(token, formData, route);
        return response;

    }
}