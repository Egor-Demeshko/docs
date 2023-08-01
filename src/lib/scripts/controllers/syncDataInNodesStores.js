import { nodes } from "$lib/scripts/stores";

/** @description функция используется для обновления данных в nodes сторе. тоесть обновление
 * конкретного поля под именем, по айди блока.
 */
export default function syncDataInNodesStore(id, fieldName, value){
    /*console.log("[syncDataInNodesStore]: arguments: ",  {
                                                            id,
                                                            fieldName,
                                                            value
                                                        });*/

    nodes.update( (nodesData) => {

        for(let i = 0; i < nodesData.length; i++){
            let node = nodesData[i];
            if(node["id"] !== id) continue;
            if(node["id"] === id){
                node[fieldName] = value;
            }
        }

        return nodesData;
    });
}