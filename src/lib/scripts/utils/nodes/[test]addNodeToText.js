import sanitizeHTML from "$lib/scripts/utils/sanitizeHTML.js";
import {storeForSimpleTexts, docRoot, documents, nodes} from "$lib/scripts/stores";
import { get } from "svelte/store";
import { makeReconnect, showError } from "$lib/scripts/utils/nodes/nodeToTextService.js";

const STARTSPECSYMBOL = "ƈ";

export function processSelection(callerId){
    const docClassController = get( documents );
    const root = get(docRoot);
    /**HTML строка, родителя node в который происходит вставка */
    let parentHtml = "";
    let parentElement = '';
    let selection = window.getSelection();
    const {anchorNode, focusNode, anchorOffset, focusOffset} = selection;
    
   // const range = selection.getRangeAt(0);
    
    
    //проверяем чтобы выделение не попадало на наш спан элемент
    if(isSpanElement(anchorNode, focusNode)) return;
    //для anchorNode и focusNode находим ближайшего общего родителя
    parentElement = searchForTheSameParent(anchorNode, focusNode, true);
    if(!parentElement) return;
    debugger;
    {
        //добавляем спец.символы.
        let addSymbol = function(node, offset){
            let value = node.nodeValue;
            let left = value.slice(0, offset);
            left += STARTSPECSYMBOL;
            let right = value.slice(offset);
            node.nodeValue = left + right;
        }
        addSymbol(anchorNode, anchorOffset);
        addSymbol(focusNode, focusOffset);
    }

    //теперь находим индекс нашего текста в родителем
    parentHtml = parentElement.innerHTML;
    parentHtml = sanitizeHTML(parentHtml);
    



    
/**
    //если
    if(parentElement.id === "container"){
        
    } else {
        findForStartNode(anchorNode, focusNode, anchorOffset, focusOffset, parentElement);
    }*/
   // range.extractContents();
    //находим какой из node идет раньше, так как при выделении anchorNode может быть раньше,
    //а может позже, если выделение идет в обратную сторону
    

    //ищем индекс текста в родителе, вырезаем и меняем на разметку нашего элемента
    let startIndex = parentHtml.indexOf(STARTSPECSYMBOL);
    let endIndex = parentHtml.lastIndexOf(STARTSPECSYMBOL);

    if(startIndex < 0 || endIndex < 0){
        showError("Не смог установить якорные точки", "warning");
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

    docClassController.setDocumentUpdated();
    docClassController.saveHtmlState();
    makeReconnect(root);
    
    
}


/**мы в качестве нашего узла в тексте используем span элемент,
 *  проверить что частичное выделение не в нем */
function isSpanElement(...args){
    for(let i = 0; i < args.length; i++){
        const nodeElement = args[i];

        /**возможно якорный и фокусный элемент это сам спан */
        if(nodeElement?.tagName === "SPAN" && nodeElement.classList.has("doc_elements")){
            showError("Нельзя вставить узел в переменную.", "highlight");
            return true;
        }
    }
}

/**
 * Этот код определяет функцию с именем searchForTheSameParent, которая принимает два элемента 
 * в качестве входных данных. Он находит родительский элемент для каждого входного элемента и 
 * проверяет, являются ли они одинаковыми. Если да, то возвращается общий родительский элемент. 
 * Если нет, то функция рекурсивно вызывает саму себя с родительскими элементами в качестве 
 * аргументов, пока не будет найден общий родительский элемент.
 */
function searchForTheSameParent(firstElement, secondElement){

    if(firstElement === secondElement) return firstElement;

    firstElement = firstElement.parentElement;
    secondElement = secondElement.parentElement;
    
    if(firstElement === secondElement) return firstElement;
    firstElement = firstElement.closest("p");
    secondElement = secondElement.closest("p");

    if(firstElement === secondElement) return firstElement;

    firstElement = firstElement.closest("#container");
    secondElement = secondElement.closest("#container");

    if(firstElement === secondElement) return firstElement;


    showError("Не удалось установить связи с родителем.", "emergency");
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