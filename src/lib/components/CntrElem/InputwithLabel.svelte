<script>
    import { createEventDispatcher } from "svelte";
    export let id = "id";
    export let placeholder = "Введите данные";
    export let required = false;
    export let pattern = '.*';
    export let type = "text";
    export let label ="Название блока";
    export let value = '';

    let valid = '';
    let invalid = '';
    let input;
    const dispatch = createEventDispatcher();


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


    /*function changeHandle({data}){
        dispatch("input_name_changed", data);
        on:input={changeHandle}
    }*/
</script>

<label>
    <span>{label}</span>

    {#if type === "text"}
        <input {placeholder} {id} name={`id:${id}`} {required} {pattern} bind:value={value}
        type = "text">
    {:else if type === "number"}
        <input {placeholder} {id} name={`id:${id}`} {required} {pattern} bind:value={value}
        type = "tel">
    {/if}
</label>

<style>
    *{
        font-size: .875rem;
    }
    
    label{
        display: flex;
        flex-flow: column;
        align-items: start;
        gap: 0.25rem;
        font-weight: 400;      
    }

    span{
        color: var(--label-color);
    }

    input{
        border: var(--border);
        background-color: var(--background);
        border-radius: 15px;
        color: var(--color);
        padding: var(--padding);
        width: 100%;
        height: 100%;
    }

    input::placeholder{
        color: var(--placeholder);
    }
</style>