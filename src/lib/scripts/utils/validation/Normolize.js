import NodeConsistencyValidation from "$lib/scripts/utils/nodes/NodeConsistencyValidation.js";

/**
 */
export default class Normolize extends NodeConsistencyValidation{
    /**@type {Object} */
    #activeNodeData;

    constructor(){
        super();
    }

    /**
     * 
     * @param {String} fieldName 
     * @param {String} value 
     * @description функция задает параметры которые должны быть изменены, в случае выбора упоределенного значения,
        * так напмери у node_type = radiobutton или checkbox должно присутствовать поле options
     * @returns {object}
     */
    normolize( fieldName, value ){
        const node = this.#activeNodeData;
        const fieldsToUpdate = {
        };
    
        fieldsToUpdate[fieldName] = value;
    
        if(fieldName === "node_type"){
            if(value === "select") {
                if(node.data_type !== "string" && node.data_type !== "integer") fieldsToUpdate.data_type = "string";

                if(node.data_type === "bool") {
                    fieldsToUpdate.content = "по-умолчанию";
                }
                
                fieldsToUpdate.options = node.options || [ node.content || ""];
                fieldsToUpdate.view_type = node.view_type || "drop_list";
                
            } else if (value === "checkbox") {

                if(node.content !== true || node.content !== false) fieldsToUpdate.content = true;
                fieldsToUpdate.data_type = "bool";

                fieldsToUpdate.options = null;
                fieldsToUpdate.view_type = null;

            } else if (value === "text" || value === "entry") {

                fieldsToUpdate.data_type = (node.data_type === "integer") ? "integer" : "string";
                if(node.data_type === "bool"){
                    fieldsToUpdate.content = "по-умолчанию";
                }

                if(node.data_type === "select" && !node?.content) fieldsToUpdate.content = node.options[0];

                fieldsToUpdate.options = null;
                fieldsToUpdate.view_type = null;
            }
            
        }
    
    
        return fieldsToUpdate;
    }


    setActiveNode(node){
        super.setActiveNode(node);
        this.#activeNodeData = {...node};
    }


    clearSavedNode(){
        super.clearSavedNode();
        this.#activeNodeData = null;
    }

    deleteNoBackendFields(obj){
        const newObj = {...obj};
        delete newObj.validity;
        delete newObj.id;
        
        /**для нормального рендера компонента noderedactor приходится в list добавлять влюбом
         * случае поле options = []; даже когда node_type != select. 
         */
        if(obj.node_type !== "select" && obj.options) newObj.options = null;
        return newObj;
    }


    /**
     * Checks the node data_type and others fields of the given data object .
     *
     * @param {Object} data - The data to be checked.
     * @return {boolean} Returns true if the data is valid, false otherwise.
     */
    checkDataTypeAndFields(data){
        if(data.validity.status === "invalid"){
            const err_data = data.validity.err_data;

            for (let i = 0; i < err_data.length; i++) {
                
                const element = err_data[i];
                /**с несотвествующим значение content и data_type сервер не примет данные*/
                if(element.field === "content"){
                    document.dispatchEvent( new CustomEvent("error", {
                        detail: {
                            err_data: [{
                                blockId: data.id,
                                message: "Изменения в красных полях могут быть утеряны. Если это не проблема повторно закройте редактор",
                                err_id: 1010,
                                err_type: "emergency",
                            }],
                        }
                    }));
                    return false;
                }            
            };                    
            }
        return true;
    }


    forceContentToBeInt(obj){
        obj.content = +obj.content;
    }
}

