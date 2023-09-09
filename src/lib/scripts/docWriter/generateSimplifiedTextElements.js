import SimpleTextForAnketa from "$lib/scripts/anketa/SimpleTextForAnketa.js";
import { storeForSimpleTexts } from "$lib/scripts/stores"; 


export default function generateTextElements(graph, html){
    let arr = []; //массив для элементов
    ;
    createJSRuleObject();

    storeForSimpleTexts.set(arr);


    /**меняет в разметке метки с айди на нужные элементы и объекты*/
    html.forEach( (htmlObj, i) => {
        let string = htmlObj?.string;
        if(!string) return;

        graph.forEach( (obj) => {
            let id = obj.id;
            let active = obj.active;
    
            if(active){
                string = string.replaceAll(`%id=(${id})%`, `<span class="doc_elements" data-element="${id}" tabindex="0"></span>`);
            } else {
                string = string.replaceAll(`%id=(${id})%`, `<span class="doc_elements no_display" data-element="${id}" tabindex="0"></span>`);            
            }
        });

        htmlObj.string = string;
    });



    return html;
    
    /**генерируем JS обьекты, которые будут управлять элементами на документе*/
    function createJSRuleObject(){
        ;
        graph.forEach( (obj) => {
            arr.push(new SimpleTextForAnketa(obj));
        });
    }
}