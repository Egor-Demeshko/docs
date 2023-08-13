import { nodes, storeForSimpleTexts } from "$lib/scripts/stores";

export default class RedactorEvents{
        #id;
        #domLinks;
        #connectedClass;

        createListeners(domLinks, id, connectedClass){
                this.#domLinks = domLinks;
                this.#id = id;
                this.#connectedClass = connectedClass;

                /*слушатель для вырезания текста, исключительно в границах элемента" */
                domLinks.forEach( (domLink) => {
                        domLink.addEventListener("cut", this.#cutHandler.bind(this));                              
                });

                domLinks.forEach( (domLink) => {
                        domLink.addEventListener("paste", this.#pasteHandle.bind(this));
                });
        }


        /**
         * редактор trumbowyg при редактировании себя любимого все перерисовывает
         * поэтому необходимо кастомно реализовать вырезание данных,
         * а затем восстанавливать связь с узлами
         */
        #cutHandler(e){
                const target = e.target;
                let textContent = target.textContent;  
                const selection = window.getSelection();
                const selectedText = selection.toString();
                const clipboard = navigator.clipboard;
                
                /** убеждаяемся что выделение в одном элементе */
                if(selection.anchorNode !== selection.focusNode) return;
                /*console.log("[EditRedactor]: CUT EVENT", {
                        "anchorNode": selection.anchorNode,
                        "focusNode": selection.focusNode
                });*/
                e.preventDefault();


                //записываем выделенный текст в буфер обмена
                clipboard.writeText(selectedText);
                
                
                /* если длина текста и длина выборки равны, значит будет удаление всего текста, узел мы оставляем, вместо 
                него будет подставлен текст заглушка */
                if(textContent.length === selectedText.length){
                        console.log("[EditRedactor]: DELETE ELEMENT");

                        textContent = "__________________";
                        
                } else {
                        /**необходимо теперь получить новый текст, который должен остаться после вырезания */
                        textContent = textContent.replace(selectedText, "");
                }
                

                

                nodes.update( (allNodes) => {
                        for(let i = 0; i < allNodes.length; i++ ){
                                if(allNodes[i]['id'] !== this.#id) continue;

                                allNodes[i]['content'] = textContent;
                                break;
                        }
                        return allNodes;
                });


                setTimeout(() => {
                        storeForSimpleTexts.update( (allTextClasses) => {
                                allTextClasses.forEach( (obj) => {
                                        obj.connect();
                                        obj.createListeners();
                                });
                                return allTextClasses;
                        });

                        /**после того как текст удален, разметка перерисована, элемент теряет фокус. */
                        document.querySelector(".doc_active")?.focus();
                }, 30);
        }

        /**
         * также как и с вырезанием, trumbowyg перерисует внутренне содержание редакторая, связь с переменными будет потеряна
         */
        #pasteHandle(e){
                console.log("[EditRedactor]: PASTE EVENT");
                // получить элемент selection
                // получить текст из selection, 
                // получить текст из textContent элемета
                // проверить чтобы Range был внутри одного элемента.
                // получить данные из clipboard 
                // строку из selection меняем на строку из clipboard 
                // удаляем селекшон
                
                //все обновляем
                
                const selection = window.getSelection() || navigator.getSelection();
                const textSelected = selection.toString();
                let textContent = e.target.textContent;
                let clipboardText = e.clipboardData.getData("text/plain");
                
                if(selection.anchorNode !== selection.focusNode) return;
                e.preventDefault();
                
                let textToAppend = textContent.replace(textSelected, clipboardText);
                selection.deleteFromDocument();

                nodes.update( (allNodes) => {
                        for(let i = 0; i < allNodes.length; i++ ){
                                if(allNodes[i]['id'] !== this.#id) continue;

                                allNodes[i]['content'] = textToAppend;
                                break;
                        }
                        return allNodes;
                });


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
}
