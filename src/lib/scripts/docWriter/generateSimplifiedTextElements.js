import SimpleTextForAnketa from "$lib/scripts/anketa/SimpleTextForAnketa.js";
import { storeForSimpleTexts } from "$lib/scripts/stores"; 


export default function generateTextElements(graph, html){
    let arr = []; //массив для элементов
    //описание почему коммент ниже
    //createJSRuleObject();

    //storeForSimpleTexts.set(arr);


    /**меняет в разметке метки с айди на нужные элементы и объекты*/
    html.forEach( (htmlObj, i) => {
        let string = htmlObj?.string;
        if(!string) return;

        graph.forEach( (obj) => {
            let id = obj.id;

            //TODO нежнуная строка
            string = string.replaceAll(`%id=(${id})%`, `<span class="doc_elements" data-element="${id}" tabindex="0"></span>`)
                            .replaceAll(`no_display`, ``);
            
        });

        htmlObj.string = string;
    });



    return html;
    
    /**в анкете убираем генерацию элементов на этом моменте. необходимо загрузить все элементы видимыми
     * подключить dom, применить стили к не видимым. но строка html уже должна быть в dom/
     * тут она еще не в дом
     */
    /**генерируем JS обьекты, которые будут управлять элементами на документе*/
    function createJSRuleObject(){
        
        graph.forEach( (obj) => {
            arr.push(new SimpleTextForAnketa(obj));
        });
    }
}