<script>
    export let fnToRunOnClick;
    export let labelName = "";
    export let name = "";
</script>

<button on:click={fnToRunOnClick} aria-label="{labelName}">
    {name}    
</button>