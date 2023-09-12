import HTTPnode from "$lib/scripts/utils/dataSendReceive/HTTP/HTTPnode.js";
import DataServise from "$lib/scripts/controllers/instances/DataServise.js";
import JWT from "$lib/scripts/controllers/instances/JWT.js";


export default class NodeRedactor{
    #client;
    #saveData;
    #jwt;
    #project_id;
    #updateCallBack;

    constructor(project_id, updateCallBack){
        this.#client = new HTTPnode();
        this.#saveData = new DataServise({save: "local"});
        this.#jwt = new JWT({
            saveService: this.#saveData,
            http: this.#client
        });
        this.#project_id = project_id;
        this.#updateCallBack = updateCallBack;
    }
}