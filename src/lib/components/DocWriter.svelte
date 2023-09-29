<script>
    import { page } from '$app/stores';
	import { getContext, onMount } from "svelte";
    import { documents } from "$lib/scripts/stores";
    import createOnDocumentRedactorEvents from "$lib/scripts/docElements/GlobalRedactorEvents";
    import Modal from "$lib/components/Modal.svelte";
	import TroumboneRedactor from "./TroumboneRedactor.svelte";
    import Button2 from "$lib/components/CntrElem/Button2.svelte";
	import Download, { downloadState } from "./Download.svelte";


    const docCntl = getContext("templateController");
    const docStore = $documents;
    const route = $page.route.id;

    
    /** @description разметка документа */
    /*export let html = '';
*/

    /** @description корневой элемент документа*/
    let root;


    onMount( async () => {
        createOnDocumentRedactorEvents(root);
    });


    async function download(){
        const name = docStore.getActiveDocumentName();
        const html = docStore.gainActiveHtml();
        
        try{
            let url = await docCntl.createDocFromHtml(name, html);
            downloadState.set({url, name}); 

        } catch (e){
            console.log('[DOCWRITER]: error: ', e.message);
            //TODO показать сообзение об ошибке загрузки файла
        }

    }


    async function save(){
        const name = docStore.getActiveDocumentName();
        const html = docStore.gainActiveHtml();
        const project_id = docStore.projectId;

        try {
            const result = await docCntl.saveDocument(project_id, name, html);
            
            if(result.success){
                document.dispatchEvent( new CustomEvent("error", {detail: {
                    err_data: [
                        {
                            blockId: 0,
                            message: "Документ успешно сохранен!",
                            err_id: 1000,
                            err_type: "simple"
                        }
                    ]
                }}));
            }
        } catch (e){

            document.dispatchEvent( new CustomEvent("error", {detail: {
                    err_data: [
                        {
                            blockId: 0,
                            message: "Сохранить документ не удалось. Попробуйте еще раз!",
                            err_id: 1000,
                            err_type: "emergency"
                        }
                    ]
                }}));
        }
    }   





</script>


<svelte:head>

</svelte:head>


<section bind:this={root} >
    <TroumboneRedactor />

    <Modal />

    {#if route.includes("anketa") }
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
        on:click={save}
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
        --focus-outline="none"
        on:click={download}/>
    </div>
    {/if}

</section>


<Download document={docStore}/>



<style>
    section{
        height: 100%;
        width: 100%;
        position: relative;
        border-radius: 20px 0 0 0;
    }

    .doc__buttons{
        position: absolute;
        top: .6rem;
        right: 3.7rem;
        display: flex;
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