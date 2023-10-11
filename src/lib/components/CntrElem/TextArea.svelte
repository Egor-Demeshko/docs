<script>
    import { setElementActive, setElementInactive } from "$lib/scripts/docElements/controllers/ElementsSideFocusBlurProcess";
    import elementsDataUpdate from "$lib/scripts/controllers/elementsDataUpdate";
	import { getContext } from "svelte";
    export let id = "login";
    export let type = "text";
    export let placeholder = "Текст подсказка";
    export let required = false;
    export let pattern = '.*';
    export let value = '';
    export let name = '';
    export let rows = 1;
    export let validity;
    export let node_id;
    export let data_type;

    let textarea;
    const controller = getContext("controller");


    function focusIn(){
        setElementActive(id);
    }

    function focusOut(){
        setElementInactive(id);
    }


    function changeHandle(e){
        const target = e.target;
        let value = target.value;

        if(data_type === "integer"){
            value = parseInt(value);
        }

        elementsDataUpdate({id, name, content: target.value});
        $controller.saveData({node_id, content: value});
    }
</script>

<div class="input_wrapper">

    <textarea {placeholder} {id} {name} {required} {pattern} {type} {value}
    {rows}
    on:focus={focusIn}
    on:blur={focusOut}
    on:change={changeHandle}
    bind:this={textarea}
    />

</div>

<style>
    .input_wrapper{
        position: relative;
        width: 100%;
    }

    textarea{
        border: var(--border-width) solid var(--border-color);
        padding: var(--padding);
        border-radius: 30px;
        font-size: var(--font-size);
        width: 100%;
        height: 100%;
        color: var(--color);
        background-color: var(--background);
        flex: 1 0;
        transition: border 400ms ease, background 400ms ease;
        resize: vertical;
    }

    input.not_valid{
        border: var(--border-width) solid var(--pumpkin);
    }


    textarea::placeholder{
        color: var(--placeholder);
        font-style: italic;
    }

    textarea:hover{
        background-color: var(--background-hover);
        border: var(--border-width) solid var(--border-color-hover);
    }

    textarea:focus{
        background-color: var(--background);
        border: var(--border-width) solid var(--orange);
        outline: none;
    }


    textarea::-webkit-scrollbar{
        display: none;
    }
</style>