import { blockClickedId } from "/src/lib/scripts/stores";

export default class SimpleText{
    #domLinks = [];

    constructor({id, name, content}){
        this.id = id;
        this.name = name;
        this.content = content;
    }

    connect(root){
        /**every element receive link to it's holding element */
        this.root = root;
        // debugger;
        /*console.log("SIMPLE TEXT", {id: this.id, name: this.name, content: this.content, root: this.root});*/
        let links = root.querySelectorAll(`span[data-simpleText="${this.id}"]`);

        if(links instanceof NodeList){
            this.#domLinks = Array.from(links);
            this.#populateFields();
            
        } else {
            throw new Error("text elements: couldn't connect elements with document");
        }


        this.#createListeners();
        
        /*this.#domLinks.forEach( (el) => {
            el.addEventListener("pointerenter", (event) => {
                console.log("[DocWriter]: focus event");
            });
        });*/
    }


    /**On mount we populate fields with data */
    #populateFields(){
        let links = this.#domLinks;

        if(links.length > 0){
            links.forEach( (element) => {
                element.textContent = this.content ?? '';
            });
        }

        links = null;
    }

    /**функция запускается после валидации данных */
    #update(name, content){
        this.name = name;
        this.content = content;

        this.#domLinks.forEach( (domElement) => {
            domElement.textContent = content;
        });
    }

/*
    get id(){
        return this.id;
    }

    set id(id){

        /**проводить валидацию *//*
        if(typeof id === "number"){   
            console.log("simple Text setter: ", this.id);        
            this.id = id;

        }
    }*/


    setTextData({name, content}){
        if(typeof name === "string" && typeof content === "string"){
            this.#update(name, content);
        }
    }

    updateDomLink(elem){
        this.#domLinks.push(elem);
    }

    setActive(id){
        if(this.id !== id) return;
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
        if(this.id !== id) return;

        this.#domLinks.forEach( (domElem) => {
            domElem.classList.remove("doc_active");
        });
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

            /**mouse enter будем обрабатывать на root */
        });


    }


    #focusHandle(){

        blockClickedId.set(this.id);
        this.setActive(this.id);
    }


    #blurHandle(){
        this.setInactive(this.id);
    }
}    