<script>
    import InputwithLabel from "../CntrElem/InputwithLabel.svelte";
    import Arrow from "./Arrow.svelte";
	import Compare from "./Compare.svelte";
	import ContentRedactor from "./ContentRedactor.svelte";
    import FieldTypePicker from "./FieldTypePicker.svelte";
    import { nodeOptions } from "$lib/scripts/stores";
    import CheckBoxWithLabel from "./CheckBoxWithLabel.svelte";
	import ToggleWhite from "./ToggleWhite.svelte";
    import List from "./List.svelte";

    $: node_type = gainNodeType($nodeOptions);
    /*$: console.log("[NodeRedactor]: node_type changed: ", node_type);*/

    function gainNodeType(array){
        for(let i = 0; i < array.length; i++){
            if(array[i].selected === true) return array[i].value;
        }
    }


</script>

<form>
    <div class="arrow__position">
        <Arrow />
    </div>

    <div class="controls">
        <FieldTypePicker />
        <Compare />
        <InputwithLabel id={"name"}
        --background = "var(--light-blue)"
        --color ="var(--deep-blue)"
        --placeholder="var(--faded-gray-blue)"
        --border="none"
        --padding="0.5rem 1rem"/>
        {#if node_type === "checkbox"}
            <CheckBoxWithLabel />
        {/if}
        {#if node_type === "radiobutton"}
            <ToggleWhite />
        {/if}
    </div>

    <div class="redactors">
        {#if node_type === "text" || node_type === "entry"}
            <ContentRedactor id={"content"} {node_type} label={"Содержание блока"} rows={5}
            placeholder={"Содержание отображается в тексте документа"}/>
            <ContentRedactor id={"description"} {node_type} label={"Описание блока"} 
            placeholder={"Описание будет отображаться в анкете"}/>
        {/if}
        {#if node_type === "checkbox"}
            <ContentRedactor id={"description"} {node_type} label={"Описание блока"}/>
        {/if}
        {#if node_type === "radiobutton"}
            <div class="radiobutton__wrapper">
                <List />
                <ContentRedactor id={"description"} {node_type} label={"Описание блока"}/>
            </div>
        {/if}
    </div>

</form>

<style>
    form{
        display: flex;
        position: relative;
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

    .arrow__position{
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%, -40%);
    }

    .radiobutton__wrapper{
        display: flex;
        justify-content: center;
        width: 100%;
        height: 100%;
        gap: 2.5rem;
    }
</style>