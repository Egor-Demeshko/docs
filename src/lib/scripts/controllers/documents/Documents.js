import sanitizeManyHtml from "$lib/scripts/utils/sanitizeManyHtml";
import generateTextElements from "$lib/scripts/docWriter/generateTextElements";
import { documents } from "$lib/scripts/stores";
import generateUUID from "$lib/scripts/utils/generateUUID.js";
import generateName from "$lib/scripts/utils/documents/generateName";
import { saving } from "$lib/scripts/stores";
import { get } from "svelte/store";

//const changeSavingSing = get( saving );

/*описание полей см. в stores. один из первых сторов, documents */
export default class Documents{
    /**
     * @type {Array}
     * @description массив документов
     * каждый документ представлен обьектом
     * {
     *      active: true || false,
     *      id,
     *      name,
     *      string - это html строка
     *      isUpdated - <boolean> - ставится true при изменении
     *      is_initialized? - <boolean> - используется только в момент, когда уже создана новая вкладка
     *      ориентир для работы модального окна на редакторе
     * }
     */
    #docs = [];
    #saveDeleteService; //дл взаимодействия по html
    #projectId;
    /**для вызова функций заинтересованных подписчиков */
    #callbacks = [];

    constructor(data, graph, saveDeleteService, project_id, docsCallback){
        const clearHtmlArr = this.generateElements(data, graph);
        //console.log("[DOCUMENTS]: ", clearHtmlArr);
        if(clearHtmlArr[0]) clearHtmlArr[0].active = true;
        console.log(clearHtmlArr[0]);
        this.#docs = clearHtmlArr;
        this.#saveDeleteService = saveDeleteService;
        this.#projectId = clearHtmlArr[0]?.project_id || project_id;
        this.#callbacks.push(docsCallback);
    }

    get docs(){
        return this.#docs;
    }

    get projectId(){
        return this.#projectId;
    }


    #callSubscribes(){
        this.#callbacks.forEach( (fn) => fn([...this.#docs]));
    }


      /**запускает некоторые процедуры для создания документа, отправляет запрос в базу, обновляет сторы.
     * вновь создаваемый документ автоматически становится активным. Активным может быть только один документ.
     * также в обьект документ добавляет не обязательно поле not_initialized. документ не инициализирован.
     */
      createNewDocument(){
        //запихать в массив новый объект нужных данных
        //post нового шаблона
        let newId = generateUUID();
        this.setAllInactive();

        let name = generateName(Array.from(this.#docs));
        
        /**поле active для отрисовки. буквально, отображается активный документ */
        let newdocumentObj = {
            active: true, 
            string: "",
            id: newId,
            project_id: this.#projectId,
            name,
            not_initialized: true
        }

        this.#docs.push(newdocumentObj);

        /**несмотря на то */
        this.setActive(newId);

        console.log("[documents]: AFTER create New Document: ", newdocumentObj);
        documents.update( (docs) => docs );
    }


    async delete({documentId}){
        saving.set(true);

        this.#docs = this.#docs.filter( (docObj) => {
            if (docObj["id"] === documentId) return false;
            return true;
        });

        /*первый элемент делаем активным*/
        if(this.#docs.length > 0){
            this.#docs[0].active = true;
        }
            
        
        let status = await this.#saveDeleteService.deleteInstance({
                                                    template_id: documentId, 
                                                    project_id: this.#projectId
                                                });

        console.log("[document]: setting first element active");
        saving.set(false);
        if(status.success && document) {
            this.#callSubscribes();
            
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

        } else {
            document.dispatchEvent(new CustomEvent("error", {
                detail: {
                    err_data: [{
                        message: "Документ не был удален, обновите страницу", 
                        err_id: 200, 
                        err_type: "simple",
                        blockId: 0
                    }]
                }
            }));
        }
    }

    /**
     * Checks if the document is updated.
     * @return {boolean} Returns true if the document is updated, otherwise false.*/
    isDocumentUpdated(){
        let arr = this.#docs;
        for (let i = 0; i < arr.length; i++) {
            const element = arr[i];
            if(element["active"]) return element?.isUpdated || false;
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


    getActiveDocumentName(){
        let arr = this.#docs;

        for (let i = 0; i < arr.length; i++) {
            const element = arr[i];
            if(element["active"]) return element["name"];            
        }
    }

    /**
     * Returns the active document object from the list of documents.
     *
     * @return {Object} The active document object.
     */
    getActiveDocumentObject(){
        const arr = this.#docs;
        for (let i = 0; i < arr.length; i++) {
            const element = arr[i];
            if(element["active"]) return element;
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


    /**эта функция срабатывает в том числе когда мы создаем пустой шаблон, 
     * у нас тогда нет ни имени, ни строки html
     * если нет имени, получаем текущее активное имя (генерируется в момент
     *  создания записи в #docs через метод createNewDocument) или опять пробуем генерировать
     * html пустой параграф. сервер ждет обязательные данные 
     * */
    async handleCreateRequest({name, html}){
        saving.set(true);
        if(!html) html = "<p></p>";

        if(!name) name = this.getActiveDocumentName() || generateName(Array.from(this.#docs));
        let response = await this.#saveDeleteService.createRequestWithToken({project_id: this.#projectId, name, html});
        
        if(response.success){
            /** {data} = response
             * { id, name} = data;
             */
            const {id, name} = response.data;
            this.#docs.push({
                id,
                name,
                string: html,
                active: true
            });

            this.#callSubscribes();
        }
        saving.set(false);
        return response;
    }


    /**при получении данных, в момент загрузки файла, это функция обеспечивает синхронизацию
     * данных с уже созданных временным обьектом нового документа
     * через метод createNewDocument
     */
    normolizeNewDocument(id, name, html){
        this.initDocument();
        const docs = this.#docs;

        for(let i = 0; i < docs.length; i++){
            let obj = docs[i];

            if(obj.active === true){
                obj.name = name;
                obj.id = id;
                obj.string = html;

                break;
            }
        }

        if(docs.length === 0){
            this.#docs.push({
                id,
                name,
                string: html,
                active: true,
                isUpdated: false
            });  
        }
    }

    /**@description сохраняет изменения локально и ставит фланг isUpdated */
    saveHtmlState(){
        console.log("[Documents]: saveHtmlState");
        let arr = this.#docs;
        let html = window.jQuery(document.getElementById("container")).trumbowyg('html');
        //console.log("[Documents]: gained html");
        

        for (let i = 0; i < arr.length; i++) {
            const element = arr[i];
            if(element["active"]) {

                element.string = html;
                break;
            }          
        }

        arr = null;
        html = null;
    }


    async saveHeading(template_id, name){
        saving.set(true);
        let docs = this.#docs;

        for (let i = 0; i < docs.length; i++) {
            const element = docs[i];

            if(template_id === element.id){
                element.name = name;
            }
        }

        let result = await this.#saveDeleteService.changeInstanceWithToken({
                        project_id: this.#projectId,
                        template_id,
                        name
                    });
        console.log('[DOCUMENTS]: result after NAME CHANGE ', result);
        saving.set(false);
        return result;
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


    setDocumentUpdated(){
        const docs = this.#docs;

        for (let i = 0; i < docs.length; i++) {
            const element = docs[i];
            if(!element.active)continue;
            if(!element?.isUpdated) {

                console.log("[Documents]: setDocumentUpdated");
                element.isUpdated = true;
            };
        }
    }
    

    async sendFile(formData){
        saving.set(true);
        formData.append("project_id", this.#projectId);

        let {success, data:{html, id, name}} = await this.#saveDeleteService.sendFile(formData);
        //TODO если ок, то вероятно надо отсюда сохранять html в визуализацию, и отправлять на сервер.
        //вероянто надо прогрнать через стандартную процедуру которую делаем на page. 
        //тоесть создание элементов, зачистка html. посмотрим что в ответе будет
        /**приходят в data: {html, id, name}  */

        if(success){
            this.normolizeNewDocument(id, name, html);
            /**дергаем стор чтобы обновить отображение */
            documents.update( (docs) => docs);
            this.#callSubscribes();
        }
        saving.set(false);
        return success;
    }


    async sendHtmlState(){
        saving.set(true);
        //если флаг true, то отправляем, false возрат пустой
        if(!this.isDocumentUpdated()) {
            saving.set(false);
            return;
        };

        const activeDoc = this.getActiveDocumentObject();
        const {string, id, name} = activeDoc;
        //ставим флаг для документ false, после успешной отправки
        const dataToBeSend = {
            project_id: this.#projectId,
            template_id: id,
            name,
            html: string
        }

        const result = await this.#saveDeleteService.changeInstanceWithToken(dataToBeSend);
        console.log('[DOCUMENTS]: result after STATE CHANGE ', result);
        if(result.success){
            debugger;
            activeDoc.isUpdated = false;  
        }
        saving.set(false);      
    }


    subscribeForDocsArrUpdate(callback){
        if(callback instanceof Function){
            this.#callbacks.push(callback);
        }
    }

}