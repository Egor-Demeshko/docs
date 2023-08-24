<script>
    import Button from "$lib/components/CntrElem/Button.svelte";
    import Spinner from "$lib/components/Spinner.svelte"
    import {documents, showModalDocumentCreator} from "$lib/scripts/stores";
	import { get } from 'svelte/store';
    import { fade } from "svelte/transition";

    let unsubscribe;
    let showSpinner;


    async function createNewDocument(){
        let result;
        showSpinner = true;
        let docClass;

        docClass = get(documents);
        console.log(docClass);
        result = await docClass.createNewDocument();
        console.log("[MODALDOCUMENT]", result);
        showSpinner = false;
        showModalDocumentCreator.set(false);
    }

</script>


<div class="modal" in:fade>
    {#if showSpinner}
        <Spinner/>
    {/if}

    {#if !showSpinner}
    <div class="buttons">
        <Button fnToRunOnClick={createNewDocument}
        name={"Создать новый документ"}
        --bg="var(--middle-blue)"
        --color="var(--light-blue)"
        --border="2px solid var(--middle-blue)"
        --font-size=".875rem"
        --padding=".625rem"
        --bg-hover="var(--gray-blue)"
        --color-hover="var(--white-blue)"
        --border-hover="2px solid var(--gray-blue)"
        />
        <Button fnToRunOnClick={console.log}
        name={"Загрузить документ"}
        --bg="var(--middle-blue)"
        --color="var(--light-blue)"
        --border="2px solid var(--middle-blue)"
        --font-size=".875rem"
        --padding=".625rem"
        --bg-hover="var(--gray-blue)"
        --color-hover="var(--white-blue)"
        --border-hover="2px solid var(--gray-blue)"/>
    </div>
    {/if}
</div>

<style>
    .modal{
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 20px 0 0 0;
        background-color: #DDE6ED80;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 0;
        left: 0;
        z-index: 100;
    }

    .buttons{
        width: 25.6rem;
        display: flex;
        flex-direction: column;
        gap: .875rem;
    }

</style>