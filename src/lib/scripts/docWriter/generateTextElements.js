import SimpleText from "$lib/scripts/docElements/simpleText.js";
import { storeForSimpleTexts } from "$lib/scripts/stores"; 


export default function generateTextElements(graph, html){
    let arr = [];   //массив для нами созданных элементов и добавленных в разметку html текста(полученного из docx). 
                    //Эти элементы управляются классами simpleTexts или SimplifiedSimpleTexts, 
                    //которые используется в анкете
    createJSRuleObject();
    
    storeForSimpleTexts.set(arr);

    /*html массив обьектов описывающих один одокумент. состав полей описано в /scripts/stores => переменная documents  */
    /**меняет в разметке метки с айди на нужные элементы и объекты*/
    /*html.forEach( (htmlObj, i) => {
        let string = htmlObj.string;

        if(!string)return;*/

        /*
        graph.forEach( (obj) => {
            let id = obj.id;
            let active = obj.active;
    
            if(active){
                string = string.replaceAll(`%id=(${id})%`, `<span class="doc_elements" contenteditable="false" data-element="${id}" tabindex="0"></span>`);
            } else {
                string = string.replaceAll(`%id=(${id})%`, `<span class="doc_elements no_display" contenteditable="false" data-element="${id}" tabindex="0"></span>`);            
            }
        });*/

        /*htmlObj.string = string;
    });*/



    return html;
    
    /**генерируем JS обьекты, которые будут управлять элементами на документе*/
    function createJSRuleObject(){

        graph.forEach( (obj) => {
            arr.push(new SimpleText(obj));
        });
    }
}