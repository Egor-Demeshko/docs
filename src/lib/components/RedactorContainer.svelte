<script>
    export let container;
    import { beforeNavigate } from "$app/navigation";
    import { documents } from "$lib/scripts/stores";
    import { get } from "svelte/store";
    
    const docClass = get(documents);

    beforeNavigate( () => {
        docClass.sendHtmlState();
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