<script>
    import Button from "$lib/components/CntrElem/Button.svelte";
    import FilePicker from "$lib/components/CntrElem/FilePicker.svelte";
    import {documents, showModalDocumentCreator} from "$lib/scripts/stores";
	import { get } from 'svelte/store';
    import { fade } from "svelte/transition";

    let unsubscribe;
    let showSpinner;
    let form;


    async function createNewDocument(){
        /*let result;
        showSpinner = true;
        let docClass;

        
        //console.log(docClass);
        result = await docClass.createNewDocument();
        
        showSpinner = false;*/
        let docClass = get(documents);
        showModalDocumentCreator.set(false);
        document.dispatchEvent(new CustomEvent("spinner", {detail: "redactor"}));
        let result = await docClass.handleCreateRequest({name: undefined, html: undefined});

        //отключаем спиннер
        document.dispatchEvent(new CustomEvent("spinner", {detail: "redactor"}));
        if(!result.success){
            showModalDocumentCreator.set(true);
            return;
        }
        docClass.initDocument();
    }


    /*function closeClick(e){
        if(e.target.tagName === "BUTTON" || e.target.tagName === "LABEL" || e.target.tagName === "INPUT") return;

        console.log("[ModalDocumentCreator]: CLICK", e.target);

        let docClass = get(documents);
        let length = docClass.docs.length;

        if(!length) return;

        showModalDocumentCreator.set(false);
    }*/


    async function change(e){
        console.log("[ModalDocumentCreator]: change ", e.target);
        
        const input = e.target;
        const formData = new FormData(form);
        if(!formData.has("file")) return;
        const docClass = get(documents);

        showModalDocumentCreator.set(false);
        //включаем спиннер
        document.dispatchEvent(new CustomEvent("spinner", {detail: "redactor"}));

        let result = await docClass.sendFile(formData);
        //отключаем спиннер
        document.dispatchEvent(new CustomEvent("spinner", {detail: "redactor"}));

        if(!result){
            showModalDocumentCreator.set(true);
        } 
    }

</script>


<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="modal" 
in:fade
out:fade={{duration: 400}}>

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
        <form id="doc_file_picker" bind:this={form}>
            <FilePicker 
            text={"Загрузить документ"}
            --bg="var(--middle-blue)"
            --color="var(--light-blue)"
            --border="2px solid var(--middle-blue)"
            --font-size=".875rem"
            --padding=".625rem"
            --bg-hover="var(--gray-blue)"
            --color-hover="var(--white-blue)"
            --border-hover="2px solid var(--gray-blue)"
            --display="block"
            on:change={change}/>
        </form>
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