import { nodes } from "$lib/scripts/stores";



/** @description функция используется для обновления данных в nodes сторе. тоесть обновление
 * конкретного поля под именем, по айди блока. по одному значению
 */
                                                //TODO нужно переделать, понимать обьект, элементов которые должны 
                                                //быть изменены
export default function syncDataInNodesStore(id, fieldName, value, fieldsToUpdate){
    console.log("[syncDataInNodesStore]: arguments: ",  {
                                                            id,
                                                            fieldName,
                                                            value
                                                        });
        
    if(fieldName && (value || value === "" )){
        
        nodes.update( (nodesData) => {
    
            for(let i = 0; i < nodesData.length; i++){
                let node = nodesData[i];
                if(node["id"] !== id) continue;
                if(node["id"] === id){
                    node[fieldName] = value;
                    break;
                }
            }
            //console.log("[SYNC]: nodesData: ", nodesData);
            return nodesData;
        });

    } else if(fieldsToUpdate) {
        //{condition: 'lt'}


        nodes.update( (nodesData) => {
    
            for(let i = 0; i < nodesData.length; i++){
                let node = nodesData[i];
                if(node["id"] !== id) continue;
                if(node["id"] === id){


                    if(Object.hasOwn(fieldsToUpdate, "condition")){
                        if(fieldsToUpdate.condition === "lt" ||
                                fieldsToUpdate.condition === "gt" ||
                                fieldsToUpdate.condition === "gte" ||
                                fieldsToUpdate.condition === "lte"
                            ){
                                tryForceTriggerToNumber(node);
                            }
                    }

                    
                    for(let [fieldName, value] of Object.entries(fieldsToUpdate)){
                        /**есть ли ключ в node, например, может options отсутствовать*/
                        if(!Object.hasOwn(node, fieldName)) {

                            node[fieldName] = value; 
                            continue;
                        }

                        for(let [key, nodeValue] of Object.entries(node)){
                            
                            if(key === fieldName){  
                                
                                node[key] = value;
                                break;
                            }
                        }
                        

                    }
                    break;
                }
            }
            //console.log("[SYNC]: NEW   nodesData: ", nodesData);
            return nodesData;
        });

    }
}

/**функция пытается привести поле trigger данных к числу, дабы нормально на сервак послать */
function tryForceTriggerToNumber(node){
    if(node?.trigger && typeof node.trigger === "string"){
        if(!isNaN(Number(node.trigger))){
            node.trigger = Number(node.trigger);
        }
    }
}