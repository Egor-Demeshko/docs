<script>
    import DocWriter  from "$lib/components/DocWriter.svelte";
    import { nodes, documents, nodeController, projectsStore, storeForSimpleTexts } from "$lib/scripts/stores";
    import SVGMain from "$lib/components/draws/SVGMain.svelte";
    import createMassive from "$lib/scripts/createMassive";
	import NodeRedactor from "$lib/components/nodeRedactor/NodeRedactor.svelte";
	import TopControllBar from "$lib/components/TopControllBar.svelte";
	import Tabs from "$lib/components/Tabs/Tabs.svelte";
	import AddButton from "$lib/components/CntrElem/AddButton.svelte";
    import MessagesContainer from "$lib/components/MessagesContainer.svelte";
    import Tooltip from "$lib/components/CntrElem/Tooltip.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import Documents from "$lib/scripts/controllers/documents/Documents.js";
    import saveDeleteService from "$lib/scripts/utils/saveDelete/document/saveDeleteService";
    import optimizeDATA from "$lib/scripts/utils/optimizeDATA.js";
    import Node from "$lib/scripts/controllers/instances/Node.js";
	import PrintModule from "$lib/components/PrintModule.svelte";
    import generateTextElements from "$lib/scripts/docWriter/generateTextElements.js";
	import { onDestroy, setContext } from "svelte";
    import { beforeNavigate } from "$app/navigation";
    import { projectName } from "$lib/scripts/stores";
    import { docxController } from "$lib/scripts/stores"; 
    import { populateLinesStore } from "$lib/components/draws/Line.svelte";

    //receiving data from load function
    export let data;

    //console.log('[page]: data: ', data);
    let {templates, id: project_id, name, nodes: serverNode} = data;

    let graph = serverNode;
    let length = 0;
    /**добавляем в обьект данных project_Id*/
    let html = optimizeDATA(templates, project_id);
    nodeController.set(new Node(project_id, graphUpdate));
    /**контроллер работы в целом с проектом*/

    setContext("controller", $nodeController);
    setContext("templateController", $docxController);
    projectName.set({id: project_id, name});

    //console.log("HTML: ", html);
    //console.log("GRAPH: ", JSON.stringify(graph));
    
    setupData();
;
    function setupData(){
        /**делаем из графа массив*/
        /* также задаем значения по умолчанию, если их нет*/
        graph = createMassive(graph);
        /* сохраняем граф в стор*/
        nodes.set(graph);
        const docs = new Documents(html, graph, saveDeleteService("template"), project_id, 
            arrUpdatedCallback);
        /**заполняем стор документов*/
        documents.set(docs);
        length = docs.docs.length;
        populateLinesStore(graph);
    }


    async function graphUpdate(){
        let {nodes: nodesFromServer} = await $projectsStore.getFullData(project_id);
        if(!nodesFromServer) return;
        graph = nodesFromServer;
        graph = createMassive(graph);
        nodes.set(graph);
        generateTextElements(graph);
        populateLinesStore(graph);
    }


    /**функция коллбэк для получения обновления массива документов*/
    function arrUpdatedCallback(arr){
        if(arr instanceof Array){
            length = arr.length;
        }
    }
    

    onDestroy( () => {
        documents.set(null);
        storeForSimpleTexts.set(null);
    });


    beforeNavigate( async (navigation) => {

    });
    
</script>


<div class="redactors">

        <div class="element element__left">
            <MessagesContainer />
            <!--<Tabs tabsPosition={"left"} tabNames={["Схема 1"]}/>-->
            <TopControllBar />
            <AddButton --width="3.4rem" --height="3.4rem"/>
            <SVGMain />
            <NodeRedactor />
        </div>

        <!--<div class="devider"></div>-->

        <div class="element">
            {#if length > 0}
                <Tabs tabsPosition={"document"} docsArr={$documents.docs}/>
            {/if}
            <DocWriter />
        </div>
</div>  


<Tooltip --bg="var(--white)"
--color="var(--faded-gray-blue)"/>
<Modal />
<PrintModule />




<style>

    .element{
        flex: 1;
        width: 50%;
        position: relative;
    }

    .element__left{
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
        position: relative;

    }


    .redactors{
        display: flex;
        position: absolute;
        top: 5.5rem;
        left: 0;
        gap: 1.5rem;
        height: calc(100% - 5.5rem);
        width: 100%;
    }




   /* .devider{
        width: 4px;
        height: 100%;
        background-color: black;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }*/

    @media print{
        .redactors{
            display: none;
        }

        .element__left{
            display: none;
        }

        .element{
            display: none;
        }
    }
</style>