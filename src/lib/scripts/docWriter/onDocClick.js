import { interectiveOverlapShow, modalFieldsStore, storeForSimpleTexts, textElementsData } from "$lib/scripts/stores";
import SimpleText from "$lib/scripts/docElements/simpleText";

export default function onDocClick(e){
    e.stopPropagation();
    let target = e.target;
    let savedInner = target.innerHTML;
    let textContent = target.textContent;


    target.addEventListener("pointerup", async function pointerUp(e){
        let innerTarget = e.target;

        console.log("[pointerup start]innerTarget: ", innerTarget);
        /**
         * 1. показать модалку
         * 2. хорошо бы чтобы элемент уже был вставлен
         * 3. пользователь может отредактировать
         * 4. сохранять переменную и значение только после кнопки ок.
         */
        modalFieldsStore.update( (obj) => {
            obj.show = true;
            console.log("[onDocClick]: modalFieldsStore update: ", obj);

            return obj;
        });

        {
            //поидеи генерация айди, но пока не делаем.
            //и задавать имя переменной
            let newElementObj = new SimpleText(999, 'name', '');
            let newElement = document.createElement("span"); 
            newElement.classList.add("doc_elements");
            innerTarget.after(" ", newElement);     
    
            /**as input changed */
            let unsubscribe = modalFieldsStore.subscribe( (obj) => {
                if(!obj.inputValue) return;
              
                console.log("[POinterUP]: [subscrive]: newElementOBJ: ", {newElementObj});       
                newElement.textContent = obj.inputValue;
                
                if(!obj.show && obj.inputValue){
                    /**обновляем сторы , если модалка уже не показывается*/      
                    setTimeout( () => interectiveOverlapShow.set(false), 600);  
                   
                    storeForSimpleTexts.update( (simpleTextElements) => simpleTextElements.push(newElement));
                    textElementsData.update( function updateDatastore(data){
                        data.push({
                        "name": "test",
                        "id": 999,
                        "content": obj.inputValue
                        });
                        return data;
                    });
                    newElementObj.updateDomLink(newElement);

                    unsubscribe();
                } else if(!obj.show && !obj.inputValue){
                    /**Если у модального окна не был заполнен инпут, то сохранять нечего, удаляем элемент из дума */
                    newElement.remove();
                    unsubscribe();
                }
            });

        }
    }, {once: true});

    let newInner = textContent.split(" ")
                .map( (text) => `<span>${text}</span>`)
                .join('<span> </span>');
    
    target.innerHTML = newInner;
}