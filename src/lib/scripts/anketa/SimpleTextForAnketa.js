import { blockClickedId, activeBlocks, nodes, storeForSimpleTexts } from "/src/lib/scripts/stores";
/*import EditRedactorEvents from "./EditRedactorEvents";*/
import SimpleVisualRedactorEvents from "$lib/scripts/docElements/SimpleVisualRedactorEvents.js";

export default class SimpleTextForAnketa {
    #domLinks = [];
    #id = "";
    #content = "";
    #name = "";
    #visualRedactorEvents;
    #nodeUnsubscribe;
    /*#editRedactorEvents;*/

    chainedElement
    constructor({id, name, content}){
        this.#id = id;
        this.#name = name;
        this.#content = content;
        this.#visualRedactorEvents = new SimpleVisualRedactorEvents();
        /*this.#editRedactorEvents = new EditRedactorEvents();*/
    }

    addLinks(arr){
        if(!(arr instanceof Array)) return;
        arr = [...arr];
        this.#domLinks = arr;
    }

    connect(root){
        /**every element receive link to it's holding element */
        if(root){
            this.root = root;
        }

        if(!this.root){
            throw new CustomError("No element to connect");
        }

        if(this.#nodeUnsubscribe) this.#nodeUnsubscribe();
        /*console.log("SIMPLE TEXT", {id: this.id, name: this.name, content: this.content, root: this.root});*/
        let links = this.root.querySelectorAll(`span[data-element="${this.#id}"]`);
        //console.log("[simpleText]: root: ", links);
        

        if(links instanceof NodeList){
            this.#domLinks = Array.from(links);
            this.#populateFields();            
        } else {
            throw new Error("text elements: couldn't connect elements with document");
        }

        this.#nodeUnsubscribe = nodes.subscribe( this.validityStatusChanger.bind(this) );
    }


    createListeners(){
        this.#visualRedactorEvents.createListeners(this.#domLinks, this.#id, function setContent (text){
            this.#content = text;
        }.bind(this),
        function getContent(){
            return this.#content;
        }.bind(this)
        );


        /*this.#editRedactorEvents.createListeners(this.#domLinks, this.#id, this);*/
    }


    get id(){
        return this.#id;
    }

    setActive(id){
        this.#visualRedactorEvents.setActive(id);
    }


    setInactive(id){
        this.#visualRedactorEvents.setInactive(id);
    }

    setNoDisplay(){
        this.#visualRedactorEvents.setNoDisplay();
    }

    setDisplay(){
        this.#visualRedactorEvents.setDisplay();
    }

    setHoverLike(){
        this.#domLinks.forEach( (elem) => elem.classList.add("documents_hoverlike"));
    }


    removeHoverLike(){
        this.#domLinks.forEach( (elem) => elem.classList.remove("documents_hoverlike"));
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
/**TODO можно переделать, через subscribe */
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


    /**считывает статус validity, меняет свой стиль */
    validityStatusChanger(nodes){
        for(let i = 0; i < nodes.length; i++){
            let node = nodes[i];
            if(node["id"] !== this.#id) continue;


            try{
                if(node?.validity.status === "valid") this.setValidState();
                if(node?.validity.status === "invalid") {
                    //console.log("[simpletexts]: validityStatusChanger");
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


    deleteElement(){
        
        this.#domLinks.forEach( function deleteElement(element){
            element.remove();
        } );
        
        this.#domLinks = null;
    }

    /**добавляет новое место переменной в редакторе, используется у уже созданных узлов. НЕ ДЛЯ НОВЫХ полность новых узлов */
    addOnMoreNodeInText(event){
        console.log("[simpleText]: addOnMoreNodeInText");
    }
}    