import { blockClickedId, activeBlocks, nodes, storeForSimpleTexts } from "/src/lib/scripts/stores";
import EditRedactorEvents from "./EditRedactorEvents";
import VisualRedactorEvents from "./VisualRedactorEvents";

export default class SimpleText{
    #domLinks = [];
    #id = "";
    #content = "";
    #name = "";
    #visualRedactorEvents;
    #editRedactorEvents;

    chainedElement
    constructor({id, name, content}){
        this.#id = id;
        this.#name = name;
        this.#content = content;
        this.#visualRedactorEvents = new VisualRedactorEvents(id);
        this.#editRedactorEvents = new EditRedactorEvents();
    }

    /**
     * @description функция призвана изменить значение классов на dom элементах
     * в зависимости от состояния поля active
     * @param {boolean} activeState - состояние поля active из графа nodes[i-ое]; 
     */
    changeVisibility(activeState){
        this.#domLinks.forEach( (element) => {
            if(activeState){
                element.classList.remove("doc_no_active");
            } else {
                element.classList.add("doc_no_active");
            }
        });
    }

    connect(root){
        /**every element receive link to it's holding element */
        if(root){
            this.root = root;
        }

        if(!this.root){
            throw new Error("No element to connect");
        }
        // ;
        /*console.log("SIMPLE TEXT", {id: this.id, name: this.name, content: this.content, root: this.root});*/
        let links = this.root.querySelectorAll(`span[data-element="${this.#id}"]`);
        //console.log("[simpleText]: root: ", links);
        

        if(links instanceof NodeList){
            this.#domLinks = Array.from(links);
            this.#populateFields();            
        } else {
            throw new Error("text elements: couldn't connect elements with document");
        }

        nodes.subscribe( this.validityStatusChanger.bind(this) );
    }


    createListeners(){
        
        this.#visualRedactorEvents.createListeners(this.#domLinks, this.#id);
        this.#editRedactorEvents.createListeners(this.#domLinks, this.#id, this);
    }


    get id(){
        return this.#id;
    }

    setActive(id){
        this.#visualRedactorEvents.setActive(id);
    }

    setActiveWithScroll(id){
        this.#visualRedactorEvents.setActiveWithScroll(id);
    }


    setInactive(id){
        this.#visualRedactorEvents.setInactive(id);
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
                element.textContent = this.#name ?? '';
            });
        }

        links = null;
    }


    /**функция запускается после валидации данных */
    #update(name, content){
        if(name && this.#name !== name) this.setNameOnly(name);
        /*
        if(name?.length === 0) name = "___";
        this.#domLinks.forEach( (domElement) => {
            
            domElement.textContent = name;
        });*/
        if(content && typeof content === 'string' && this.#content !== content){
            this.#content = content;
        }
    }


    setTextData({name, content}){
        if(this.#content === content && this.#name === name) return;
        this.#update(name, content);
    }

    setNameOnly(name){
        if(name !== undefined && name !== null && typeof name === "string"){
            this.#name = name;

            /** устанавливаем в документе именно название блока. не контетент */
            this.#domLinks.forEach( (domElement) => {
                domElement.textContent = name;
            });
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
                        this.#domLinks.forEach( (domElem) => domElem.classList.remove("doc_no_active"));
                    } else {
                        this.#domLinks.forEach( (domElem) => domElem.classList.add("doc_no_active"));
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