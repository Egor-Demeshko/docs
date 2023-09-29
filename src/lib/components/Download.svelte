<script>
    import {tick} from "svelte";
    export let url;
    export let document;
    let link;

    $: if(url){
        startloading();
    }


    async function startloading(){
        if(url){
            await tick();
            const name = document.getActiveDocumentName();
            
            link.setAttribute('href', url);
            link.download =`${name}.docx`;
            link.click();
            URL.revokeObjectURL(url);
            link.download = ``;
            link.removeAttribute('href');
            url="";   
        }
    }
</script>

{#if url}
    <div>
        <a download bind:this={link}></a>
    </div>
{/if}


<style>
    div{
        display: block;
        position: fixed;
        top: 0;
        right: -1000px;
        width: 1px;
    }
</style>