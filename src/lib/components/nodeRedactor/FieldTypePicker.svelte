<script>
    import DropDown from "../CntrElem/DropDown.svelte";
    import { nodeOptions } from "$lib/scripts/stores";
</script>

<div>
    <label for="block_type_picker">Тип блока</label>
    <DropDown id={"block_type_picker"} options={nodeOptions} name="node_type"
    --padding=".125rem 1.8rem .125rem 1rem"/>
</div>

<style>
    div{
        display: flex;
        flex-direction: column;
        gap: .25rem;
        width: 100%;
    }

    label{
        font-size: 0.875rem;
        cursor: pointer;
    }
</style>