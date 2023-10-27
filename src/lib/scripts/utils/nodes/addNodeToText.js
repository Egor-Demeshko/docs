import sanitizeHTML from "$lib/scripts/utils/sanitizeHTML.js";
import { storeForSimpleTexts, docRoot, documents, nodes } from "$lib/scripts/stores";
import { addExcitingNodeToRedator } from "$lib/scripts/controllers/nodes/processStores/addNodesStore.js";
import { get } from "svelte/store";
import { makeReconnect, showError } from "$lib/scripts/utils/nodes/nodeToTextService.js";

const STARTSPECSYMBOL = "ƈ";


/**функция добавляет разметку узла в текст, 
 * c помощью node ставятся две метки.
 * затем получается html строку, текст до метки 1 и после метки 2 остается
 * в середину вставлятся разметка узла
 */
export function processSelection(callerId){
    const docClassController = get( documents );
    const root = get(docRoot);
    /**HTML строка, родителя обоих nodeValue, focus, anchor полученные из selection */
    let parentHtml = "";
    let parentElement = '';
    let selection = window.getSelection();
    const {anchorNode, focusNode, anchorOffset, focusOffset} = selection;
    
    //проверяем чтобы выделение не попадало на наш спан элемент
    if(isSpanElement(anchorNode, focusNode, callerId)) {
        addExcitingNodeToRedator.set({status: false});
        return;
    }

    //в редких случае, особенно при обычном клике, anchorNode выбирается <p>, при этом
    //если перед точкой, стоит еще один span элемент, получается ситуация, когда
    //якорная нода это <p>, но при этом offset считается от span элемента, или от документа в целом.
    //пока чаще всего это происходит в конце документа. выделим такое событие отдельно
    if(anchorNode.tagName === "P" && focusNode.tagName === "P" && anchorNode === focusNode){
        let html = sanitizeHTML(anchorNode.innerHTML);

        if(checkNodeActivity(callerId)){
            html += " " + `<span class="doc_elements" contenteditable="false" range="true" data-element="${callerId}" tabindex="0"></span>`;
        } else {
            html += " " + `<span class="doc_elements no_active" contenteditable="false" range="true" data-element="${callerId}" tabindex="0"></span>`;
        }

        anchorNode.innerHTML = html;
        afterProcessing(docClassController, root);
        return;
    }

    //для anchorNode и focusNode находим ближайшего общего родителя
    parentElement = searchForTheSameParent(anchorNode, focusNode, true);
    if(!parentElement) {
        showError("Не удалось вставить переменную", "highlight", callerId);
        return;
    }

    {
        //добавляем спец.символы. 
        let addSymbol = function(node, offset, callerId){
            let value = node.nodeValue;
            try{
                let left = value.slice(0, offset);
                left += STARTSPECSYMBOL;
                let right = value.slice(offset);
                node.nodeValue = left + right;
            } catch {
                throw new Error("Не удалось установить якорные точки");
            }
        }

        try{
            addSymbol(anchorNode, anchorOffset, callerId);
            addSymbol(focusNode, focusOffset, callerId);      
        } catch {
            showError("Сюда нельзя добавить переменную", "emergency", callerId);
            return;
        }
    }


    //теперь находим индекс нашего текста в родительском HTMLSTRING
    parentHtml = parentElement.innerHTML;
    parentHtml = sanitizeHTML(parentHtml);


    //ищем индекс текста в родителе, вырезаем и меняем на разметку нашего элемента
    let startIndex = parentHtml.indexOf(STARTSPECSYMBOL);
    let endIndex = parentHtml.lastIndexOf(STARTSPECSYMBOL);

    if(startIndex < 0 || endIndex < 0){
        showError("Не получилось установить якорные точки", "emergency", callerId);
        return;
    }

    let leftHand = parentHtml.slice(0, startIndex);
    let rightHand = parentHtml.slice(endIndex);
    if(checkNodeActivity(callerId)){
        parentHtml = leftHand + `<span class="doc_elements" contenteditable="false" range="true" data-element="${callerId}" tabindex="0"></span>` 
                + ((rightHand.length > 0) ? " " : "") + rightHand;
    } else {
        parentHtml = leftHand + `<span class="doc_elements doc_no_active" contenteditable="false" range="true" data-element="${callerId}" tabindex="0"></span>` 
                + ((rightHand.length > 0) ? " " : "") + rightHand;
    }

    //убрать спец.символ
    parentHtml = parentHtml.replaceAll(STARTSPECSYMBOL, "");
    parentElement.innerHTML = parentHtml;

    afterProcessing(docClassController, root);
}


function afterProcessing(docController, root){
    //удаляем подстветку текстового поля
    addExcitingNodeToRedator.set({status: false});
    docController.setDocumentUpdated();
    docController.saveHtmlState();
    makeReconnect(root);
    setCaret(root);
}


/**мы в качестве нашего узла в тексте используем span элемент,
 *  проверить что частичное выделение не в нем */
function isSpanElement(...args){
    let callerId = args[args.length - 1];

    for(let i = 0; i < args.length; i++){
        const nodeElement = args[i];
        if( typeof nodeElement === 'string' ) return;
        /**возможно якорный и фокусный элемент это сам спан */
        if(nodeElement?.tagName === "SPAN" && nodeElement.classList.contains("doc_elements")){
            showError("Нельзя вставить узел в переменную.", "highlight", callerId);
            return true;
        }
    }
}

//устанавливаем курсор рядом со вставкой блока
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


/**
 * Этот код определяет функцию с именем searchForTheSameParent, которая принимает два элемента 
 * в качестве входных данных. Он находит родительский элемент для каждого входного элемента и 
 * проверяет, являются ли они одинаковыми. Если да, то возвращается общий родительский элемент. 
 * Если нет, то функция рекурсивно вызывает саму себя с родительскими элементами в качестве 
 * аргументов, пока не будет найден общий родительский элемент.
 */
function searchForTheSameParent(firstElement, secondElement){

    if(firstElement instanceof HTMLElement && secondElement instanceof HTMLElement &&
        firstElement === secondElement){
        return firstElement;
    }

    firstElement = firstElement.parentElement;
    secondElement = secondElement.parentElement;
    
    if(firstElement === secondElement) return firstElement;
    firstElement = firstElement.closest("p");
    secondElement = secondElement.closest("p");

    if(firstElement === secondElement) return firstElement;

    firstElement = firstElement.closest("#container");
    secondElement = secondElement.closest("#container");

    if(firstElement === secondElement) return firstElement;


    showError("Не удалось установить связи с родителем.", "emergency", callerId);
    return false;
}

/**функиця находит какой node элемент идет раньше. Надо перебрать всех дочерние узлы у sameParent
 * вернуть узел который идет раньше
 * сразу тут же в стартовой ноде ставим мету использую нестандартный символ.
 * это необходимо, чтобы точно затем найти этот текст, через родителя
*/
function findForStartNode(anchorNode, focusNode, anchorOffset, focusOffset, sameParent){
    let allNodes = Array.from(sameParent.childNodes);

    for(let i = 0; i < allNodes.length; i++){
        const node = allNodes[i];


        if(anchorNode === focusNode && anchorNode === node){
            let startIndex = ( anchorOffset <= focusOffset ) ? anchorOffset : focusOffset;
            pasteString(node, startIndex);
            return node;
        } else if (node === anchorNode){
            pasteString(node, anchorOffset);
            return node;
        } else if (node === focusNode){
            pasteString(node, focusOffset);
            return node;
        }
    }


    function pasteString(node, offset){
        let text = node?.textContent || node.nodeValue;
        let left = text.slice(0, offset);
        let right = text.slice(offset);

        if(node?.textContent){
            node.textContent = left + STARTSPECSYMBOL + right;
        } else {
            node.nodeValue = left + STARTSPECSYMBOL + right;
        }
    }
}

function checkNodeActivity(callerId){
    const nodesArr = get( nodes );

    for(let i = 0; i < nodesArr.length; i++){
        if(nodesArr[i].id === callerId){
            return nodesArr[i].active;
        }
    }
}