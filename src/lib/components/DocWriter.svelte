<script>
	import { onMount } from "svelte";
    import { storeForSimpleTexts, docRoot } from "$lib/scripts/stores";
    import Modal from "$lib/components/Modal.svelte";
	import TroumboneRedactor from "./TroumboneRedactor.svelte";

    /** @description разметка документа */
    export let html = '';


    /** @description корневой элемент документа*/
    let root;


    onMount( async () => {
       

        //console.log("[DOC WRITER]: HTML: ", html);
    });



</script>


<svelte:head>

</svelte:head>


<section bind:this={root} >
    <TroumboneRedactor {html}/>

    <Modal />
</section>


<style>
    section{
        height: 100%;
        width: 100%;
        min-width: 600px;
        border-left: 2px solid var(--black);
        position: relative;
    }

    :global(.doc_elements){
        position: relative;
        display: inline-block;
        background-color: var(--doc-element-bg);
        transition: background 400ms ease;
    }


    :global(.doc_elements:hover){
        background-color: var(--pale-orange);
    }

    /*
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
        border-left: 4px solid var(--doc-element-bg);
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
        border-right: 3px solid var(--node-bg);
    }
*/

    :global(.doc_active){
        background-color: var(--orange);
    }


    /**doc redactor*/
    :global(.ql-snow){
        background-color: var(--white);
        margin-bottom: 1rem;
    }
</style>