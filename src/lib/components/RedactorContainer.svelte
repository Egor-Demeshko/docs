<script>
    
    import { beforeNavigate } from "$app/navigation";
    import { documents } from "$lib/scripts/stores";
	import { onMount } from "svelte";
    import { get } from "svelte/store";
    import {initBreakers, deleteBreakers} from '$lib/scripts/utils/redactor/LineBreakers/LineBreaker.js';
    export let container;
    
    const docClass = get(documents);

    beforeNavigate( () => {
        docClass.sendHtmlState();
    });

    onMount( () => {
        initBreakers(container);

        return () => {
            deleteBreakers();
        }
    });

    function saveHtml(){
        docClass.setDocumentUpdated();
        docClass.saveHtmlState();
    }

    async function blur(){
        await docClass.saveHtmlState();
        docClass.sendHtmlState();
    }

    function redactorChanged(){
        console.log("[REDACTOR]: redactorChanged");
        /**помечаем что документ обновился, чтобы в дальнейшем он мог сохраниться*/
        /** сохраняем изменения в макете*/
        $documents.setDocumentUpdated();
        $documents.saveHtmlState();
    }


</script>

<svelte:window on:unload={saveHtml}></svelte:window>
<svelte:document on:document_updated={saveHtml}></svelte:document>



<div id="container" bind:this={container} on:keypress={saveHtml} on:blur={blur}>

</div>

<style>
</style>