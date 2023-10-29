import { modalFieldsStore } from "$lib/scripts/stores";
import {deleteNode} from "$lib/scripts/controllers/nodes/createDeleteNode.js";

let nodeId = null;
let nodeController = null;

export default function deleteFlow(id, controller){
    nodeId = id;
    nodeController = controller;

    modalFieldsStore.update( () => {
        return {
            show: true,
            text: "Вы действительно хотите безвозвратно удалить блок?",
            okCallback: deleteNodeStart,
            errorCallback: resetDelete
        }
    });  
}


async function deleteNodeStart(){
    await deleteNode(nodeId, nodeController);
    resetDelete();
}

function resetDelete(){
    nodeId = null;
    nodeController = null;
    modalFieldsStore.update( () => {
        return {
            show: false,
            text: '',
            errorCallback: null,
            okCallback: null,
            result: false
        }
    });
}