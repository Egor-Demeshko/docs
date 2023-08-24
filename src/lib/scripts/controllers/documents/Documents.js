import sanitizeManyHtml from "$lib/scripts/utils/sanitizeManyHtml";
import generateTextElements from "$lib/scripts/docWriter/generateTextElements";
import { documents } from "$lib/scripts/stores";

export default class Documents{
    #docs = [];
    #saveDeleteService;
    #projectId;

    constructor(data, graph, saveDeleteService){
        const clearHtmlArr = generateTextElements(graph, sanitizeManyHtml(data));
        //console.log("[DOCUMENTS]: ", clearHtmlArr);

        this.#docs = clearHtmlArr;
        this.#saveDeleteService = saveDeleteService;
        this.#projectId = clearHtmlArr[0].project_id;
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


    async delete({documentId}){
        this.#docs = this.#docs.filter( (docObj) => {
            if (docObj["id"] === documentId) return false;
            return true;
        });

        /*первый элемент делаем активным*/
        if(this.#docs.length > 0){
            console.log("[document]: setting first element active");
            this.#docs[0].active = true;
        }
            
        //TODO в конце ok true это для девелопмента.
        let status = await this.#saveDeleteService.deleteInstance({
                                                    templateId: documentId, 
                                                    projectId: this.#projectId
                                                }) || {ok: true};

        if(status.ok && document) {
            
            /**отправляем событие error, это событие улавливает блок MessagesContainer, который выводит уведомление */
            document.dispatchEvent(new CustomEvent("error", {
                detail: {
                    err_data: [{
                        message: "Документ удален!", 
                        err_id: 200, 
                        err_type: "simple",
                        blockId: 0
                    }]
                }
            }));

            /**для перерисовки документов вызваем стор, можно было реализовать через события, но почему бы и не так */
            documents.update( (docs) => docs);
        }
    }
}