import generateTextElements from "$lib/scripts/docWriter/generateSimplifiedTextElements";
import sanitizeManyHtmlInAnketa from "$lib/scripts/utils/sanitizeManyHtmlInAnketa.js";
import Documents from "./Documents";
import SimpleTextForAnketa from "$lib/scripts/anketa/SimpleTextForAnketa.js";
import { storeForSimpleTexts, nodes } from "$lib/scripts/stores";
import { get } from "svelte/store";
import {Projects} from "$lib/scripts/controllers/instances/Projects.js";


export default class DocumentsWithSimpleText extends Documents{
    #unsubscribe;
    #project_id;
    constructor(data, graph, saveDeleteService, project_id){
        super(data, graph, saveDeleteService);
        this.#project_id = project_id;
    }

    /**сейчас только чистим html */
    generateElements(data, graph){
        return generateTextElements(graph, sanitizeManyHtmlInAnketa(data));
    }


    async populateSimpleTexts(){
        //пробный запрос дом элемента
        //если енет не выаполнять
        const container = document.getElementById("container");
       
        let projects = new Projects();
        const nodesList = await projects.getFullData(this.#project_id).
                            then( (result) => {
                                if(result) return  result.nodes;
                                throw new Error("Не удалось получить данные проекта");
                            });
        
        const arrayToStore = [];
        if(!container) return;
        if(!container.querySelector(`.doc_elements[data-element]`)){
            return;
        }

        const nodesCollection = container.querySelectorAll(`.doc_elements[data-element]`);

        /**@description {id: htmlDomElements} */
        const seenIds = {};
        nodesCollection.forEach( (domLink) => {
            const id = domLink.dataset.element;

            if(id){
                if(seenIds[id] instanceof Array){
                    seenIds[id] = seenIds[id].push(domLink);
                } else {
                    seenIds[id] = [domLink];
                }
            }
        });

        for(let [id, nodeObj] of Object.entries(nodesList)){
            const {name, content} = nodeObj;
            
            const domLinks = seenIds[id];

            if(!domLinks)continue;

            let simpleText = new SimpleTextForAnketa({id, name, content});
            simpleText.addLinks(domLinks);
            arrayToStore.push(simpleText);
        }
        storeForSimpleTexts.set(arrayToStore);

    }

    async populateSimpleTextsOnTabChange(){
        /**включается загулшка на редакторе, спиннер */
        document.dispatchEvent( new CustomEvent("spinner", {detail: "redactor"}));
        await this.populateSimpleTexts();
        /**отлюкчается заглушка на редакторе */
        document.dispatchEvent( new CustomEvent("spinner", {detail: "redactor"}));
    }


    updateDocElementsVisibility(newGraph){
        const simplTexts = get(storeForSimpleTexts);

        if(simplTexts === null || simplTexts === undefined) return;

        simplTexts.forEach( (docElement) => {
            docElement.setNoDisplay(docElement.id);
        })

        for(let i = 0; i < simplTexts.length; i++){
            const docElement = simplTexts[i];
            const elementId = docElement.id;

            for(let j = 0; j < newGraph.length; j++){
                const node = newGraph[j];
                if(node.id !== elementId) continue;

                docElement.setDisplay(node.id);

                docElement.setTextData({content: node.content});
            }
        }
    }


    subscribeForNodesUpated(){
        this.#unsubscribe = nodes.subscribe( (newGraph) => {
            /**почему-то получили новый граф, применяем обновления видимости*/
            if(window.location.pathname === "/anketa"){
                this.updateDocElementsVisibility( newGraph );
            }
        });
    }

    unsubscribe(){
        this.#unsubscribe();
    }
}