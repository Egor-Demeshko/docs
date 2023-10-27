<script>
    import { createEventDispatcher } from "svelte";

    export let id = "id";
    export let placeholder = "Введите данные";
    export let required = false;
    export let pattern = '.*';
    export let type = "text";
    export let label ="Название блока";
    export let value = '';
    export let validity;
    export let name;

    $: not_valid = (validity?.status === "invalid" && isCurrentField()) ? true : false; 
    $: console.log("[INPUTWITHLABEL]: input value: ", value);

    let dispatch = createEventDispatcher();

    function isCurrentField(){
        let data = validity.err_data;

        for(let i=0; i < data.length; i++){
            if(data[i]?.field_name === name) return true;
        }

        return false;
    }


    function inputHandle({target}){
        ///console.log('[__TEST__ INPUT WITH LABEL]: target.value: ', target.value);
        if(name === "name"){
            dispatch("data-changed", {id, name: target.value});
        } else {
            value = target.value;
        }
    }


</script>

<label>
    <span>{label}</span>

    <div class="input_wrapper" class:not_valid>
        <div class="error_mark">
            <svg>
                <use href="/assets/icons/all.svg#ex_mark"></use>
            </svg>
        </div>

        {#if type === "text"}
            <input {placeholder} {id} name={`id:${id}`} {required} {pattern} {value}
            type = "text" on:input={inputHandle}>
        {:else if type === "number"}
            <input {placeholder} {id} name={`id:${id}`} {required} {pattern} {value}
            type = "tel" on:input={inputHandle}>
        {/if}
    </div>
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
        width: 100%;  
    }

    span{
        color: var(--label-color);
    }

    input{
        border: var(--border-width) solid var(--border-color);
        background-color: var(--background);
        border-radius: 15px;
        color: var(--color);
        padding: var(--padding);
        width: 100%;
        height: 100%;
        transition: border 400ms ease, background 400ms ease;
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
        border: var(--border-width) solid var(--orange);
        background-color: var(--background);
        outline: none;
    }

    .input_wrapper{
        position: relative;
        width: 100%;
    }


    /**отрисовка стилей ошибки*/
    .not_valid input{
        border: var(--border-width) solid var(--pumpkin);
    }

    .error_mark{
        width: calc(var(--border-radius) * 1.125);
        height: 100%;
        border-radius: var(--border-radius) 0 0 var(--border-radius);
        background-color: var(--pumpkin);
        position: absolute;
        left: 0;
        top: 0;
        display: none;
        justify-content: start;
        align-items: start;
    }

    .error_mark svg{
        fill: var(--light-blue);
        width: 2px;
        max-height: 11px;
        transform: translate(50%, -50%);  
        position: relative;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }


    .not_valid .error_mark{
        display: flex;
    }
    /********/
</style>