import SimpleText from "$lib/scripts/docElements/simpleText.js";
import { storeForSimpleTexts } from "$lib/scripts/stores"; 


export default function generateTextElements(graph, html){
    let arr = []; //массив для элементов


    graph.forEach( (obj) => {
        let id = obj.id;
        html = html.replaceAll(`%id=(${id})%`, `<span class="doc_elements" data-simpleText="${id}" editable="false"></span>`);
        arr.push(new SimpleText(obj));
    });

    storeForSimpleTexts.set(arr);
    return html;
}