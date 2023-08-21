import SimpleTextForAnketa from "$lib/scripts/anketa/SimpleTextForAnketa.js";
import { storeForSimpleTexts } from "$lib/scripts/stores"; 


export default function generateTextElements(graph, html){
    let arr = []; //массив для элементов


    graph.forEach( (obj) => {
        let id = obj.id;
        let active = obj.active;

        if(active){
            html = html.replaceAll(`%id=(${id})%`, `<span class="doc_elements" data-element="${id}" tabindex="0"></span>`);
        } else {
            html = html.replaceAll(`%id=(${id})%`, `<span class="doc_elements no_display" data-element="${id}" tabindex="0"></span>`);            
        }

        arr.push(new SimpleTextForAnketa(obj));
    });

    storeForSimpleTexts.set(arr);
    return html;
}