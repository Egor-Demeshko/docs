<script>
    export let container;
    import { beforeUpdate } from "svelte";
    import { documents } from "$lib/scripts/stores";
    import { get } from "svelte/store";

    /*
beforeUpdate( () => {
    console.log("[RedactorContainer], {beforeupdate} activeDocumentId", activeDocumentId);
});*/



function saveHtml(){
    const docClass = get(documents);

    docClass.saveHtmlState();
}
</script>

<svelte:window on:unload={saveHtml}></svelte:window>



<div id="container" bind:this={container} on:keypress={saveHtml}>

</div>