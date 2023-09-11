import HTTPnode from "$lib/scripts/utils/dataSendReceive/HTTP/HTTPnode.js";
import DataServise from "$lib/scripts/controllers/instances/DataServise.js";
import JWT from "$lib/scripts/controllers/instances/JWT.js";

export default class Node{
    #client;
    #saveData;
    #jwt;
    #project_id;
    /**используется для старта полного обновления узлов, по умолчанию функция определена в page.svelte
     * и запускает запрос полностью графа и возможно html
     */
    #updateCallBack;
    /**некоторые обновления не влияют на прорисовку блоков и документ
     * например, изменение координат блока. мы сохраняем не критические изменения
     * и отправляем целиком все обновления, когда критические изменения происходят
     * [{node_id: {data}}]*/
    #updateQueue = [];
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

    /**создание узла */
    async create(data){
        let token = await this.getToken();

        const dataToBeSend = {
            project_id: this.#project_id,
            nodes: {

            }
        };

        /**создаем новый обьект с данными, чтобы удаление не затерало инфу в оригинальном блоке */
        const newData = {...data};

        /**подготоваливаем данные в том виде на api в котором их ждут */
        dataToBeSend["nodes"][newData.id] = newData;
        delete dataToBeSend["nodes"][newData.id]["id"];
        console.log('[Node]: dataToBeSend: ', dataToBeSend);

        try{
            let json = this.#client.create(token, dataToBeSend);
            console.log("[NODE]: {create}: result(resoponse json): ", json);
        } catch (e){
            console.log("[NODE]: не удалось сохранить новый узел");
        }

    }


    clearQueue(){
        this.#updateQueue.length = 0;
    }


    async delete(id){
        /**
         * {
                "project_id": 1,
                "delete_list": [
                    "ede51235-59b8-4651-ab4f-657f4aebe284",
                    "9c37fc38-abc8-46dc-bf98-3f150e5b1350"
                ]
            }
         */
        const token = await this.getToken();

        if(this.#updateQueue.length > 0){      
            this.#deleteIdandSend(id);
        }

        const dataToBeSend = {
            project_id: this.#project_id,
            delete_list: [ id ],
        }

        try{
            let json = await this.#client.delete(token, dataToBeSend);
            console.log("[NODE]: {delete}: result(resoponse json): ", json);
            if(json.success) this.#updateCallBack();
            return json;
        } catch (e){
            console.log("[NODE]: не удалось сохранить новый узел");
        }
    }

    /**при удалении узла, мы смотрим не был ли удален узел, изменения которого занесене в очередь на update
     * сервер не принимает запрос на update если узел вдруг окажется удаленным
    */
    async #deleteIdandSend(id){
        //проверить есть ли узел с таким айди в очереди. если есть, удалить из очереди
        let queue = this.#updateQueue;

        this.#updateQueue = queue.filter( (obj) => {
            if(Object.hasOwn(obj, id)){
                return false;
            }
            return true;
        });

        this.sendDataInQueue();
    }


    async getToken(){
        return await this.#jwt.getToken(); 
    }


    /**созраняет не срочные, не критичные данные локально*/
    saveNourgent({node_id, field_name, field_data}){
        console.log("[Node] {saveNourgent} enter arguments: ", {node_id, field_name, field_data});
        if(node_id && field_name){
            let arr = this.#updateQueue;

            for (let i = 0; i < arr.length; i++) {
                /*элемент массива {node_id: {data}}*/
                const element = arr[i];
                
                if(Object.hasOwn(element, node_id)){
                    element[node_id][field_name] = field_data;
                    console.log("[NODE]: {saveNourgent}: queue data: ", this.#updateQueue);
                    return {success: true};
                } 
                continue;
            }


            /**если в массиве не нашлось обьект с ключом node_id, тогда создаем новый */
            {
                const objToSave = {};
                objToSave[node_id] = {};
                objToSave[node_id][field_name] = field_data;
                this.#updateQueue.push(objToSave);
                console.log("[NODE]: {saveNourgent}: queue data: ", this.#updateQueue);
                return {success: true};
            }
            
        }
    }


    async sendDataInQueue(){
        if(this.#updateQueue.length > 0){
            let project_id = this.#project_id;
            let token = await this.getToken();

            const dataToSend = {project_id, nodes: {}};


            this.#updateQueue.forEach( (obj) => {
                for(let [key, data] of Object.entries(obj)){
                    dataToSend["nodes"][key] = data;
                }
            });
            

            let result = await this.#client.update(token, dataToSend);
            console.log("[NODE]: {sendDataInQueue} result: ", result);
            if(result.success){
                this.clearQueue();
                return result;
            }
        }
    }


    async update({node_id, field_name, field_value}){
        /**
         * {
                "project_id": 1,
                "nodes": {
                    "3dc0f268-fe7b-41c4-8462-413f274e2007": {
                        <fieldname>: <value>,
                    }
                }
            }
         */
        const token = await this.getToken();

        if(this.#updateQueue.length > 0){      
            this.#deleteIdandSend(node_id);
        }

        const dataToBeSend = {
            project_id: this.#project_id,
            nodes: {
            }
        }

        dataToBeSend["nodes"][node_id] = {}
        dataToBeSend["nodes"][node_id][field_name] = field_value;

        /**callback для обновления вызывается в коде который вызывает этот метод,
         * чаще всего элемент не удален и если вызывать колбек, то у нас обновятя данные, а затем еще
         * код вызвавший отправку, перерисует контент
         */

        const obj = await this.#client.update(token, dataToBeSend);

        console.log('[NODEHTTP]: {after update request}, result', obj);

        return obj;
    }

    /**чаще всего функция коллбек используется для уведомления о том что данные изменились и старта запроса нового пакеета данных
     * там где это необходимо
     */
    updateCallBack(){
        this.#updateCallBack();
    }
}