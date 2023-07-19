<script>
    export let fnToRunOnClick;
    export let labelName = "";
    export let name = "";
    
    /**@description признак по которому определяется поведение кнопки*/
    export let sing = "";

</script>

<button on:click={fnToRunOnClick} aria-label="{labelName}">
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
        font-size: 1.125rem;
        font-family: 1.125rem;
        padding: var(--padding);
        text-align: center;
        transition: background 600ms ease, color 600ms ease, border 600ms ease;
        width: 100%;
    }

    button:hover{
        background-color: var(--bg-hover);
        color: var(--color-hover);
        border: var(--border-hover);
    }
</style>