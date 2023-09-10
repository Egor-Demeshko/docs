import HTTPnode from "$lib/scripts/utils/dataSendReceive/HTTP/HTTPnode.js";
import DataServise from "$lib/scripts/controllers/instances/DataServise.js";
import JWT from "$lib/scripts/controllers/instances/JWT.js";

export default class Node{
    #client;
    #saveData;
    #jwt;
    #project_id;
    #updateCallBack;
    /**некоторые обновления не влияют на прорисовку блоков и документ
     * например, изменение координат блока. мы сохраняем не критические изменения
     * и отправляем целиком все обновления, когда критические изменения происходят
     * [{node_id: {data}}]
     */
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

        const dataToBeSend = {
            project_id: this.#project_id,
            delete_list: [ id ],
        }

        try{
            let json = await this.#client.delete(token, dataToBeSend);
            //console.log("[NODE]: {create}: result(resoponse json): ", json);
            if(json.success) this.#updateCallBack();
            return json;
        } catch (e){
            console.log("[NODE]: не удалось сохранить новый узел");
        }
    }


    async getToken(){
        return await this.#jwt.getToken(); 
    }


    /**созраняет не срочный данные */
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
            //console.log("[NODE]: {sendDataInQueue} result: ", result);
            if(result.success){
                this.clearQueue();
                return result;
            }
        }
    }


}