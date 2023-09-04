<script>
    export let labelName = "";
    export let name = "";

</script>

<button on:click aria-label="{labelName}">
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
        border: var(--focus-border);
        outline: var(--focus-outline);
    }
</style>