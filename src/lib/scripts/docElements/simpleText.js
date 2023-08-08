import { blockClickedId, activeBlocks, nodes } from "/src/lib/scripts/stores";

export default class SimpleText{
    #domLinks = [];
    #id = "";
    #content = "";
    #name = "";
    #focusUpdateEvent = false;


    constructor({id, name, content}){
        this.#id = id;
        this.#name = name;
        this.#content = content;


    }

    connect(root){
        /**every element receive link to it's holding element */
        this.root = root;
        // debugger;
        /*console.log("SIMPLE TEXT", {id: this.id, name: this.name, content: this.content, root: this.root});*/
        let links = root.querySelectorAll(`span[data-element="${this.#id}"]`);

        if(links instanceof NodeList){
            this.#domLinks = Array.from(links);
            this.#populateFields();            
        } else {
            throw new Error("text elements: couldn't connect elements with document");
        }


        this.#createListeners();
        nodes.subscribe( this.validityStatusChanger.bind(this) );
    }


    isThisBlock(){

    }


    get id(){
        return this.#id;
    }


    /**On mount we populate fields with data */
    #populateFields(){
        let links = this.#domLinks;

        if(links.length > 0){
            links.forEach( (element) => {
                element.textContent = this.#content ?? '';
            });
        }

        links = null;
    }


    /**функция запускается после валидации данных */
    #update(name, content){
        if(name && this.#name !== name) this.#name = name;
        if(content && this.#content !== content) {
            this.#content = content;
            this.#domLinks.forEach( (domElement) => {
                domElement.textContent = content;
            });
        }
    }


    setTextData({name, content}){
        if(this.#content === content && this.#name === name) return;
        if((typeof name === "string" || !name)  && typeof content === "string"){
            //console.log("[simpleText Obj]: setTextData method before this.#update ", {name, content});
            this.#update(name, content);
        }
    }

    updateDomLink(elem){
        this.#domLinks.push(elem);
    }

/**функция для обновления всех полей класса */
    updateFromGraph(){
        //бежим по графу. если данные отлчичаютя меняем
        //если актив false ставим класс, no visible
        //если актив visible то убираем этот класс.
        nodes.update( (graph) => {
            graph.forEach( ({id, name, content, active}) => {
                if(id === this.#id){
                    if(name && this.#name !== name) this.#name = name;
                    if(content && this.#content !== content) this.#content = content;
                    
                    if(active){
                        this.#domLinks.forEach( (domElem) => domElem.classList.remove("no_display"));
                    } else {
                        this.#domLinks.forEach( (domElem) => domElem.classList.add("no_display"));
                    }
                }
            });

            return graph;
        });
    }


    setActive(id){
        if(this.#id !== id) return;
        //console.log("[simpleText]: setting active: id=", id);
        this.#domLinks.forEach( (domElem, i) => {
            domElem.classList.add("doc_active");
            if(i === 0) domElem.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        });
    }

    setInactive(id){
        if(this.#id !== id) return;

        this.#domLinks.forEach( (domElem) => {
            domElem.classList.remove("doc_active");
        });
    }


    setHoverLike(){
        this.#domLinks.forEach( (elem) => elem.classList.add("documents_hoverlike"));
    }


    removeHoverLike(){
        this.#domLinks.forEach( (elem) => elem.classList.remove("documents_hoverlike"));
    }


    /**считывает статус validity, меняет свой стиль */
    validityStatusChanger(nodes){
        for(let i = 0; i < nodes.length; i++){
            let node = nodes[i];
            if(node["id"] !== this.#id) continue;


            try{
                if(node?.validity.status === "valid") this.setValidState();
                if(node?.validity.status === "invalid") {
                    console.log("[simpletexts]: validityStatusChanger");
                    this.setInvalidState();
                }    
            } catch {

                break;
            }

        }        
    }


    setInvalidState(){
        this.#domLinks.forEach( (elem) => elem.classList.add("not_valid"));
    }


    setValidState(){
        this.#domLinks.forEach( (elem) => elem.classList.remove("not_valid"));
    }



/**добавляем слушатели событий */
    #createListeners(){
        //создать focus nobubles обрабатывает для визуализации таб в основном
        //blur    blur nobubles  работает для визуализации таб в основном
        //pointerenter    имитация hover. нужно для одновременного подсвечивания всех элементов
        //pointerleave     имитация hover. нужно для одновременного подсвечивания всех элементов
        this.#domLinks.forEach( (domLink) => {
            domLink.addEventListener("focus", this.#focusHandle.bind(this));
            domLink.addEventListener("blur", this.#blurHandle.bind(this));

            domLink.addEventListener("pointerenter", this.#pointerEnter.bind(this));
            domLink.addEventListener("pointerleave", this.#pointerLeave.bind(this));

            domLink.addEventListener("keyup", this.#keyupHandle.bind(this));
        });
    }


    #focusHandle(){

        blockClickedId.set(this.#id);
        this.setActive(this.#id);
    }


    #blurHandle(){
        this.setInactive(this.#id);
    }


    #pointerEnter(e){
        let target = e.target;

       if(target.classList.contains("doc_elements") && target.dataset.element == this.#id){
            activeBlocks.update( (setOfblocks) => {
                if(setOfblocks.has(this.#id)) return blocks;
                setOfblocks.add(this.#id);

                return setOfblocks;
            });
        }
    }


    #pointerLeave(e){
        let target = e.target;

       if(target.classList.contains("doc_elements") && target.dataset.element == this.#id){
            activeBlocks.update( (setOfblocks) => {
                if(setOfblocks.has(this.#id)) {
                    setOfblocks.delete(this.#id);
                };

                return setOfblocks;
            });
        }
    }


    #keyupHandle(e){
        let text = '';
        //console.log('[simpleTexts]: KEYUP');
        
        if(e.target.classList.contains('doc_elements')){
            text = e.target.textContent;
            text = text.trim()
                        .replace(/<script .*>.*<\/script>/, "");
        } else {
            return;
        }
        
        /**мы не можем сразу обновлять текстовое содержимое в domLink, т.е. в таких
         * же элементах на редакторе текста. если сделать через textContent, тогда 
         * пересбрасывается фокус. для обхода, создаем слушатель, на потерю фокуса, он обновит 
         * остальные текстовые элементы только после потери фокуса. вызывается один раз.
         * флаг focusUpdateEvent используется для предотвращения создания нескольких 
         * слушателей
         */
        if(!this.#focusUpdateEvent){
            this.#domLinks.forEach( (domLink) => {
                domLink.addEventListener("blur", updateTextBlocks.bind(this), {"once": true});
                this.#focusUpdateEvent = true;
            });
        }


        this.#content = text;

        /**обновляем хранилище nodes */
        nodes.update( (arrNodes) => {
            for(let i = 0; i < arrNodes.length; i++){
                if(arrNodes[i]["id"] !== this.#id) continue;
                    if(arrNodes[i]["content"] !== text){
                        arrNodes[i]["content"] = text;
                        //console.log("[simpleText]: CONTENT updated");
                        if(arrNodes[i]["options"] && arrNodes[i]["options"].length > 0){
                            arrNodes[i]["options"][0] = text;
                            //console.log("[simpleText]: arrNodes[i][options][0] updated");
                        }

                    }

                             
                break;
            }

            return arrNodes;
        });


        function updateTextBlocks(){
            this.#domLinks.forEach( (textElem) => textElem.textContent = this.#content );
            this.#focusUpdateEvent = false;
            console.log("_-----[simpletext]: updateTextBlocks------");
        }
    }
}    