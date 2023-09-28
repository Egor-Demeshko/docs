<script>
	import { onMount } from "svelte";
    import createOnDocumentRedactorEvents from "$lib/scripts/docElements/GlobalRedactorEvents";
    import Modal from "$lib/components/Modal.svelte";
	import TroumboneRedactor from "./TroumboneRedactor.svelte";
    import Button2 from "$lib/components/CntrElem/Button2.svelte";

    
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

    <div class="doc__buttons">
        <Button2 name={"Сохранить"}
        --bg="transparent"
        --color="var(--white-blue)"
        --border="2px solid var(--white-blue)"
        --font-size=".875rem"
        --padding=".25rem 1rem"
        --bg-hover="var(--gray-blue)"
        --color-hover="var(--white-blue)"
        --border-hover="2px solid var(--white-blue)"
        --focus-border="2px solid var(--orange)"
        --focus-outline="none"
        />
        <Button2 name={"Скачать"}
        --bg="transparent"
        --color="var(--white-blue)"
        --border="2px solid var(--white-blue)"
        --font-size=".875rem"
        --padding=".25rem 1rem"
        --bg-hover="var(--gray-blue)"
        --color-hover="var(--white-blue)"
        --border-hover="2px solid var(--white-blue)"
        --focus-border="2px solid var(--orange)"
        --focus-outline="none"/>
    </div>
</section>


<style>
    section{
        height: 100%;
        width: 100%;
        position: relative;
        border-radius: 20px 0 0 0;
    }

    .doc__buttons{
        position: absolute;
        top: .8rem;
        right: 1.5rem;
        display: flex;
       /* max-height: 1.5rem;*/
        gap: 1rem;
        z-index: 100;
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

    @media print{
        :global(.doc_elements){
            background-color: none;
        }

        :global(.doc_active){
            transform: none;
            box-shadow: none;
            background-color: none; 
        } 
    }
</style>