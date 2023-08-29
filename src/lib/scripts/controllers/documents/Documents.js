import sanitizeManyHtml from "$lib/scripts/utils/sanitizeManyHtml";
import generateTextElements from "$lib/scripts/docWriter/generateTextElements";
import { documents } from "$lib/scripts/stores";
import generateUUID from "$lib/scripts/utils/generateUUID.js";


/*описание полей см. в stores. один из первых сторов, documents */
export default class Documents{
    #docs = [];
    #saveDeleteService;
    #projectId;

    constructor(data, graph, saveDeleteService){
        const clearHtmlArr = this.generateElements(data, graph);
        //console.log("[DOCUMENTS]: ", clearHtmlArr);
        clearHtmlArr[0].active = true;
        console.log(clearHtmlArr[0]);
        this.#docs = clearHtmlArr;
        this.#saveDeleteService = saveDeleteService;
        this.#projectId = clearHtmlArr[0].project_id;
    }

    get docs(){
        return this.#docs;
    }


      /**запускает некоторые процедуры для создания документа, отправляет запрос в базу, обновляет сторы.
     * вновь создаваемый документ автоматически становится активным. Активным может быть только один документ.
     * также в обьект документ добавляет не обязательно поле not_initialized. документ не инициализирован.
     */
      async createNewDocument(){
        //запихать в массив новый объект нужных данных
        //post нового шаблона
        let newId = generateUUID();
        this.setAllInactive();
        
        
        let newdocumentObj = {
            active: true, 
            string: "",
            id: newId,
            project_id: this.#projectId,
            name: "Новый документ",
            not_initialized: true
        }

        this.#docs.push(newdocumentObj);

        /**несмотря на то */
        this.setActive(newId);

        let status = await this.#saveDeleteService.createInstance(newdocumentObj);
        console.log("[dpcuments]: AFTER create New Document: ", newdocumentObj);
        documents.update( (docs) => docs);

        return status;
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


    isActiveInitialized(){
        let arr = this.#docs;

        for (let i = 0; i < arr.length; i++) {
            const element = arr[i];
            if(element["active"] && !element?.not_initialized) return true;   
            if(element["active"] && element?.not_initialized) return false;        
        }
    }


    initDocument(){
        let arr = this.#docs;
        
        for (let i = 0; i < arr.length; i++) {
            const element = arr[i];
            if(element["active"] && element.not_initialized) {
                delete element.not_initialized;
                break;
            }           
        }
    }


    gainActiveHtml(){
        const arr = this.#docs;
        for (let i = 0; i < arr.length; i++) {
            const element = arr[i];
            if(element["active"]) return element["string"];            
        }
    }

    getActiveDocumentId(){
        let arr = this.#docs;

        for (let i = 0; i < arr.length; i++) {
            const element = arr[i];
            if(element["active"]) return element["id"];            
        }
    }


    generateElements(data, graph){
        return generateTextElements(graph, sanitizeManyHtml(data))
    }


    /**помечает все документы как неактивные */
    setAllInactive(){
        let docs = this.#docs;

        for (let i = 0; i < docs.length; i++) {
            const element = docs[i];

            element.active = false; 
        }

        docs = null;
    }


    /**делает один документ по айди активным*/
    setActive(id){
        let docs = this.#docs;
        this.setAllInactive();

        for (let i = 0; i < docs.length; i++) {
            const element = docs[i];
            if(element["id"] === id) {
                element.active = true;
                break;
            };
        }

        docs = null;
    }



}