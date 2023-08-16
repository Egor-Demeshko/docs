<script>
	import { onMount } from "svelte";

    export let fnToRunOnClick;
    export let labelName = "";
    export let name = "";
    export let setFocus = false;

    
    let button;

    onMount( () => {
        startFocus();
    });

    function startFocus(){
        if(setFocus) button.focus();
    }

</script>

<button on:click={fnToRunOnClick} aria-label="{labelName}" bind:this={button}>
    {name}    
</button>

<style>
    button{
        display: block;
        appearance: none;
        background-color: var(--bg);
        color: var(--color);
        border: var(--border);
        border-radius: 30px;
        cursor: pointer;
        font-size: var(--font-size);
        padding: var(--padding);
        text-align: center;
        transition: background 600ms ease, color 600ms ease, border 600ms ease;
        width: 100%;
        outline: none;
    }

    button:hover{
        background-color: var(--bg-hover);
        color: var(--color-hover);
        border: var(--border-hover);
    }

    button:focus{
        border: 2px solid var(--orange);
    }
</style>