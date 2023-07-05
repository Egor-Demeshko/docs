import SimpleText from "$lib/scripts/docElements/simpleText.js";
import { storeForSimpleTexts } from "$lib/scripts/stores"; 


export default function generateTextElements(graph, html){
    let arr = []; //массив для элементов
    graph.forEach( ({ id, name, content }) => {
        html = html.replaceAll(`%id=(${id})%`, `<span data-simpleText="${id}" editable="false"></span>`);
        arr.push(new SimpleText(id, name, content));
    });

    storeForSimpleTexts.set(arr);
    /*console.log(storeForSimpleTexts);*/
    return html;
}