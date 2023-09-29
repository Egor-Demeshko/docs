<script context="module">
    import { writable } from "svelte/store";

    export const downloadState = writable({
        url: undefined,
        name: undefined
    });
</script>

<script>
    import {tick} from "svelte";
    let link;
    
    $: url = $downloadState.url;
    $: name = $downloadState.name;
    $: if(url){
        startloading();
    }


    async function startloading(){
        if(url){
            await tick();            
            link.setAttribute('href', url);
            link.download =`${name}.docx`;
            link.click();
            URL.revokeObjectURL(url);
            link.download = ``;
            link.removeAttribute('href');
            downloadState.set("");   
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