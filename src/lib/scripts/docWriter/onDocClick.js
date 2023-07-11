import { interectiveOverlapShow, modalFieldsStore, storeForSimpleTexts, textElementsData, docRoot } from "$lib/scripts/stores";
import SimpleText from "$lib/scripts/docElements/simpleText";

export default function onDocClick(e){
    e.stopPropagation();
    //console.log("[onDocClick]: startselect event: ", e);
    let doc;

    docRoot.update( (elem) => doc = elem);
 
    
    if(doc){
        doc.addEventListener("pointerup", async function pointerUp(e){
            e.stopPropagation();
            const range = document.getSelection().getRangeAt(0);
            //console.log("[onDocClick]: range: ", range);


            /**Show modal, and then logic to save state*/
            modalFieldsStore.update( (obj) => {
                obj.show = true;
                obj.inputValue = range.extractContents().textContent;

                //console.log("[onDocClick]: modalFieldsStore update: ", obj);               
                return obj;
            });
            

            {
                //TODO генерация ID и задавать имя переменной
                // greating DOM element, and JS class to rule
                let newElementClass = new SimpleText(999, 'test', '');
                let newElement = document.createElement("span"); 

                
                newElement.classList.add("doc_elements");
                range.insertNode(newElement);
                
                      
                /** subscribing with store, to handle data change */
                let unsubscribe = modalFieldsStore.subscribe( (obj) => {
                    if(!obj.inputValue) return;
                    
                    //console.log("[POinterUP]: [subscribe]: newElementOBJ: ", {newElementClass});       
                    newElement.textContent = obj.inputValue;
                    
                    if(!obj.show && obj.inputValue){
                        /**обновляем сторы , если модалка уже не показывается*/      
                        setTimeout( () => interectiveOverlapShow.set(false), 600);  

                        newElementClass.updateDomLink(newElement);
                        newElementClass.setTextData({ name: "test", content: obj.inputValue });
                        storeForSimpleTexts.update( (simpleTextElements) => {
                            simpleTextElements.push(newElementClass);
                            return simpleTextElements;
                        });

                        textElementsData.update( function updateDatastore(data){
                            data.push({
                                "name": "test",
                                "id": 999,
                                "content": obj.inputValue
                            });
                            return data;
                        });
                        
                        unsubscribe();
                    } else if(!obj.show && !obj.inputValue){
                        /**Если у модального окна не был заполнен инпут, то сохранять нечего, удаляем элемент из дума */
                        newElement.remove();
                        range.insertNode(range.extractContents().textContent);

                        unsubscribe();
                    }
                });

            }
        }, {once: true});
    }
}