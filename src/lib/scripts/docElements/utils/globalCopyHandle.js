import {PUBLIC_ELEMENTCLASS} from '$env/static/public';
import { nextElementForward, previousNode } from "$lib/scripts/docElements/utils/nextElement.js";

export default function globalCopyHandle(e, reconnect){
    /**при копировании нам важно соблюсди общую концепцию работы с нашими узлами, наш узел интерактивно копируется 
     * только если он выбран целиком, а если в выделение попадает только кусочек узла, то копируется только кусочек 
     * текста
     */

    const selection = window.getSelection();
    
    var textTowriteToBuffer = '';

    //console.log("[globalCopyHandle]: selection  ", selection);

    const selectionAnchor = selection.anchorNode;
    const selectionFocus = selection.focusNode;
    const anchorOffset = selection.anchorOffset;
    const focusOffset = selection.focusOffset;


      /**
       * проверить выделенные элементы анкера и фокуса имеют ли спан родителя , как описываем мы
       * если нет, то все ретурн, оставляем стандартное выполнение
       * иначе
       * отменить выполнение по умолчанию. запускаем наш алгоритм*/
    let anchorParent = selectionAnchor.parentElement;
    let focusParent = selectionFocus.parentElement;

    //console.log("[GlobalRedactorEvents]: anchorParent && focusParent ", {anchorParent, focusParent});

    if(!(anchorParent.classList.contains(PUBLIC_ELEMENTCLASS)) && 
      !(focusParent.classList.contains(PUBLIC_ELEMENTCLASS))){

          reconnect();
          return;
    }

    e.preventDefault();
    /**Определяем в какую сторону будет идти парсинг. выделение может быть слево-направо или справо-налево */
    let direction = selectionAnchor.compareDocumentPosition(selectionFocus);

    if(direction === 2){
        textTowriteToBuffer = goToLeft();
    } else if(direction === 4){
        textTowriteToBuffer = goToRight();
    }

    e.clipboardData.setData("text/html", textTowriteToBuffer);


    function goToLeft(){
        let text = '';
        let element = selectionAnchor;
        selection.empty();
        
        return gartherTextToLeft();

        /*сразу копируем текст частично у анкорэлемента
        в цикле идем по следующим элементам, копируем текст*/
        function gartherTextToLeft(){
            console.log("WE ARE GOING TO LEFT");

            //debugger;
            /**перебераем dom node в поисках фокус ноды и копируем текст
             * если span элемент, без нашей ноды копируем полностью
             * если span элемент, c focusNode нодой, то копируем текст, до этой ноды.
             * когда встретим focuNode вне спан элемента, копируем текст, без копирования узла.
             * возрат текста
             */
            garthertext: while(true){

                if(element === selectionAnchor){
                    text = selectionAnchor.textContent.slice(0, anchorOffset);
                    element = previousNode(element);
                    continue garthertext;
                }

                if(element?.classList?.contains(PUBLIC_ELEMENTCLASS)){
                    const childNodes = element.childNodes;
                    let textFromInnerNodes = "";

                    for(let i = childNodes.length - 1; i >= 0; i--){
                        const innerNode = childNodes[i];
                        
                        if(innerNode === selectionFocus){
                            return innerNode.textContent.slice(focusOffset) + textFromInnerNodes + text;
                        }

                        textFromInnerNodes = innerNode.textContent + (textFromInnerNodes.length === 0) ? "" : " ";
                    }

                    text = element.outerHTML + " " + text;
                    element = previousNode(element);
                    continue garthertext;
                }

                if(element === selectionFocus){
                    return element.textContent.slice(focusOffset) + " " + text;
                }

                if(element instanceof HTMLElement){
                    
                    if(element.contains(selectionFocus)){
                        element = element.lastChild;
                        return gartherTextToLeft();
                    } else {
                        text = element.outerHTML + " " + text;
                        element = previousNode(element);
                        continue garthertext;
                    }
                }

                text = element.textContent + " " + text;
                element = previousNode(element);
            }
        }
    }


    function goToRight(){
        let text = '';
        let element = selectionAnchor;
        selection.empty();

        return gartherTextToRight();

        
        function gartherTextToRight(){
            //console.log("WE ARE GOING TO Right");
            
            
            garthertext: while(true){

                if(element === selectionAnchor){
                    text = selectionAnchor.textContent.slice(anchorOffset) + " ";
                    /**возможно довольно глубокая вложенность и стартовый узел может оказаться последним
                     * например в элемент спан, а затем в элементе p
                     */
                    element = nextElementForward(element);
                    if(element){
                        continue garthertext;
                    } else {
                        return text;
                    }
                }
                
                
                if(element?.classList?.contains(PUBLIC_ELEMENTCLASS)){
                    const childNodes = element.childNodes;
                    let textFromInnerNodes = "";
                    
                    for(let i = 0; i < childNodes.length; i++){
                        const innerNode = childNodes[i];
                        
                        if(innerNode === selectionFocus){
                            return text += textFromInnerNodes + innerNode.textContent.slice(0, focusOffset);
                        }
                        
                        textFromInnerNodes += innerNode.textContent  + " ";
                    }
                    
                    text += element.outerHTML + " ";
                    element = nextElementForward(element);
                    continue garthertext;
                }
                
                if(element === selectionFocus){
                    return text += element.textContent.slice(0, focusOffset);
                }

                if(element instanceof HTMLElement){
                    
                    if(element.contains(selectionFocus)){
                        element = element.firstChild;
                        return gartherTextToRight();
                    } else {
                        text += element.outerHTML + " ";
                        element = nextElementForward(element);
                        continue garthertext;
                    }
                }
                
                text += element.textContent + " ";
                element = nextElementForward(element);
            }
        }
    }
}