<script>
    import DropDown from "../CntrElem/DropDown.svelte";
    import { nodeOptions } from "$lib/scripts/stores";

    export let id = '';
    /* компонент создает отображение элемента для выбора типа узла  
    */

    
</script>

<div>
    <label for="block_type_picker">Тип блока</label>
    <DropDown buildTypeid={"block_type_picker"} options={nodeOptions} 
    name="node_type" {id}
    --padding=".125rem 1.8rem .125rem 1rem"
    --padding-options=".125rem 1rem"
    --border="2px solid var(--light-blue)"
    --flex="1 0"/>
</div>

<style>
    div{
        display: flex;
        flex-direction: column;
        gap: .25rem;
        width: 100%;
        outline: 2px solid transparent;
    }

    label{
        font-size: 0.875rem;
        cursor: pointer;
    }
</style>