import Normolize from "$lib/scripts/utils/validation/Normolize.js";
import { nodes, documents } from "$lib/scripts/stores";
import { get } from "svelte/store"; 
import GeneralElementsOperations from "$lib/scripts/docElements/controllers/GeneralElementsOperations.js";

export default class NodeLocalOperations extends Normolize{
    constructor(){
        super();
    }

    /** make function that gets nodes instance with get function and then
     * run throuhd all nodes and compare there active value with nodes.active
     * 
     * @param updatedNodes {
            "3dc0f268-fe7b-41c4-8462-413f274e2007": {
                "active": true,
                "condition": null,
                "content": "",
                "data_type": "string",
                "description": "Какая сторона оплачивает расходы сделки",
                "name": "Расходы сделки",
                "node_type": "select",
                "options": [
                    "На покупателе",
                    "На продавце",
                    "50/50"
                ],
                "parent_id": null,
                "trigger": null,
                "view_type": "radiobutton",
                "x": null,
                "y": null
            }
    }
     */
    isUpdateNeeded(updatedNodes){
        /**
         * @description { id, active } далее этот обьект используется для обновления store для dom 
         * элементов*/
        const idsToUpdate = [];

        nodes.update( (nodes) => {
            
            for (let i = 0; i < nodes.length; i++) {
                /**@type {object} */
                const node = nodes[i];
                
                /**
                 * @param {string} key - id of node
                 * @param {object} value {} node data
                 */
                for(let [key, value] of Object.entries(updatedNodes)){
                    if(node["id"] === key){
                        if(node.active !== value.active){
                            const obj = {};
                            obj["id"] = key;
                            obj["active"] = value.active;

                            idsToUpdate.push(obj);

                            node.active = value.active;
                        } 
                    } 
                }
            }

            if( idsToUpdate.length > 0 ){
                GeneralElementsOperations.updateDomElementsVisibility(idsToUpdate);
            }

            return nodes;
        });

    }
}