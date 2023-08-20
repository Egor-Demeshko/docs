<script>
    import jQuery from 'jquery'; 
    import { onMount } from 'svelte';
    import {storeForSimpleTexts, docRoot} from '$lib/scripts/stores';
    import { addExcitingNodeToRedator } from "$lib/scripts/controllers/nodes/processStores/addNodesStore.js";
    import { processSelection } from "$lib/scripts/utils/nodes/proccessAddingNodeTOText.js";


    export let html = '';
    let editor;
    let container;
    let root;

    /*записываем обычный id блока. в данном случае айди блока которые вызвал поток добавление переменной в текст*/
    let callerId;

    /** меняет цвет заднего фона при старте процесс добавление переменной*/
    $: active_bg = ($addExcitingNodeToRedator.status === "start") ? true : false;
    $: if($addExcitingNodeToRedator.status === "start"){
        callerId = $addExcitingNodeToRedator.id;
        createListenersForNodeAddition();
    }

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
                ['viewHTML'],
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

        editor = window.jQuery(container).trumbowyg('html', html);
        docRoot.set(root);
        $storeForSimpleTexts.forEach( (element) => element.connect(root));
        $storeForSimpleTexts.forEach( (element) => element.createListeners());
    });

 
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
</style>