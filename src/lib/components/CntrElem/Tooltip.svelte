<script>
    import { fly } from "svelte/transition";
    import { showTooltip } from "$lib/scripts/stores";
	import { tick } from "svelte";
    let x = 0;
    let y = 0;
    let show;       
    
    $: place = $showTooltip.place;
    $: text = $showTooltip.text;
    $: coors = $showTooltip.coors;
    $: if (coors){
        updateCors(coors);
    } else {
        setFalse();
    }
    
    async function updateCors(){
        await tick();
        x = coors.x;
        y = coors.y;
        show = $showTooltip.show;
    }

    async function setFalse(){
        await tick();
        show = false;
    }
</script>

{#if show && place === "above"}
    <div inert
    in:fly={{y: -10, duration: 400}}
    out:fly={{y: 10, duration: 400}}
    style="top: {y}px; left: {x}px"
    class="above">
        <span>
            {text}
        </span>
    </div>
{:else if show}
    <div inert
    in:fly={{y: -10, duration: 400}}
    out:fly={{y: 10, duration: 400}}
    style="top: {y}px; left: {x}px"
    class="under">
        <span>
            {text}
        </span>
    </div>
{/if}



<style>
    div{
        background-color: var(--bg);
        font-style: italic;
        font-size: .878rem;
        padding: .25rem .5rem;
        position: fixed;
        border-radius: 4px;
        z-index: 30;
        max-width: 360px;
    }

    span{
        color: var(--color);
    }

    .under{
        transform: translate(-50%, 100%);
    }

    .above{
        transform: translate(-50%, -180%);
    }

    @media print{
        div{
            display: none;
        }
    }
</style>