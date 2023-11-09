<script>
    //import jQuery from "jquery";
    import { onMount } from 'svelte';
    import {storeForSimpleTexts, docRoot, documents, showModalDocumentCreator} from '$lib/scripts/stores';
    import { addExcitingNodeToRedator } from "$lib/scripts/controllers/nodes/processStores/addNodesStore.js";
    import { processSelection } from "$lib/scripts/utils/nodes/addNodeToText.js";
    import ModalDocumentCreator from "$lib/components/CntrElem/ModalDocumentCreator.svelte";
    import Spinner from "$lib/components/Spinner.svelte";
    import RedactorContainer from '$lib/components/RedactorContainer.svelte';
    import initRedactor from "$lib/scripts/utils/redactor/initRedactor.js";
    import { get } from "svelte/store";
    import { updateLineBreaks } from "$lib/scripts/utils/redactor/LineBreakers/lineBreakesOperations.js";




    let html = '';
    let editor;
    /**айди текущего активного документа, в осном нужно для проверки необходимости перерисовки редактора*/
    let activeDocumentId;
    /**ссылка на dom элемент, где и будет редактор*/
    let container;
    let root;
    /*записываем обычный id блока. в данном случае айди блока которые вызвал поток добавление переменной в текст*/
    let callerId;
    let urlPath = '';
    /**флаг для того чтобы реактивность документа не срабатывала до того как будет инициализирован редактор*/
    let redactorInitialized = false;
    let no_elements = false;
    /*управляет спиннером*/
    let spinner = false;
    let tryAgain = false;

    /** меняет цвет заднего фона при старте процесс добавление переменной*/
    $: active_bg = ($addExcitingNodeToRedator.status === "start") ? true : false;
    $: if($addExcitingNodeToRedator.status === "start"){
        callerId = $addExcitingNodeToRedator.id;
        createListenersForNodeAddition();
    } else {
        /**есть в box обработчик на клик, который ставит addExcitingNodeToRedator в null
         * если мы кликнули мимо редактора текста
        */
        if(root){
            const container = root.querySelector("#container");
            container.removeEventListener("pointerdown", createNodePointerDown, {once: true});
        }
    }

    $documents.subscribeForDocsArrUpdate(docsArrayUpdated);


    /** эта подписка используется для перерисовки редактора, в случае если был выбран другой документ
    */
    documents.subscribe( (docs) => {
        if(!docs) return;
        
        let freshId = docs.getActiveDocumentId();
        
        //TODO undefined === undefined когда нет документа и первая загрузка
        if(freshId !== undefined && activeDocumentId !== undefined && freshId === activeDocumentId) return;
        
        html = docs.gainActiveHtml() || '';
        let isDocumentInialized = docs.isActiveInitialized();

        if(isDocumentInialized) {
            
            showModalDocumentCreator.set(false);
        } else {
            showModalDocumentCreator.set(true);
        }


        if(redactorInitialized){
            renderEditor();
            connect();
        }

        no_elements = (isDocumentInialized) ? false : true;
        activeDocumentId = freshId;
    });


  /*  $: if(html && redactorInitialized) {
        renderEditor()
    };*/


    /**ФУНКЦИИ В АЛФАВИТНОМ ПОРЯДКЕ*/

    function createListenersForNodeAddition(){
        if(!root) return;

        container.addEventListener("pointerdown", createNodePointerDown, {once: true});
    }


    function createNodePointerDown(){
        const container = root.querySelector("#container");
        
        container.addEventListener("pointerup", () => {
            
            processSelection(callerId);

            addExcitingNodeToRedator.set( {
                status: null
            } );
        }, {once:true});
    }


    onMount( async () => {

        await initRedactor(container);

        urlPath = window.location.pathname;

        /*если мы на странице анкеты, то редактировать запрещенно текст*/
        if(urlPath.includes("anketa")){
           let textarea = document.querySelector(".trumbowyg-editor");
           textarea.setAttribute("contenteditable", false);

           container.addEventListener("selectstart", (e)=>{
            e.preventDefault();
            e.stopPropagation();
           });

           textarea.classList.add("blockinteraction");
        }

        

        redactorInitialized = true;
        docRoot.set(root);
        renderEditor();

        if(urlPath.includes("anketa")){
            //собрать все ноды из текста, создать simpleTexts
            try{
                await populateSimpleTexts();
            } catch (e) {
                tryAgain = true;
                throw e;
            }
        }


        connect();

        
        if(urlPath.includes("anketa")){
            //внутриполучаем узлы через nodes. определяем кого показывать кого нет.
            $documents.subscribeForNodesUpated();
        }
       

        return () => {
            $documents.unsubscribe();
        }
    });


    function connect(){
        if(!$storeForSimpleTexts) return;
        $storeForSimpleTexts.forEach( (element) => element.connect(root));
        $storeForSimpleTexts.forEach( (element) => element.createListeners());
        updateLineBreaks();
    }


    async function populateSimpleTexts(){
        tryAgain = false;
        await $documents.populateSimpleTexts();
    };


    function renderEditor(){
        console.log('{renderEditor} starting');
        editor = window.jQuery(container).trumbowyg('html', html);
        console.log('{renderEditor} after html implementint, document id: ', activeDocumentId);
    }


    function RollSpinner(e){
        //console.log("SPINNER");
        let detail = e.detail;
        if(detail === "redactor") spinner = !spinner;
    }

    /**функция используется как response на обновления массива документов.
     * коллбэк вызывается мануально из класса documents */
    function docsArrayUpdated(){
        let docs = get(documents);
        let isDocumentInialized = docs.isActiveInitialized();
        no_elements = (isDocumentInialized) ? false : true;
    }

 
</script>

<svelte:head>
    <link rel="stylesheet" href="/assets/css/trumbowyg.css">
</svelte:head>

<svelte:document on:spinner={RollSpinner}>
</svelte:document>

<div class="editor" bind:this={root} class:active_bg class:no_elements>
    {#if $showModalDocumentCreator}
        <ModalDocumentCreator />
    {/if}

    {#if tryAgain}
        <ModalTryAgain on:click={populateSimpleTexts}/>
    {/if}

    {#if spinner}
        <div class="spinner">
            <Spinner/>
        </div>
    {/if}

    <RedactorContainer bind:container {activeDocumentId}/>
   
</div>






<style>
    .editor{
        background-color: var(--white);
        height: 100%;
        caret-color: red;
        position: relative;
        border-radius: 20px 0 0 0;
    }

    .editor *{
        color: var(--deep-blue);
    }

    .editor.no_elements{
        background-color: var(--light-blue);
    }

    .spinner{
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;        
        top: 0;
        left: 0;
        z-index: 10;
        width: 100%;
        height: 100%;
        background-color: #DDE6ED80;
    }
    
    :global(.editor .trumbowyg-box .trumbowyg-editor){
        width: 21cm;
        background-color: var(--white);
    }

    :global(.trumbowyg-box i.line_break){
        border-bottom: 2px dashed var(--middle-blue);
        display: block;
        position: absolute;
        width: min(2.5cm ,2.5vh);
        left: 50%;
        transform:translateX(-340px);
        pointer-events: none;
    }

    :global(.trumbowyg-box i.line_break::before){
        content: "[новая страница]";
        position: absolute;
        top: 50%;
        left: -150%;
        transform: translate(0, -50%) rotateZ(180deg);
        writing-mode: vertical-rl; 
        color: var(--middle-blue);
        pointer-events: none;
    }


    :global(.editor .trumbowyg-box){
        background-color: var(--white-blue);
        height: 100%;
        overflow-y: auto;
        scrollbar-color: var(--gray-blue);
        scrollbar-width: 8px;
        border-radius: 20px 0 0 0;
    }

    :global(.editor .trumbowyg-box::-webkit-scrollbar-thumb){
        background-color: var(--gray-blue);
    }

    :global(.editor .trumbowyg-box::-webkit-scrollbar-button){
        display: none;
    }

    :global(.editor.no_elements .trumbowyg-editor-box){
        background-color: var(--light-blue);
        position: relative;
    }
    
    :global(.editor.no_elements .trumbowyg-editor){
        background-color: var(--light-blue);
    }
    
    :global(.editor.active_bg .trumbowyg-editor){
        background-color: var(--pale-orange);
    }

    :global(.editor .trumbowyg-box .trumbowyg-button-pane){
        position: sticky;
        top: 0;
        left: 0;
        gap: .5rem;
    }

    :global(.trumbowyg-button-pane .trumbowyg-button-group){
        gap: .2rem;
    }

    :global(.trumbowyg-button-pane button svg){
        fill:var(--light-blue);
        transition: fill 400ms ease;
    }

    :global(.trumbowyg-button-pane button:hover){

        background-color: transparent !important;
    }

    :global(.trumbowyg-button-pane button:hover svg){
        fill:var(--orange);
    }
    
    :global(.blockinteraction){
        pointer-events: none;
    }

</style>