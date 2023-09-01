import { blockClickedId, activeBlocks, nodes } from "/src/lib/scripts/stores";
import sanitizeHTML from "$lib/scripts/utils/sanitizeHTML.js";
import { get } from "svelte/store";


export default class visualRedactorEvents{
    #domLinks = [];
    #id;
    #focusUpdateEvent = false;
    #linkedUpdateCallback;
    #getContentCallback;

    createListeners(domLinks, id, updateContent, getContent){
        //создать focus nobubles обрабатывает для визуализации таб в основном
        //blur    blur nobubles  работает для визуализации таб в основном
        //pointerenter    имитация hover. нужно для одновременного подсвечивания всех элементов
        //pointerleave     имитация hover. нужно для одновременного подсвечивания всех элементов
        this.#domLinks = domLinks;
        this.#id = id;
        this.#linkedUpdateCallback = updateContent;
        this.#getContentCallback = getContent;

        this.#domLinks.forEach( (domLink) => {
            domLink.addEventListener("focus", this.#focusHandle.bind(this));
            domLink.addEventListener("blur", this.#blurHandle.bind(this));

            domLink.addEventListener("pointerenter", this.#pointerEnter.bind(this));
            domLink.addEventListener("pointerleave", this.#pointerLeave.bind(this));

            domLink.addEventListener("keyup", this.#keyupHandle.bind(this));
            domLink.addEventListener("keydown", this.#keyDown.bind(this));
            
        });
    }


    setActive(id){
        if(this.#id !== id) return;
        //console.log("[simpleText]: setting active: id=", id);
        this.#domLinks.forEach( (domElem, i) => {
            domElem.classList.add("doc_active");

        });
    }

    setActiveWithScroll(id){
        if(this.#id !== id) return;
        
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


    #focusHandle(e){
        let id = get(blockClickedId);
        if(id === this.#id) return;
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
                if(setOfblocks.has(this.#id)) return setOfblocks;
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

    #keyDown(e){
       const target = e.target;

       if(target.textContent === "_" && /[\w\d_!%&$*()]/.test(e.key)){
            target.textContent = "";
            return;
       }

       if(target.textContent.length === 1 && e.key === 'Backspace' ){
            target.textContent = "_";
       }
    }


    #keyupHandle(e){
        let text = '';
        //console.log('[simpleTexts]: KEYUP');
        
        if(e.target.classList.contains('doc_elements')){
            text = e.target.textContent;
            text = sanitizeHTML(text);
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


        this.#linkedUpdateCallback(text);

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
            this.#domLinks.forEach( (textElem) => textElem.textContent = this.#getContentCallback() );
            this.#focusUpdateEvent = false;
            console.log("_-----[simpletext]: updateTextBlocks------");
        }
    }

}