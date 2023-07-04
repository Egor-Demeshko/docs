<script>
    export let fnToRunOnClick;
    export let labelName = "";
    export let name = "";
</script>

<button on:click={fnToRunOnClick} aria-label="{labelName}">
    {name}    
</button>

<style>
    button{
        display: block;
        appearance: none;
        background-color: var(--elem-bg);
        border: none;
        border-radius: 10px;
        cursor: pointer;
        font-size: inherit;
        font-family: inherit;
        padding: 1rem 2rem;
        margin: 0 auto;
        transition: background 600ms ease, color 600ms ease;
    }

    button:hover{
        background-color: var(--elem-bg-hover);
        color: var(--elem-color);
    }
</style>