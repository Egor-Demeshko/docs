<script>
    import AnketaInput from "$lib/components/anketa/AnketaInput.svelte";
    import SelectInput from "$lib/components/anketa/SelectInput.svelte";
    import AnketaDropdown from "$lib/components/anketa/AnketaDropdown.svelte";
    import { nodes } from "$lib/scripts/stores";
	import { onMount, setContext } from "svelte";
    import { anketaGraphController } from "$lib/scripts/stores";

    $: console.log("[INPUTELEMENTS]: nodes", $nodes);
    
    setContext("controller", anketaGraphController);
    
</script>

<div>
    {#each $nodes as data}

        {#if data.node_type === "text" || data.node_type === "entry"}
            <AnketaInput {data}/>
        {:else if data.node_type === "select" && data.view_type === "radiobutton"}
            <SelectInput {data}/>
        {:else if data.node_type === "select" && data.view_type === "drop_list"}
            <AnketaDropdown {data} />
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
    }
</style>