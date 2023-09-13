/**
 */
export default class Normolize{
    /**@type {Object} */
    #activeNodeData;

    constructor(){

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

                if(node.content && node.data_type !== "bool") {
                    fieldsToUpdate.content = node.content;
                } else {
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
                if(node.content && node.data_type !== "bool") {
                    fieldsToUpdate.content = node.content;
                } else {
                    fieldsToUpdate.content = "по-умолчанию";
                }

                fieldsToUpdate.options = null;
                fieldsToUpdate.view_type = null;
            }
            
        }
    
    
        return fieldsToUpdate;
    }


    setActiveNode(node){
        this.#activeNodeData = {...node};
    }
}

