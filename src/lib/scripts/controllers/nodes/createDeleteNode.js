import { nodes, blockClickedId, storeForSimpleTexts } from "$lib/scripts/stores";
import { deleteLines } from "$lib/scripts/controllers/lines/createDeleteLine"

/**функция удаляет узел */
export function deleteNode(id){
    //удалить узел в nodes store
    
    deleteLines(id);

    blockClickedId.set(1);

    storeForSimpleTexts.update( (jsClasses) => {
        return jsClasses.filter( (element) => {
               
            if(element.id !== id) return true;
            element.deleteElement();
            return false;
        });
    });
    

    nodes.update( (nodesArr) => nodesArr.filter( (dataObj) => {
        if(dataObj.parent_id === id){
            dataObj.parent_id = null;
        }

        if(dataObj.id === id){
            console.log("[blockToBeDelete]: id", id);
            return false;
        }

        return true;
    }));



    /*setTimeout(() => {
        nodes.update( (nodes) => nodes);  
    }, 0);*/
}