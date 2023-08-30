import { storeForSimpleTexts } from "$lib/scripts/stores";


export default function createOnDocumentRedactorEvents(redactorRoot){
    redactorRoot.addEventListener("cut", cutHandle);
    redactorRoot.addEventListener("paste", pasteHandle);
}


function cutHandle(e){
      /** 
       *  когда идет вырезание большого куска текста. мы сохраняем узлы, кроме крайних
       *  крайние элементы должны быть очищены от тега span, оставлены просто текстом.
       *  узлы попавшие целиком, сохраняют разметку автоматом, благодаря редактору. после вставки текста
       * с разметкой включающей наше элементы(узлы) достаточно обеспечить реконнект.
       * желательно чтобы кусочки копировались, но не меняли содержимого узла, при этом кусочки были чисты и невинные 
       * и вставлялись как текст
       * 
       *    
       */

        //создать массив для хранения все наших узлов (html node, не element)
        const textNodes = [];
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
              return;
        }

        
        /**отменить стандартное выполение */
        e.preventDefault();
        //используя compareDocumentPosition узнать в какую сторону нам идти
        //метод возращает число, поэтому если 2, в методе selectionAnchor.compareDocumentPosition(selectionFocus)
        //то значить focus идет перед анкор, значит надо делать node.previousSibling для сборка текста
        // если цифра 4 значить node.nextSibling
        let direction = selectionAnchor.compareDocumentPosition(selectionFocus);


        if(direction === 2){
            textTowriteToBUffer = gartherTextToLeft();
        } else if(direction === 4){
            textTowriteToBUffer = gartherTextToRight();
        }

        e.clipboardData.setData("text/html", textTowriteToBUffer);
       // navigator.clipboard.write(textTowriteToBUffer);

        


        function gartherTextToLeft(){
            console.log("WE GO TO LEFT");
            let text = selectionAnchor.textContent.slice(0, anchorOffset) + " ";
            let element = selectionAnchor;
            
            /** при старте процесса, в любом случае копируем выделенный текст, но
             * если стартовый элемент является узлом(SPAN связанный с графом), то мы больше ничего не делаем, а вот если
             * это просто текстовая нода, тогда необходимо у нее оставить только тот текст, который не поделжит вырезке.
             */
            if(!anchorParent.classList.contains("doc_elements")){
    
                selectionAnchor.textContent = selectionAnchor.textContent.slice(anchorOffset);
                selection.empty();
            }

            textsearch: while(true){
                element = element.previousSibling || element.parentNode.previousSibling;

                /**
                 * следующий элемент может быть
                 * span элемент
                 *    если спан, то надо войти и посмотреть есть там там selectionFocus
                 *    если нет, то мы копируем у такого элемента полностью outerHTML
                 *    если есть, то мы вырезаеем кусочек текста, заканчиваем цикл
                 *  просто текст, 
                 * просто текст и равен selectionFocus
                 */

                if(element.tagName === "SPAN"){
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
                            text += insideSpanText + innerNode.textContent.slice(focusOffset);
                            break textsearch;
                        } 

                        insideSpanText += innerNode.textContent + " ";
                    }

                    /**если внутри SPAN не нашлось нашей фокус ноды, то мы копируем разметку целиком, элемент удаляем */
                    text += element.outerHTML;
                    elementsToBeDeleted.add(element)
                    continue textsearch;
                }

                /**если мы просто встретили фокус ноду, то ее текст копируем согласно оффсета, а вот 
                 * оставшийся текст, необходимо присвоить ноде. эффект вырезания
                 */
                if(element === selectionFocus){
                    text += selectionFocus.textContent.slice(focusOffset);
                    selectionFocus.textContent = selectionFocus.textContent.slice(0, focusOffset);
                    
                    break textsearch;
                }

                text += element.textContent;   
                //не просто element.remove так как элемент может быть текстовой нодой, а у нее метода ремув нет
                elementsToBeDeleted.add(element);
            }


            elementsToBeDeleted.forEach( (value) => {
                value?.remove() || value.parentElement?.removeNode(value);
            });
            return text;
        }


        function gartherTextToRight(){
            console.log("We go to right");
            let text = selectionAnchor.textContent.slice(anchorOffset)+ ' ';;
            let element = selectionAnchor;

            //console.log(element);

            /** при старте процесса, в любом случае копируем выделенный текст, но
             * если стартовый элемент является узлом(SPAN связанный с графом), то мы больше ничего не делаем, а вот если
             * это просто текстовая нода, тогда необходимо у нее оставить только тот текст, который не поделжит вырезке.
             */
            if(!anchorParent.classList.contains("doc_elements")){
                
                selectionAnchor.textContent = selectionAnchor.textContent.slice(0, anchorOffset);
                selection.empty();
            }

            textsearch: while(true){
                element = element.nextSibling || element.parentNode.nextSibling;

                /**
                 * следующий элемент может быть
                 * span элемент
                 *    если спан, то надо войти и посмотреть есть там там selectionFocus
                 *    если нет, то мы копируем у такого элемента полностью outerHTML
                 *    если есть, то мы вырезаеем кусочек текста, заканчиваем цикл
                 *  просто текст, 
                 * просто текст и равен selectionFocus
                 */

                if(element.tagName === "SPAN"){
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
                            break textsearch;
                        } 

                        insideSpanText += innerNode.textContent + " ";
                    }

                    /**если внутри SPAN не нашлось нашей фокус ноды, то мы копируем разметку целиком, элемент удаляем */
                    text += element.outerHTML;
                    elementsToBeDeleted.add(element)
                    continue textsearch;
                }

                /**если мы просто встретили фокус ноду, то ее текст копируем согласно оффсета, а вот 
                 * оставшийся текст, необходимо присвоить ноде. эффект вырезания
                 */
                if(element === selectionFocus){
                    text += selectionFocus.textContent.slice(0, focusOffset);
                    selectionFocus.textContent = selectionFocus.textContent.slice(focusOffset);
                    
                    break textsearch;
                }

                text += element.textContent;   
                //не просто element.remove так как элемент может быть текстовой нодой, а у нее метода ремув нет
                elementsToBeDeleted.add(element);

            }
            //console.log("GARTHERED TEXT: ", text);

            /**необходимо удалить элемент, которые были для этого помечены */
            //console.log("LIST OF ELEMENTS TO BE DELETED", elementsToBeDeleted);
            elementsToBeDeleted.forEach( (value) => {
                value?.remove() || value.parentElement?.removeNode(value);
            });
            return text;
        }
}




function pasteHandle(e){
    /**при вставке мы можем вставлять просто текст или всталять уже скопированный текст из нашего документа.
     * ключевое тут что мы должны вставить наш элемент, как элемент
     * 
     * первоначально нам надо получить данные из буфера.
     * если разметки нашего узла нет, то сделать return
     * если есть, опишем ниже
     *
     */

    reconnect();
}


function reconnect(){
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

