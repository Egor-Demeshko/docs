import sanitizeHTML from "$lib/scripts/utils/sanitizeHTML.js";
import {storeForSimpleTexts, docRoot} from "$lib/scripts/stores";


export function processSelection(callerId, eventSelection){
    if(!eventSelection) return;
    let root;
    let selection = window.getSelection();
    let anchorNode = selection.anchorNode;
    let parentElement = "";
    let parentHtml = "";
    let selectionText = "";

    docRoot.update( (docRoot) => {
        root = docRoot;
        return docRoot;
    });
    
    console.log("[Troumboube]: selection changed: ", selection);
    
    //убедится что в одном элементе выделение ,если нет то выкинуть сообщение о том что переменняа не должна 

    if(anchorNode !== selection.focusNode){

        document.dispatchEvent(new CustomEvent("error", {
            detail: {
                err_data: [
                    {
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

    //надо взять текст, берем весь элемент как html строку
    //санитизировать его от скриптов
    {
        parentElement = anchorNode.parentElement;
        parentHtml = parentElement.innerHTML;


        parentHtml = sanitizeHTML(parentHtml);
    }

    //сделать из него span с айди и вставить в разметку.
    //получаем текст
    {   
        let text = selection.anchorNode.nodeValue;
        let anchorI = selection.anchorOffset;
        let focusI = selection.focusOffset;

        if(anchorI < focusI){
            selectionText = text.slice(anchorI, focusI);
        } else {
            selectionText = text.slice(focusI, anchorI);
        }
        console.log("[troumboune]: selection text", selectionText);
        //console.log("[troumboune]: BEFORE parentHTML", parentHtml);

        {
            //ищем индекс  в парентХТМЛ, текущий по всему тексту из NodeAnchor
            let index = parentHtml.indexOf(anchorNode.nodeValue);

            if(index === -1) throw new Error("Couldn't find place to insert new text");
            //вырезаем строку с этого индекса. вырезанное сохраняем

            let cutString = parentHtml.slice(index);
            // в вырезанной строке находим наш текст для заменя, те селекшон текст
            let updatedCutString = cutString.replace(selectionText, `<span class="doc_elements" data-element="${callerId}" tabindex="0">${selectionText}</span>`);
            // меняем
            parentHtml = parentHtml.replace(cutString, updatedCutString);

        }

        //исправленная строка применяется к элементов в котором находился узел и селекшон
        parentElement.innerHTML = parentHtml;
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


