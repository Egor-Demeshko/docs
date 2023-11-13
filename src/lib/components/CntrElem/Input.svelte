<script>
    import { createEventDispatcher } from "svelte";
    import { nodeController } from "$lib/scripts/stores";

    export let id = "login";
    export let type = "text";
    export let placeholder = "Логин";
    export let required = false;
    export let pattern = '.*';
    export let value = '';
    export let name = '';
    export let autocomplete = "on";
    export let validity;

    let valid = '';
    let invalid = '';
    let input;
    const dispatch = createEventDispatcher();

    $: not_valid = (validity?.status === "invalid" && isCurrentField()) ? true : false; 

    function isCurrentField(){
        let data = validity.err_data;
        //console.log("[input]: data: ", data);
        console.log("[INPUT]: value: ", value);
        for(let i=0; i < data.length; i++){
            if(data[i]?.field === name || data[i]?.field === "condition") return true;
        }

        return false;
    }

    /**если пустая строка, то с сервера может не вернутся поле совсем, тогда влазит undefined*/
    $: value = (value === undefined) ? '' : value;


    function startValidation(){
        let reg = new RegExp(pattern);

        if(!input.value && !required) {
            setValid();
            return;
        };

        if(reg.test(input.value) && input.checkValidity()){
            setValid();
        } else {
            setInvalid();
        }
    }


    function setValid(){
        invalid = false;
        valid = true; 
    }


    function setInvalid(){
        valid = false;
        invalid = true;
    }


    function blurHandler(){
        startValidation();
    }


    function changeHandle(e){
        let value = e.target.value;
        value = $nodeController.tryToForceTypeToInteger(value);
        dispatch("data-changed", {id, [name]: value});
    }
</script> 

<div class="input_wrapper" class:not_valid>

    <input {placeholder} {name} {required} {pattern} {type} {value} {autocomplete}
    class:not_valid
    on:blur={blurHandler}
    on:input={changeHandle}
    bind:this={input}
    />
</div>

<style>
    .input_wrapper{
        position: relative;
        flex: var(--flex);
    }


    input{
        border: var(--border-width) solid var(--border-color);
        padding: var(--padding);
        border-radius: 30px;
        font-size: var(--font-size);
        width: 100%;
        height: 100%;
        color: var(--color);
        background-color: var(--background);
        transition: border 400ms ease, background 400ms ease;
    }


    input.not_valid{
        border: var(--border-width) solid var(--pumpkin);
    }


    input::placeholder{
        color: var(--placeholder);
        font-style: italic;
    }


    input:hover{
        background-color: var(--background-hover);
        border: var(--border-width) solid var(--border-color-hover);
    }


    input:focus{
        background-color: var(--background);
        border: var(--border-width) solid var(--orange);
        outline: none;
    }
</style>
