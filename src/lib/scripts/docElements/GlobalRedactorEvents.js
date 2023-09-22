import { storeForSimpleTexts } from "$lib/scripts/stores";
import globalCopyHandle from "$lib/scripts/docElements/utils/globalCopyHandle.js";
import { nextElementForward, previousNode } from "$lib/scripts/docElements/utils/nextElement.js";
import stack from "$lib/scripts/docElements/utils/stack.js";
import { documents } from "$lib/scripts/stores.js";
import sanitizeHTML from "$lib/scripts/utils/sanitizeHTML.js";
import { get } from "svelte/store";


export default function createOnDocumentRedactorEvents(redactorRoot){
    let stackInstance = stack(redactorRoot);

    redactorRoot.addEventListener("cut", (e) => cutHandle(e, stackInstance));
    redactorRoot.addEventListener("paste", (e) => pasteHandle(e, stackInstance, redactorRoot));
    redactorRoot.addEventListener("copy", (e) => globalCopyHandle(e, reconnect));
}


function cutHandle(e, stack){
    const doc = get(documents);
      /** 
       *  когда идет вырезание большого куска текста. мы сохраняем узлы, кроме крайних
       *  крайние элементы должны быть очищены от тега span, оставлены просто текстом.
       *  узлы попавшие целиком, сохраняют разметку автоматом, благодаря редактору. после вставки текста,
       * текст вставляется с разметкой включающей наши элементы(узлы), достаточно обеспечить реконнект.
       * желательно чтобы кусочки копировались, но не меняли содержимого узла, при этом кусочки были чисты и невинные 
       * и вставлялись как текст    
       */
        const selection = window.getSelection();
        var textTowriteToBUffer = '';

        console.log("[GlobalRedactorEvents]: selection  ", selection);

        const selectionAnchor = selection.anchorNode;
        const selectionFocus = selection.focusNode;
        const anchorOffset = selection.anchorOffset;
        const focusOffset = selection.focusOffset;
        /**в этот сет сохраняем элементы которые нужно будет удалить. 
        * Сразу из цикла не получилось реализовать удаление,
        * так как не работают тогда методы DOM, особенно для поиска
        */
        const elementsToBeDeleted = new Set();


        /**
       * проверить выделенные элементы анкера и фокуса имеют ли спан родителя , как описываем мы
       * если нет, то все ретурн
       * иначе
       * отменить выполнение по умолчанию
       * необходимо будет делать парсинг, тоесть инди по всем элементам, и собирать их в кучу, 
       * проверяя нет ли там нашего конечного
       * второй шаг оставим на потом
       * */

        let anchorParent = selectionAnchor.parentElement;
        let focusParent = selectionFocus.parentElement;

        //console.log("[GlobalRedactorEvents]: anchorParent && focusParent ", {anchorParent, focusParent});

        if(!(anchorParent.classList.contains("doc_elements")) && 
          !(focusParent.classList.contains("doc_elements"))){

                reconnect();
                doc.saveHtmlState();
                doc.setDocumentUpdated();      
                return;
        }

        
        /**отменить стандартное выполение */
        e.preventDefault();
        /**пока используется для разовой отмены вставки, сразу после этого действия */
        /*stack.setActive();*/
        //используя compareDocumentPosition узнать в какую сторону нам идти
        //метод возращает число, поэтому если 2, в методе selectionAnchor.compareDocumentPosition(selectionFocus)
        //то значить focus идет перед анкор, значит надо делать node.previousSibling для сборка текста
        // если цифра 4 значить node.nextSibling
        let direction = selectionAnchor.compareDocumentPosition(selectionFocus);


        if(direction === 2){
            
            textTowriteToBUffer = goLeft();
           
        } else if(direction === 4){
            try{
                textTowriteToBUffer = goRight();
            } catch (e){
                console.log(e.message);
            }
        }


        textTowriteToBUffer = sanitizeHTML(textTowriteToBUffer);
        e.clipboardData.setData("text/html", textTowriteToBUffer);

        //сохраняем состояние документа 
        doc.setDocumentUpdated();   
        doc.saveHtmlState();

        /**
         * Базовый случай, это когда мы идем просто по нодам
         * ищем среди них на фокус нод.
         * 
         */
        function goLeft(){
            let text = "";
            let element = selectionAnchor;

            /**если мы делаем вырезку в одном абзаце, иногда селекшен при врезке манипуляции с текстом в нод
             * скидывает селекшен на весь элемент.
             */
            selection.empty();


            gartherTextToLeft();            


            /**переводим в массив, так как из сета нельщя нормально ремовы сделать.
             * при кол в том что у Node вызывается метод remove тоже, но он ничего не делает
             * поэтому, например, не получилось использовать ?.
             */
            let arr = Array.from(elementsToBeDeleted);

            for(let i = 0; i < arr.length; i++){
                let el = arr[i];

                if(el instanceof HTMLElement){
                    el.remove();
                } else if(el instanceof Node) {
                    el.parentElement.removeChild(el);
                }     
            }

            return text;
        
            
            function gartherTextToLeft(){              
                

                textsearch: while(true){
                        /**
                     * следующий элемент может быть
                     * span элемент
                     *    если спан, то надо войти и посмотреть есть там там selectionFocus
                     *    если нет, то мы копируем у такого элемента полностью outerHTML
                     *    если есть, то мы вырезаеем кусочек текста, заканчиваем цикл
                     *  просто текст, 
                     * просто текст и равен selectionFocus
                     */
                    if(element instanceof HTMLElement && element.tagName !== "SPAN") {
                        if(element.contains(selectionFocus)){
                            element = element.lastChild;
                            return gartherTextToLeft();

                        } else {

                            text = element.outerHTML + " " + text;
                            elementsToBeDeleted.add(element);
                            element = previousNode(element);
                            continue textsearch;
                        }
                    }


                    if(element.tagName === "SPAN" ){
                        let children = element.childNodes;

                        //проходим по всем детям, если есть совпадение с элементами из селекшен, то вырезаем, вставляем текст
                        //выходим
                        for(let i = children.length - 1; i >= 0; i--){
                            let innerNode = children[i];
                            /**insideSpanText собирает текст нод внутри span, текстовых нод может быть несколько
                             * до того как мы возможно встретимя на фокусэлемент из селекшен.
                             */
                            let insideSpanText = '';

                            if(innerNode === selectionFocus){
                                text = innerNode.textContent.slice(focusOffset) + " " + insideSpanText + text;
                                
                                return;
                            } 

                            insideSpanText = innerNode.textContent + (insideSpanText.length === 0) ? "" : " ";
                        }

                        /**если внутри SPAN не нашлось нашей фокус ноды, то мы копируем разметку целиком, элемент удаляем */
                        /**не использовали метод contains() */
                        text = element.outerHTML + " " + text;
                        elementsToBeDeleted.add(element)
                        element = previousNode(element);
                        continue textsearch;
                    }


                    /**если мы просто встретили фокус ноду, то ее текст копируем согласно оффсета, а вот 
                     * оставшийся текст, необходимо присвоить ноде. эффект вырезания
                     */
                    if(element === selectionFocus){
                        text = selectionFocus.textContent.slice(focusOffset) + " " + text;
                        selectionFocus.textContent = selectionFocus.textContent.slice(0, focusOffset);
                        element = previousNode(element);
                        
                        return;
                    }

                    /**если СТАРТОВАЯ ПОЗИЦИЯ / элемент */
                    if(element === selectionAnchor){
                        text = " " + selectionAnchor.textContent.slice(0, anchorOffset);

                        /** при старте процесса, в любом случае копируем выделенный текст, но
                        * если стартовый элемент является узлом(SPAN связанный с графом), то мы больше ничего не делаем, а вот если
                        * это просто текстовая нода, тогда необходимо у нее оставить только тот текст, который не поделжит вырезке.
                        */
                        if(!anchorParent.classList.contains("doc_elements")){

                            selectionAnchor.textContent = selectionAnchor.textContent.slice(anchorOffset);
                            selection.empty();
                        }
                        element = previousNode(element);
                        continue textsearch;
                    }

                    text = element.textContent + ' ' + text;   
                    //не просто element.remove так как элемент может быть текстовой нодой, а у нее метода ремув нет
                    elementsToBeDeleted.add(element);
                    element = previousNode(element);
                }
            }
        }



        function goRight(){
            let text = "";
            let element = selectionAnchor;

            /**если мы делаем вырезку в одном абзаце, иногда селекшен при врезке манипуляции с текстом в нод
             * скидывает селекшен на весь элемент.
             */
            selection.empty();

            
            gartherTextToRight();

            /**переводим в массив, так как из сета нельщя нормально ремовы сделать.
             * при кол в том что у Node вызывается метод remove тоже, но он ничего не делает
             * поэтому, например, не получилось использовать ?.
             */
            let arr = Array.from(elementsToBeDeleted);

            for(let i = 0; i < arr.length; i++){
                let el = arr[i];

                if(el instanceof HTMLElement){
                    el.remove();
                } else if(el instanceof Node) {
                    el.parentElement.removeChild(el);
                }     
            }

            return text;

            
            function gartherTextToRight(){
              
                textsearch: while(true){
                        /**
                     * следующий элемент может быть
                     * span элемент
                     *    если спан, то надо войти и посмотреть есть там там selectionFocus
                     *    если нет, то мы копируем у такого элемента полностью outerHTML
                     *    если есть, то мы вырезаеем кусочек текста, заканчиваем цикл
                     *  просто текст, 
                     * просто текст и равен selectionFocus
                     */
                    if(element instanceof HTMLElement && element.tagName !== "SPAN") {
                        if(element.contains(selectionFocus)){
                            element = element.firstChild;
                            return gartherTextToRight();
                        } else {
                            text += element.outerHTML + " ";
                            elementsToBeDeleted.add(element);
                            element = nextElementForward(element);
                            continue textsearch; 
                        }
                    }

                    if(element.tagName === "SPAN" ){
                        let children = element.childNodes;

                        //проходим по всем детям, если есть совпадение с элементами из селекшен, то вырезаем, вставляем текст
                        //выходим
                        for(let i = 0; i < children.length; i++){
                            let innerNode = children[i];
                            /**insideSpanText собирает текст нод внутри span, текстовых нод может быть несколько
                             * до того как мы возможно встретимя на фокусэлемент из селекшен.
                             */
                            let insideSpanText = '';

                            if(innerNode === selectionFocus){
                                text += insideSpanText + innerNode.textContent.slice(0, focusOffset);
                                
                                return;
                            } 
                            
                            insideSpanText = innerNode.textContent + " ";
                        }

                        /**если внутри SPAN не нашлось нашей фокус ноды, то мы копируем разметку целиком, элемент удаляем */
                        /**не использовали метод contains() */
                        text += element.outerHTML + " ";
                        elementsToBeDeleted.add(element)
                        element = nextElementForward(element);
                        continue textsearch;
                    }


                    /**если мы просто встретили фокус ноду, то ее текст копируем согласно оффсета, а вот 
                     * оставшийся текст, необходимо присвоить ноде. эффект вырезания
                     */
                    if(element === selectionFocus){
                        text += selectionFocus.textContent.slice(0, focusOffset);
                        selectionFocus.textContent = selectionFocus.textContent.slice(focusOffset);
                                                
                        return;
                    }

                    /**если СТАРТОВАЯ ПОЗИЦИЯ / элемент */
                    if(element === selectionAnchor){
                        text = selectionAnchor.textContent.slice(anchorOffset) + " ";

                        /** при старте процесса, в любом случае копируем выделенный текст, но
                        * если стартовый элемент является узлом(SPAN связанный с графом), то мы больше ничего не делаем, а вот если
                        * это просто текстовая нода, тогда необходимо у нее оставить только тот текст, который не поделжит вырезке.
                        */
                        if(!anchorParent.classList.contains("doc_elements")){
                            selectionAnchor.textContent = selectionAnchor.textContent.slice(0, anchorOffset);
                            selection.empty();
                        }
                        
                        element = nextElementForward(element);

                        continue textsearch;
                    }

                    text += element.textContent + ' ';   
                    //не просто element.remove так как элемент может быть текстовой нодой, а у нее метода ремув нет
                    elementsToBeDeleted.add(element);
                    
                    element = nextElementForward(element);
                }                
            }
        }
}
    
    
function pasteHandle(e, stack, redactorRoot){
    /*if(stack.isActive()){
        stack.saveString();
        stack.disableFlag();
        redactorRoot.addEventListener("keydown", (e) => isFallBackNeeded(e, stack), {once: true});
    }*/
    
    
    reconnect();
    {
        //сохраняем состояние документа
        const doc = get(documents);
        doc.saveHtmlState();
        doc.setDocumentUpdated();
    }
}


function reconnect(){
    /**settime для того чтобы отработало событие cut полность и перерисовался редактор, после этого переподключаемся */
    setTimeout(() => {
      storeForSimpleTexts.update( (allTextClasses) => {
              allTextClasses.forEach( (obj) => {
                      obj.connect();
                      obj.createListeners();
              });
              return allTextClasses;
    });
    }, 30);
}


function isFallBackNeeded(e, stack){
    /*let string = stack.getString();*/
    console.log("setting new html");
    /*
    ;
    if((e.key === "z" && !shiftKey && ctrlKey) || 
    (e.key === "z" && !shiftKey && metaKey)){
        console.log("BACK");
        setNewHtml(string);
    }*/
}