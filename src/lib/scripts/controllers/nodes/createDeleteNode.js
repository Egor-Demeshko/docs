import { nodes, blockClickedId, storeForSimpleTexts } from "$lib/scripts/stores";
import { deleteLines } from "$lib/scripts/controllers/lines/createDeleteLine"

/**функция удаляет узел */
export async function deleteNode(id, controller){
    //удалить узел в nodes store
    
    deleteLines(id);

    //удаляем из стора классов которые управленияют элементами в тексте
    storeForSimpleTexts.update( (jsClasses) => {
        return jsClasses.filter( (element) => {
               
            if(element.id !== id) return true;
            element.deleteElement();
            return false;
        });
    });

    //событие для нотификации того что изменился документ. <RedactorContainer />
    //делает обработку события. 
    document.dispatchEvent( new CustomEvent("document_updated"));
    
    /**для уставноки фокуса на первом элементе */
    let setted = false;
    nodes.update( (nodesArr) => nodesArr.filter( (dataObj, i) => {
        if(dataObj.parent_id === id){
            dataObj.parent_id = null;
        }

        if(dataObj.id === id){
            console.log("[createDeleteNode]: id", id);
            return false;
        }

        if(!setted){
            setted = true;
            blockClickedId.set(dataObj.id);
        }

        return true;
    }));


    try{
        let result = await controller.delete(id);
        console.log("[createDeleteNode]: after delete request, result", result);

    } catch(e){
        console.log("[delete node]: ошибка удаления узла: ", e.message);
    }

    //TODO ТЕПЕРЬ НАДО СДЕЛАТЬ ЗАПРОС ОБНОВЛЕНИЯ УЗЛОВ
    /*setTimeout(() => {
        nodes.update( (nodes) => nodes);  
    }, 0);*/
}