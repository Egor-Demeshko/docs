import HTTPDoc from "$lib/scripts/utils/dataSendReceive/HTTP/HTTPDoc.js";
import DataServise from "$lib/scripts/controllers/instances/DataServise.js";
import JWT from "$lib/scripts/controllers/instances/JWT.js";

export default class DocHandler {
    #project_id;
    #client;
    #saveData;
    #jwt;
    
    constructor() {

        this.#client = new HTTPDoc();
        this.#saveData = new DataServise({save: "local"});
        this.#jwt = new JWT({
            saveService: this.#saveData,
            http: this.#client
        });
    }


    setProjectId(project_id){
        this.#project_id = project_id;
    }
    

    async createDocFromHtml(name, html){
        const token = await this.getToken();

        const result = await this.#client.createDocFromHtml(token, name, html);
        return result;
    }


    async saveDocument(project_id, name, html){
        const token = await this.getToken();

        const result = await this.#client.saveDocumentToProject(token, project_id, name, html);
        return result;
    }


    async downloadDocument(project_id, document_id){
        const token = await this.getToken();

        const result = await this.#client.downloadDocument(token, project_id, document_id);
        return result;
    }


    async getToken(){
        return await this.#jwt.getToken(); 
    }

}