export default class SimpleText{
    #domLinks = [];

    constructor(id, name, content){
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

        this.#domLinks.forEach( (domElem, i) => {
            domElem.classList.add("doc_active");
            if(i === 0) domElem.focus();
        });
    }

    setInactive(id){
        if(this.id !== id) return;

        this.#domLinks.forEach( (domElem) => {
            domElem.classList.remove("doc_active");
        });
    }
}    