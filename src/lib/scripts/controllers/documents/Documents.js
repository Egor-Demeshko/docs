import sanitizeManyHtml from "$lib/scripts/utils/sanitizeManyHtml";
import generateTextElements from "$lib/scripts/docWriter/generateTextElements";

export default class Documents{
    #docs = [];

    constructor(data, graph){
        const clearHtmlArr = generateTextElements(graph, sanitizeManyHtml(data));
        console.log("[DOCUMENTS]: ", clearHtmlArr);

        this.#docs = clearHtmlArr;
    }

    get docs(){
        return this.#docs;
    }


    setActive(id){
        let docs = this.#docs;

        for (let i = 0; i < docs.length; i++) {
            const element = docs[i];
            if(element["id"] !== id) {
                element.active = false;
                continue;
            };

            element.active = true;
        }

        docs = null;
    }

    gainActiveHtml(){
        const arr = this.#docs;
        for (let i = 0; i < arr.length; i++) {
            const element = arr[i];
            if(element["active"]) return element["string"];            
        }
    }
}