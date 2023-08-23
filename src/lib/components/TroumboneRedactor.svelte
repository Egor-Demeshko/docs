<script>
    import jQuery from 'jquery'; 
    import { onMount } from 'svelte';
    import {storeForSimpleTexts, docRoot, documents} from '$lib/scripts/stores';
    import { addExcitingNodeToRedator } from "$lib/scripts/controllers/nodes/processStores/addNodesStore.js";
    import { processSelection } from "$lib/scripts/utils/nodes/proccessAddingNodeTOText.js";


    let html = '';
    let editor;
    /**ссылка на dom элемент, где и будет редактор*/
    let container;
    let root;
    /*записываем обычный id блока. в данном случае айди блока которые вызвал поток добавление переменной в текст*/
    let callerId;
    let urlPath = '';
    /**флаг для того чтобы реактивность документа не срабатывала до того как будет инициализирован редактор*/
    let redactorInitialized = false;

    /** меняет цвет заднего фона при старте процесс добавление переменной*/
    $: active_bg = ($addExcitingNodeToRedator.status === "start") ? true : false;
    $: if($addExcitingNodeToRedator.status === "start"){
        callerId = $addExcitingNodeToRedator.id;
        createListenersForNodeAddition();
    }


    documents.subscribe( (docs) => {
        if(!docs) return;
        html = docs.gainActiveHtml();
    });


    $: if(html && redactorInitialized) {
        renderEditor()
    };


    /**ФУНКЦИИ В АЛФАВИТНОМ ПОРЯДКЕ*/

    function createListenersForNodeAddition(){
        let eventSelection = null;
        
        root.addEventListener("pointerdown", function createNodePointerDown(){
            /** теперь отслеживаем выделение текста и при измернение выделения, отправляем на создание*/

            document.addEventListener("selectionchange", storeEvent);

            root.addEventListener("pointerup", () => {
                document.removeEventListener("selectionchange", storeEvent);
                
                processSelection(callerId, eventSelection);

                addExcitingNodeToRedator.set( {
                    status: null
                } );
            }, {once:true});

        }, {once: true});


        function storeEvent(e){
            console.log("[troumbone]: selection changed, ");
            eventSelection = e;
        }       
    }


    onMount( async () => {
        if (!window.jQuery) window.jQuery = jQuery;
        await import('trumbowyg');

        window.jQuery.trumbowyg.svgPath = '/assets/icons/troumbone.svg';
        //console.log(window.jQuery.trumbowyg);
        window.jQuery(container).trumbowyg({
            tagsToKeep: ['span'],
            btnsDef: {
                print: {
                    fn: () => window.print(),
                    title: 'Напечатать',
                    text: 'Print',
                    class: '',
                    hasIcon: true,
                    ico: "print"
                },
            },
            btns: [
                ['undo', 'redo'], 
                ['formatting'],
                ['strong', 'em', 'del'],
                ['superscript', 'subscript'],
                ['link'],
                ['insertImage'],
                ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
                ['unorderedList', 'orderedList'],
                ['horizontalRule'],
                ['removeformat'],
                ['print'],
                ['fullscreen']
            ]
        });

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
    });


    function renderEditor(){
        editor = window.jQuery(container).trumbowyg('html', html);
        $storeForSimpleTexts.forEach( (element) => element.connect(root));
        $storeForSimpleTexts.forEach( (element) => element.createListeners());
    }

 
</script>

<svelte:head>
    <link rel="stylesheet" href="/assets/css/trumbowyg.css">
</svelte:head>

<div class="editor" bind:this={root} class:active_bg>
    <div bind:this={container}>
        
    </div>
</div>

<style>
    .editor{
        background-color: var(--white);
        box-shadow: 0 0 4px var(--black);
        height: 100%;
        border-radius: 18px 0 0 0;
        overflow-y: scroll;
        caret-color: red;
    }

    .editor *{
        color: var(--deep-blue);
    }

    :global(.editor.active_bg .trumbowyg-editor){
        background-color: var(--pale-orange);
    }

    :global(.editor .trumbowyg-box){
        background-color: var(--white-blue);
        padding: 5rem 0;
    }

    :global(.editor .trumbowyg-box .trumbowyg-editor){
        max-width: 21cm;
        background-color: var(--white);
    }

    :global(.editor .trumbowyg-box .trumbowyg-button-pane){
        position: absolute;
        top: 0;
        left: 0;
    }

    :global(.blockinteraction){
        pointer-events: none;
    }
</style>