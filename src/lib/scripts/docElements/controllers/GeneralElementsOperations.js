import { storeForSimpleTexts } from "$lib/scripts/stores";
import { get } from "svelte/store";

export default class GeneralElementsOperations{
    constructor(){
        
    }

    /**
     * @description { id, active } далее этот обьект используется для обновления store для dom
     * @param {Array} idsToUpdate 
     */
    static updateDomElementsVisibility(idsToUpdate){
       
        const simpleTexts = get(storeForSimpleTexts);

        //иттерируемся по simpleTexts через цикл for.
        //сравниваем каждый simpleText.id с idsToUpdate.id, если совпадает, то 
        //вызываем метод changeVisibility();

        for (let i = 0; i < simpleTexts.length; i++) {
            const element = simpleTexts[i];
            const id = element.id;
            
            /**
             * @description simpletext(element) id, возращает node id
             */
            for( let i = 0; i < idsToUpdate.length; i++){
                // data : {id, active}
                const data = idsToUpdate[i];
                if(data.id === id){
                    
                    element.changeVisibility(data.active);
                }
            }
        }
    }
}