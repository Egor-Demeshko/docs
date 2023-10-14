<script>
    import AnketaInput from "$lib/components/anketa/AnketaInput.svelte";
    import SelectInput from "$lib/components/anketa/SelectInput.svelte";
    import AnketaDropdown from "$lib/components/anketa/AnketaDropdown.svelte";
    import AnketaCheckbox from "$lib/components/anketa/AnketaCheckbox.svelte";
    import { nodes } from "$lib/scripts/stores";
	import { setContext } from "svelte";
    import { anketaGraphController } from "$lib/scripts/stores";

    $: console.log("[INPUTELEMENTS]: nodes", $nodes);
    
    setContext("controller", anketaGraphController);
    
</script>

<div>
    {#each $nodes as data}
        {#if data.node_type === "text" || data.node_type === "entry"}
            <AnketaInput id={data.id} 
            name={data.name}
            content={data.content}
            data_type={data.data_type}/>
        {:else if data.node_type === "select" && data.view_type === "radiobutton"}
            <SelectInput id={data.id} {data}/>
        {:else if data.node_type === "select" && data.view_type === "drop_list"}
            <AnketaDropdown id={data.id} {data} />
        {:else if data.node_type === "checkbox"}
            <AnketaCheckbox id={data.id} {data}/>
        {/if}
    {/each}
</div>

<style>
    div{
        background-color: var(--light-blue);
        height: 100%;
        overflow-y: scroll;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        padding: 2rem 1.5rem;
        /**firefox*/
        scrollbar-color: var(--gray-blue);
        scrollbar-width: 8px;
    }


    /**webkit scrollbar*/
    div::-webkit-scrollbar{
        width: 8px;
    }

    div::-webkit-scrollbar-thumb{
        background-color: var(--gray-blue);
    }

    div::-webkit-scrollbar-button{
        display: none;
    }

    div::-webkit-scrollbar-track{
        background-color: transparent;
    }


</style>