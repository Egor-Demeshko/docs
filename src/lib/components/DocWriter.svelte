<script>
	import { onMount } from "svelte";
    import createOnDocumentRedactorEvents from "$lib/scripts/docElements/GlobalRedactorEvents";
    import Modal from "$lib/components/Modal.svelte";
	import TroumboneRedactor from "./TroumboneRedactor.svelte";

    
    /** @description разметка документа */
    /*export let html = '';
*/

    /** @description корневой элемент документа*/
    let root;


    onMount( async () => {
        createOnDocumentRedactorEvents(root);
    });





</script>


<svelte:head>

</svelte:head>


<section bind:this={root} >
    <TroumboneRedactor />

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
    

    /* не удалять этот класс. на него валидируемся при событии*/
    :global(.doc_elements){
        position: relative;
        display: inline-block;
        background-color: var(--doc-element-bg);
        transition: background 400ms ease, transform 400ms ease;
        padding: 2px 3px;
        border-radius: 4px;
    }

    :global(.doc_elements:focus){
        outline: none;
    }


    :global(.doc_elements:hover){
        background-color: var(--pale-orange);
    }

    :global(.documents_hoverlike){
        background-color: var(--pale-orange);
    }

    :global(.doc_elements.not_valid){
        background-color: var(--peach);
    }

    :global(.doc_elements.not_valid:hover){
        background-color: var(--pale-orange);
    }

    :global(.documents_hoverlike.not_valid){
        background-color: var(--pale-orange);
    }


    :global(.no_display){
        display: none;
    }

    :global(.doc_active){
        background-color: var(--orange);
        transform: scale(107%) translate(0);
        z-index: 1;
        box-shadow: 0 0 2px var(--middle-blue);
    }

    /**doc redactor*/
    :global(.ql-snow){
        background-color: var(--white);
        margin-bottom: 1rem;
    }
</style>