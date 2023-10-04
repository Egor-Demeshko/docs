import sanitizeHTML from "$lib/scripts/utils/sanitizeHTML.js";
import {storeForSimpleTexts, docRoot, documents} from "$lib/scripts/stores";
import { get } from "svelte/store";


export function processSelection(callerId, eventSelection){

    if(!eventSelection) return;
    let root;
    /**@description HTMLElement, элемент, в котором находится node, попавшая в selection */
    let parentElement = "";

    let selection = window.getSelection();
    let anchorNode = selection.anchorNode;

    /**HTML строка, родителя node в который происходит вставка */
    let parentHtml = "";
    let selectionText = "";

    docRoot.update( (docRoot) => {
        root = docRoot;
        return docRoot;
    });
    
    //console.log("[Troumboube]: selection changed: ", selection);
    
    //убедится что в одном элементе выделение ,если нет то выкинуть сообщение о том что переменняа не должна 
    if(anchorNode !== selection.focusNode){

        document.dispatchEvent(new CustomEvent("error", {
            detail: {
                err_data: [
                    {
                        blockId: callerId,
                        message: "Новая переменная не должна пересекать другие переменные и должна быть в пределах одного абзаца",
                        err_id: 1000,
                        err_type: "highlight"
                    }
                ]
            }
        }));

        selection = null;
        return;
    }

    /**берем родительский html. через нахождение текста node куда вставляем и индексы селекшена,
     * определим точку вставки переменной
     */
    //санитизировать строку от скриптов
    {
        parentElement = anchorNode.parentElement;
        parentHtml = parentElement.innerHTML;


        parentHtml = sanitizeHTML(parentHtml);
    }

    {   
        const docClassController = get( documents );
        /**@description корректирующие индексы, из селекшена */
        let startIndex = ( selection.anchorOffset <= selection.focusOffset )    ? selection.anchorOffset 
                                                                                : selection.focusOffset;
        let endIndex = ( selection.anchorOffset <= selection.focusOffset )  ? selection.focusOffset
                                                                            : selection.anchorOffset;

        /**идекс узла(а точнее его текста) куда происходит вставка */
        let index = parentHtml.indexOf(anchorNode.nodeValue);

        if(index === -1) index = 0;
        //throw new Error("Couldn't find place to insert new text");

        let leftHand = parentHtml.slice(0, index + startIndex);
        let rightHand = parentHtml.slice(index + startIndex + (endIndex - startIndex));

        //console.log("[troumboune]: selection text", selectionText);
        //console.log("[troumboune]: BEFORE parentHTML", parentHtml);            
            
        parentHtml = leftHand + `<span class="doc_elements" data-element="${callerId}" tabindex="0">${selectionText}</span>` 
                        + rightHand;
       

        //исправленная строка применяется к элементов в котором находился узел и селекшон
        parentElement.innerHTML = parentHtml;
        docClassController.saveHtmlState();
    }

    
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


