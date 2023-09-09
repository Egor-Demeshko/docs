import generateTextElements from "$lib/scripts/docWriter/generateSimplifiedTextElements";
import sanitizeManyHtml from "$lib/scripts/utils/sanitizeManyHtml.js";
import Documents from "./Documents";


export default class DocumentsWithSimpleText extends Documents{
    constructor(data, graph, saveDeleteService){
        super(data, graph, saveDeleteService);
    }

    generateElements(data, graph){
        console.log("[DocumentsWithSimpleTexts]: {data,}", data);
        console.log("[DocumentsWithSimpleTexts]: {graph,}", graph);
        return generateTextElements(graph, sanitizeManyHtml(data))
    }
}