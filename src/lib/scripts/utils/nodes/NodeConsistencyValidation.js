import { get } from "svelte/store";
import { nodes } from "$lib/scripts/stores";

export default class NodeConsistencyValidation{
    #activeNodeData;
    #wasValidated = false;

    /**
     * @description массив ключей свойства, потеря данных с которых может бы важной
     */
    #vitalFields = ["options", "content"];

    constructor(){

    }

    setActiveNode(node){
        this.#activeNodeData = {...node};
        this.refreshStatus();
    }

    get wasValidated(){
        return this.#wasValidated;
    }


    clearSavedNode(){
        this.#activeNodeData = null;
    }

    /**использутеся для сравнения измененого обьекта данных после взаимодействия с node_redactor и с первоначальным, 
     * который хранится в activeNodeData. это свойство задается в момент клика по узлу и срабатывания реактивности стора
     * activeBlockId. пользуем один раз, для блокировки закрытия окна редактора узла.
     * @returns {boolean}
     */
    consistencyCheck(){   
        if(!this.#activeNodeData) return true; 
        if(this.#wasValidated) {
            this.refreshStatus();
        };
        /**
         * сравниваем сохраненный node obj с тем что сейчас висит в сторе
         * найти сначала обьект по айди, пройтись в цикли по важным поляем, заднным в массике
         * если значения поля в сохраннем дата обьекте и тем что сейчас имеем в глобальном пространстве, бить тревогу
         * отправляем сообщение, возращаем булеан результат
         */
        const globalNodes = get( nodes );
        if(globalNodes.length === 0) return true;
        /**ссылка на узел который запоминается в момент смены узла и не изменяет от взаимодествия с узлом */
        const localNode = this.#activeNodeData;
        const fields = this.#vitalFields;
        let result = true;
        /**сообзения для показа в центре сообзений
         * обдно сообзение обьект вида
         * {
         *      err_data: {
         *          field,
         *          message,
         *          blockId, 
         *          err_id, - вообще любоей, но так 806 и вышк
         *          err_type, - отвечает за отрисовку
         *      }
         * }
         */
        let messages = {
            err_data: [

            ]
        };
        let id = localNode.id;
        /**экземпляр глобальной ноды по айди из nodes store*/
        let globalNode;

        for(let i = 0; i < globalNodes.length; i++){
            let node = globalNodes[i];
            if(node.id === id){
                globalNode = node;
                break;
            }
        }

        /** проверка наличия данных */
        this.#vitalFields.forEach( (fieldName) => {
            if((!localNode[fieldName] && globalNode[fieldName]) 
            || (localNode[fieldName] && !globalNode[fieldName])){
                result = false;
                messages.err_data.push({
                    field: fieldName,
                    message: (fieldName === "options") ? `Поле "элементы списка" содержит данные, которые будут потеряны при
                    закрытии узла.` : `Поле "содержание блока" содержит данные которые будут потеряны при закрытии узла.`,
                    blockId: id,
                    err_id: 806,
                    err_type: "highlight"
                });
            }
        });

        /**проверка типа контента */
        if( typeof localNode.content !== typeof globalNode.content && typeof localNode.content === "string" ){
            result = false;
            messages.err_data.push({
                field: 'content',
                message: "При установке checkbox теряется текстовое содержание блока, точно данные не важны? Нажмите стрелку еще раз.",
                blockId: id,
                err_id: 807 ,
                err_type: "highlight"
            });
        }
       


        /**центр сообщений работает по событию error */
        if(messages.err_data.length > 0) {

            globalNode.validity = {
                status: "invalid",
                err_data: messages.err_data,
                code: 806
            }
            messages['code'] = 806;
            document.dispatchEvent( new CustomEvent("error", {detail: messages}));
        }

        this.#wasValidated = true;
        return result;
    }

    /**использовать  */
    refreshStatus(){
        this.#wasValidated = false;
    }


}

