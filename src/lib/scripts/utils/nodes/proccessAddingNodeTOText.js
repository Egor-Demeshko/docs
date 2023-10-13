import sanitizeHTML from "$lib/scripts/utils/sanitizeHTML.js";
import {storeForSimpleTexts, docRoot, documents} from "$lib/scripts/stores";
import { get } from "svelte/store";


export function processSelection(callerId){
    
    const docClassController = get( documents );
    const specSymbols = {"&nbsp;": "┠"};
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

    /** обработаем отдельно случай, когда мы кликаем на пустой строке. */
    if(parentElement.id === "container" && 
        selection.anchorNode.tagName === "P" &&
        (selection.anchorNode.children.length === 0 ||
        selection.anchorNode.children.length === 1)){

            handleEmptyLineClick( selection.anchorNode, callerId, selectionText);
            
            docClassController.setDocumentUpdated();
            docClassController.saveHtmlState();
            makeReconnect(root);
            setCaret(parentElement);
            return;
    }


    {   
        /**@description корректирующие индексы, из селекшена */
        let startIndex = ( selection.anchorOffset <= selection.focusOffset )    ? selection.anchorOffset 
                                                                                : selection.focusOffset;
        let endIndex = ( selection.anchorOffset <= selection.focusOffset )  ? selection.focusOffset
                                                                            : selection.anchorOffset;

        let htmlWithWhiteSpaces = createWhiteSpaces(parentHtml, specSymbols); 
        /**проверяем диапозан вставки на наличие спец. симповолов*/
        parentHtml = removeSpecSymbol(parentHtml, specSymbols);

        /**идекс узла(а точнее его текста) куда происходит вставка,
         * если мы вставляем node в конец предложения, где уже есть наш узел, там будет пробел.
         * почему-то отказывается и indexOf и search искать. при этом этот проблемы мы сами добавляем.
         * так как тогда поиск вообще в это одной строкой считает.
        */
        let index = htmlWithWhiteSpaces.search(new RegExp(anchorNode.nodeValue.trim()));
        if(index === -1) index = 0;
        //throw new Error("Couldn't find place to insert new text");

        let leftHand = parentHtml.slice(0, index + startIndex);
        let rightHand = parentHtml.slice(index + startIndex + (endIndex - startIndex));

        //console.log("[troumboune]: selection text", selectionText);
        //console.log("[troumboune]: BEFORE parentHTML", parentHtml);            
            
        parentHtml = leftHand + `<span class="doc_elements" contenteditable="false" range="true" data-element="${callerId}" tabindex="0">${selectionText}</span>` 
                        + ((rightHand.length > 0) ? " " : "") + rightHand;
       
        parentHtml = restoreSpecSymbols(parentHtml, specSymbols);
        //исправленная строка применяется к элементов в котором находился узел и селекшон
        parentElement.innerHTML = parentHtml;
        docClassController.setDocumentUpdated();
        docClassController.saveHtmlState();
    }

    
    makeReconnect(root);
    setCaret(parentElement);
}

function createWhiteSpaces(html, specSymbols /** @type {Object} */) {
    for(let key of Object.keys(specSymbols)){
        html = html.replaceAll(new RegExp(key, "g"), " ");
    }

    return html;
}


function handleEmptyLineClick(node, callerId, selectionText) {
    /**удаляем наследников */
    const children = Array.from(node.children);
    children.forEach( (el) => el.remove() );
    
    /**вставляем наш элемент */
    node.innerHTML = `<span class="doc_elements" data-element="${callerId}" range="true" tabindex="0">${selectionText}</span>`;
}


/**
 * Initializes a reconnection process by calling conect function
 *
 * @return {void} Returns nothing.
 */
function makeReconnect(root){
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

function restoreSpecSymbols(html, specSymbol){
    for( let [key, value] of Object.entries(specSymbol)){
        html = html.replaceAll(value, key);
    }
    return html;
}


function setCaret(parentElement){
    const range = document.createRange();
    const sel = window.getSelection();

    const elem = parentElement.querySelector(`[range]`);

    if(!elem) return;

    if(elem.nextSibling){
        range.setStartBefore(elem.nextSibling);
    } else if(elem.previousSibling){
        range.setStartAfter(elem.previousSibling);
    } else {
        range.setStartAfter(elem);
    }


    range.collapse();

    sel.removeAllRanges();
    sel.addRange(range);

    elem.removeAttribute("range");
}


/**удаляем спец.символы так как Selection в offset считает их отдельными элементами, а в 
 * строки HTML они идут всем набором, влияет на длинну.
 * Меня на редкие элементы, а не на пробелы чтобы знать потом куда эти спец. символы вернуть
 */
function removeSpecSymbol(html, specSymbols){ 
    for( let [key, value] of Object.entries(specSymbols)){
        html = html.replaceAll(new RegExp(key, "g"), value);

    }

    return html;
    /*
    for(let i = 0; i < specSymbols.length; i++){
        let specIndex = html.indexOf(specSymbols[i]);
        /**не нашли спец.символ, смотрим следующий */
      /*  if(specIndex ===-1) continue;

        checkAllSuchSymbols(specIndex, specSymbols[i], specSymbols[i].length);
    }*/

    return {startIndex, endIndex};

    function checkAllSuchSymbols(specIndex, specSymbol , specSymbolLength){
        let specialElementsFound = 1;
        

        while(true){
            if(specIndex <= startIndex && startIndex + specSymbolLength < specIndex + specSymbolLength){
                /**если наш стартовый индекс, куда должна осуществится вставка
                 * попал на спец. элемент, то надо перепистить вставку на после спец. элемента
                */
                startIndex = specIndex + specSymbolLength;
                /**если при этом стратовый индекс стал больше конечного,
                 * а такое может быть, например, если у нас был клик в одну точки и мы попали на спец.
                 * символ(длинный пробел), то надо конечный индекс прировнять к стартовому
                 */
                if(startIndex > endIndex) endIndex = startIndex;
                break;
            } else {
                specIndex = html.indexOf(specSymbol, specIndex + specSymbolLength);
                if(specIndex === -1) break;
                startIndex = startIndex + specSymbolLength;
            }
        } 
    }
}

