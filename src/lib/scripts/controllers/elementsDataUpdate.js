import { textElementsData } from "$lib/scripts/stores";
import { storeForSimpleTexts } from "$lib/scripts/stores";

export default async function elementsDataUpdate({id, name, content}){
    let element;
    let data;


    /**обновляем данные самих элементов дом, а также классы которые ими управляют */
    storeForSimpleTexts.update( (textElements) => {
        /*console.log("elementsDataUpdate: ", textElements);*/
        if(!textElements || textElements.length == 0) return textElements;
        textElements = textElements.map( (element) => {
            if(element.id === id){
                element.setTextData({name, content});
            }
            return element;
        });

        return textElements;
    });


    /**голую дату элементов */
   textElementsData.update( (textObjData) => {

        console.log("elementsDataUpdate: ", textObjData);
        if(!textObjData || textObjData.length == 0) return textObjData;

        textObjData = textObjData.map( (dataObj) => {
            if(dataObj.id === id){
                dataObj.name = name;
                dataObj.content = content;
            }
            return dataObj
        });

        return textObjData;
   });
}  