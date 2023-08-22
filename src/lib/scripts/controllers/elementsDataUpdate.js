import { storeForSimpleTexts } from "$lib/scripts/stores";

/**обновляем данные самих элементов дом, а также классы которые ими управляют */
export default async function elementsDataUpdate({id, name, content}){

    
    storeForSimpleTexts.update( (arrayOfElementsObj) => {
        //console.log("[elementsDataUpdate]: ");
        for(let i = 0; i < arrayOfElementsObj.length; i++){
            if(arrayOfElementsObj[i]["id"] !== id) continue;

            arrayOfElementsObj[i].setTextData({name, content});

            /*console.log("[ElementsDataUpdate]: $storeForSimpleTexts {name, content}: ", {
                name, content
            })*/
            break;
        }

        return arrayOfElementsObj;
    });
}  