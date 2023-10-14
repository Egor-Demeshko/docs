import HTTPform from "$lib/scripts/utils/dataSendReceive/HTTP/HTTPform.js";
import DataService from "$lib/scripts/controllers/instances/DataServise.js";
import JWT from "$lib/scripts/controllers/instances/JWT.js";

    /** @description 
        * динамик граф контроллер отвечает за подготовку данных и их отправку через http так и получение
        * некотоырх данных из локального хранилища. */
export default class DynamicGraphController extends HTTPform{
    #project_id;
    #callbacks = [];
    #saveClient;
    /**сервер возращает новую структуру узлов в зависимости от 
     * массива изменений всех полей. 
     * Этот массив регистрирует все такие изменения.
     */
    #changedElements = {};
    #JWT;

    constructor({project_id, saveClient}){
        super();
        this.#project_id = project_id;

        this.#saveClient = new DataService({save: saveClient});
        this.#JWT = new JWT({saveService: this.#saveClient, http: this});
    }

    subscribe(fn){
        this.#callbacks.push(fn);
    }

    async saveData({node_id, content}){
        /**
         * запрос должен быть вида
         * {
                "project_id": 1,
                "contents": {
                    "ce28d8bc-84df-42e6-aaef-ed5a62f36a65": "25.08.2025",
                    "9c68d6c6-c567-4b01-b6f6-922b4741d729": "Квартира",
                    "9311e4de-090f-4dd6-a7e0-a5b789bae29d": false,
                    "f3b868b6-06a6-4ef2-b5b7-ffb60ed8e164": 50,
                    "f829e2bf-fd2c-4676-a761-ffe0638a120f": "Вторичка"
                }
            }
         */
        //необходимо обновить или добавить изменение в массив изменений
        this.updateChanged({node_id, content});        

        const dataToSend = {
            project_id: this.#project_id,
            contents: this.#changedElements
        }

        const token = await this.#JWT.getToken();
        let data;
        if(token){
            data = await super.update(token, dataToSend);
        }
        debugger;
        console.log("[DynamicGraphController]: {saveData} after request: ", data);
        if(data.success){
            this.#callbacks.forEach( (fn) => fn(data.data));
        }
    }
    
    /**при выгрузке странице чистим массивы */
    clearAll(){
        this.#callbacks = [];
        this.#changedElements = {};
    }


    updateChanged({node_id, content}){
        
        this.#changedElements[node_id] = content;
    }

}