import { nodes } from "$lib/scripts/stores";
import validation from "$lib/scripts/utils/validation/validation";

let allNodes = null;

nodes.subscribe( (nodes) => allNodes = nodes );

//ищет дочерние блоки и валидирует те, где как родитель указан %id%
export default async function validateSiblingsWithoutMessage(id){
    
    let blocksToBeValidated = [];

    searchForChildrenWithOurBlock();
    console.log("[alvalidateSiblingsWithoutMessagelNodes]: blocksToBeValidated:", blocksToBeValidated);

    if(blocksToBeValidated.length > 0){
        sendToValidate();
    }
    


    function searchForChildrenWithOurBlock(){
        allNodes.forEach( (data) => {
            if(data["parent_id"] === id) blocksToBeValidated.push(data);
        });
    }

    function sendToValidate(){
        blocksToBeValidated.forEach( (data) => {
            console.log("[alvalidateSiblingsWithoutMessagelNodes]: {sendToValidate} data:", data);
            validation(data, {nomessages: true, nopropogate: true});
        });
    }
}