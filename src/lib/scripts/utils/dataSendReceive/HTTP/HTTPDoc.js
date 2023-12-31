import HTTPprojects from "$lib/scripts/utils/dataSendReceive/HTTP/HTTPprojects.js";

export default class HTTPDoc extends HTTPprojects{
    constructor(){
        super();
    }

    async createDocFromHtml(token, name, html){
        const route = "/document/from-html/";

        const objToSend = {
            name,
            html
        }

        try{

            const result = await super.postForStreamWithSecondPath(token, JSON.stringify(objToSend), route); 
            const blob = await result.blob();
            return URL.createObjectURL(blob);
        } catch (e){
            console.log("[HTTPDOC]: ошибка при создании документа ", e.message);
            throw e;
        }
        

        return result;
    }


    async downloadDocument(token, project_id, document_id){
        const route = "/document/download/";

        const objToSend = {
            project_id,
            document_id
        }

        const result = await super.postForStreamWithSecondPath(token, JSON.stringify(objToSend), route);
        const blob = await result.blob();
        return URL.createObjectURL(blob);
    }


    async saveDocumentToProject(token, project_id, name, html){
        const route = "/document/from-html/save/";

        const objToSend = {
            project_id,
            name,
            html
        }

        const result = await super.postWithHeader(token, JSON.stringify(objToSend), route);
        return result;
    }
}