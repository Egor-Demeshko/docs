import { nodes } from "$lib/scripts/stores";



/** @description функция используется для обновления данных в nodes сторе. тоесть обновление
 * конкретного поля под именем, по айди блока. по одному значению
 */
export default function syncDataInNodesStore(id, fieldName, value){
    /*console.log("[syncDataInNodesStore]: arguments: ",  {
                                                            id,
                                                            fieldName,
                                                            value
                                                        });*/
    
    const fieldsToUpdate = {
    };
    fieldsToUpdate[fieldName] = value;
    
    normolize();
    

    nodes.update( (nodesData) => {

        for(let i = 0; i < nodesData.length; i++){
            let node = nodesData[i];
            if(node["id"] !== id) continue;
            if(node["id"] === id){

                for(let [key, nodeValue] of Object.entries(node)){
                    //debugger;
                    if(key === fieldName){
                        
                        node[key] = value;
                        console.log("[syncDataInNodesStores]: node that effected: ", node);
                        break;
                    }
                }
                
            }
        }
        //console.log("[SYNC]: nodesData: ", nodesData);
        return nodesData;
    });
    console.log("[syncDataInNodesStores]", fieldsToUpdate);
    return fieldsToUpdate;

    /**функция задает параметры которые должны быть изменены, в случае выбора упоределенно значения
     * так напмери у node_type = radiobutton или checkbox не может быть data_type
     */
    function normolize(){
        if(fieldName === "node_type"){
            if(value === "select")
            fieldsToUpdate.data_type = "string";
            //fieldsToUpdate.options = [];
            //fieldsToUpdate.view_type = "drop_list";
            fieldsToUpdate.content = "";
        }
    }
}