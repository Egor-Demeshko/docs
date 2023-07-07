<script>
	import { onMount } from "svelte";
    import { storeForSimpleTexts, docRoot } from "$lib/scripts/stores";
    import Modal from "$lib/components/Modal.svelte";

    /** @description разметка документа */
    export let html = '';


    /** @description корневой элемент документа*/
    let root;



    onMount( () => {
        /**objects of text elements should be connected with there representing elements*/
        $storeForSimpleTexts.forEach( (element) => element.connect(root));
        docRoot.set(root);
        /*console.log("$storeForSimpleTexts: ", $storeForSimpleTexts);*/
    });



</script>


<section bind:this={root}>
    <div class="document" >
        {@html html}
    </div>

    <Modal />
</section>


<style>
    section{
        padding:2rem 2rem;
        height: 100%;
        width: 100%;
        min-width: 600px;
        border-left: 2px solid var(--black);
        position: relative;
    }

    .document{
        background-color: var(--white);
        box-shadow: 0 0 4px var(--black);
        height: 100%;
        border-radius: 10px;
        padding: 1rem;
        overflow-y: scroll;
    }


    :global(.doc_elements){
        position: relative;
        display: inline-block;
    }

    :global(.doc_elements:before){
        content: " ";
        position: absolute;
        display: block;
        top: 0;
        left: -.4rem;
        transform: scaleY(130%);
        width: 6px;
        height: 100%;
        border-radius: 6px;
        border-left: 4px solid aqua;
    }

    :global(.doc_elements:after){
        content: " ";
        position: absolute;
        display: block;
        top: 0;
        right: -.4rem;
        transform: scaleY(130%);
        width: 6px;
        height: 100%;
        border-radius: 6px;
        border-right: 3px solid aqua;
    }
</style>