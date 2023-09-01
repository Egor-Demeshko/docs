import { storeForSimpleTexts } from "$lib/scripts/stores";


export function setElementActive(id){
    const elementController = searchForElement(id);

    elementController.setActive(id);
}


export function setElementInactive(id){
    const elementController = searchForElement(id);

    elementController.setInactive(id);
}


export function setElementHoverLike(id){
    const elementController = searchForElement(id);

    elementController.setHoverLike();
}


export function removeElementHoverLike(id){
    const elementController = searchForElement(id);

    elementController.removeHoverLike();
}


function searchForElement(id){
    let elementToReturn;

    let unsubscribe = storeForSimpleTexts.subscribe( (elements) => {
        for(let i = 0; i < elements.length; i++){
            const element = elements[i];

            if(element["id"] !== id) continue;
            
            elementToReturn = element;
            break;
        }
    });

    unsubscribe();
    return elementToReturn;
}


