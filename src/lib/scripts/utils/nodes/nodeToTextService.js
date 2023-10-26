import { storeForSimpleTexts } from "$lib/scripts/stores";

/**
 * Initializes a reconnection process by calling conect function
 *
 * @return {void} Returns nothing.
 */
export function makeReconnect(root){
    //у симпл текста запустить коннект, addEventListenets. для соединения с узлами на тексте.
    storeForSimpleTexts.update( ( elements ) => {

        for(let i = 0; i < elements.length; i++){
            const element = elements[i];
            element.connect(root);
            element.createListeners();
        }
        return elements;
    });
}


export function showError(message, err_type, blockId){
    document.dispatchEvent(new CustomEvent("error", {
        detail: {
            err_data: [
                {
                    blockId,
                    message,
                    err_id: 1000,
                    err_type 
                }
            ]
        }
    }));
}