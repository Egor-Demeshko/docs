<script>
    export let container;
    import { beforeNavigate } from "$app/navigation";
    import { documents } from "$lib/scripts/stores";
	import { onDestroy, onMount } from "svelte";
    import { get } from "svelte/store";
    import {initBreakers, deleteBreakers} from '$lib/scripts/utils/redactor/LineBreakers/LineBreaker.js';
    
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
        docClass.saveHtmlState();
        docClass.setDocumentUpdated();
    }

    function blur(){
        docClass.saveHtmlState();
        docClass.sendHtmlState();
    }


</script>

<svelte:window on:unload={saveHtml}></svelte:window>



<div id="container" bind:this={container} on:keypress={saveHtml} on:blur={blur}>

</div>

<style>
    @media print{
        #container{
            display: block;
            padding: 0 10mm 0 20mm; 
            margin: 0;
            box-sizing: border-box;
        }

        @page{
            size: A4;
            margin: 0 0 0 0;
        }
    }
</style>