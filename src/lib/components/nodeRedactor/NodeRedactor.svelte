<script>
    import InputwithLabel from "../CntrElem/InputwithLabel.svelte";
    import Arrow from "./Arrow.svelte";
	import Compare from "./Compare.svelte";
	import ContentRedactor from "./ContentRedactor.svelte";
    import FieldTypePicker from "./FieldTypePicker.svelte";

    let node_type = "entry";
</script>

<form>
    <div class="controls">
        <FieldTypePicker />
        <Compare />
        <InputwithLabel />
        {#if node_type === "radiobutton"}
            <!-- TODO добавить тоггле большой белый -->
        {/if}
    </div>
    <div class="redactors">
        <ContentRedactor />
        <InputwithLabel />
    </div>
</form>

<style>
    form{
        display: flex;
        padding: 2rem 1.5rem 2rem 2rem;
        background-color: var(--middle-blue);
        width: 100%;
        gap: 2.5rem;
        justify-content: space-between;
    }


    .controls{
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: space-between;
        align-items: start;
    }


    .redactors{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;
        flex: 3;
    }

    .controls,
    .redactors{
        gap: 1rem;
        width: 100%;
    }
</style>