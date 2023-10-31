<script>
    import DocumentsWithSimpleText from "$lib/scripts/controllers/documents/DocumentsWithSimpleTexts";
	import saveDeleteService from "$lib/scripts/utils/saveDelete/document/saveDeleteService";
    import DocWriter  from "$lib/components/DocWriter.svelte";
    import { nodes, documents, anketaGraphController, docxController, projectName } from "$lib/scripts/stores";
    import createMassive from "$lib/scripts/createMassive";
	import TopControllBar from "$lib/components/TopControllBar.svelte";
	import TabsWithoutEvents from "$lib/components/Tabs/TabsWithoutEvents.svelte";
    import Tooltip from "$lib/components/CntrElem/Tooltip.svelte";
    import Modal from "$lib/components/Modal.svelte";
	import InputElements from "$lib/components/anketa/InputElements.svelte";
    import optimizeDATA from "$lib/scripts/utils/optimizeDATA.js";
	import { setContext, onDestroy } from "svelte";
    import DynamicGraphController from "$lib/scripts/controllers/nodes/anketa/controller/DynamicGraphController.js";
    import PrintModule from "$lib/components/PrintModule.svelte";
	import MessagesContainer from "$lib/components/MessagesContainer.svelte";
    import EmptyRedactor from "$lib/components/EmptyRedactor.svelte";

    //receiving data from load function
    export let data;
    let graph;
    let load = true;
    
    let {templates, project_id, project_name, active_nodes} = data;
    graph = active_nodes;
    graph = createMassive(graph);

    /**если tempaltes нет(т.е. нет документов, грузим на редакторе кода заглушку)*/
    if(!templates || templates?.length === 0){
        load = false;
    } else {
        let html = optimizeDATA(templates, project_id);
        const docs = new DocumentsWithSimpleText(html, graph, saveDeleteService("anketa"), project_id);
        //console.log("[PAGE]: docs CLASS", docs);
        /**заполняем стор документов*/
        documents.set(docs);
    }

    projectName.set({id: project_id, name: project_name});
    /**динамик граф контроллер отвечает за подготовку данных и их отправку через http так и получение
     * некотоырх данных из локального хранилища. 
    */
    anketaGraphController.set( new DynamicGraphController({project_id, saveClient: "local"}));
    $anketaGraphController.subscribe(updateGraph);
    $docxController.setProjectId(project_id);
    setContext("templateController", $docxController);

    /* сохраняем граф в стор*/
    /** node_type = "text" не отображаются в анкете */
    $: nodes.set(graph);
    

    onDestroy( () => {
        /**очищаем данные контроллера, и зануляем стор контроллера*/
        $anketaGraphController.clearAll();
        anketaGraphController.set(null);
        documents.set(null);
        projectName.set(null);
    })


    function updateGraph(data){
        if(data.active_nodes){
            console.log('[page]: {updateGraph}: in if active nodes: ', data.active_nodes);
            graph = createMassive(data.active_nodes);
        }
    }

</script>



<div class="redactors">

        <div class="element element__left">
            <TopControllBar />

            <InputElements />
        </div>

        <!--<div class="devider"></div>-->

        <div class="element">
            {#if load}
            <TabsWithoutEvents tabsPosition={"document"} documents={$documents.docs}/>
            <DocWriter />
            {:else}
            <EmptyRedactor />
            {/if}
        </div>
</div>  


<Tooltip --bg="var(--white)"
--color="var(--faded-gray-blue)"/>
<Modal />
<PrintModule />
<div id="messages_anchor">
    <MessagesContainer />
</div>



<style>

    .element{
        flex: 3;
        width: 100%;
        position: relative;
    }

    .element__left{
        flex: 1.5;
        height: 100%;
        display: flex;
        flex-direction: column;
        display: relative;

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


    #messages_anchor{
        position: fixed;
        bottom: 1rem;
        right: 0;
        transform: translateX(-200%);
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
            padding: 0;
            margin: 0;
            position: absolute;
            top: 0;
            left: 0;
        }
    }
</style>