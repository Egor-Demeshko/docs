<script>
    import { createEventDispatcher } from "svelte";
    import { showTooltip } from "$lib/scripts/stores";

    export let id = "login";
    export let type = "text";
    export let placeholder = "Логин";
    export let required = false;
    export let pattern = '.*';
    export let value = '';
    export let name = '';
    export let validity;
    export let text = '';
    
    

    let valid = '';
    export let invalid = false;
    export let input;
    let passwordVisible = false;
    const dispatcher = createEventDispatcher();

    $: not_valid = (validity?.status === "invalid" && isCurrentField()) ? true : false; 

    function isCurrentField(){
        let data = validity.err_data;

        for(let i=0; i < data.length; i++){
            if(data[i]?.field_name === name) return true;
        }

        return false;
    }


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
        text = "";

        dispatcher("valid", {id, validity: true});
        showTooltip.set(false);
    }


    function setInvalid(){
        dispatcher("invalid", {id, validity: false});
        text = "Минимум 5 символoв. Латинские буквы, цифры, _";
        invalid = true;
    }


    function blurHandler(){
        showTooltip.set({show: false});
        startValidation();
    }


    function clickHandle(e){
        if(e.target.tagName === "path" || e.target.tagName === "svg"){
            passwordVisible = !passwordVisible;
            if(passwordVisible){
                input.type = "text";
            } else {
                input.type = "password";
            }
        }
    }


    function inputHandle(){
        startValidation();
    }

</script> 

<div class="input_wrapper" class:not_valid on:click={clickHandle}>

    <div class="error_mark" class:invalid>
        <svg>
            <use href="/assets/icons/all.svg#ex_mark"></use>
        </svg>
    </div>

    <input {placeholder} {id} {name} {required} {pattern} {type} {value}
    class:not_valid
    class:invalid
    class:text
    minlength={5}
    on:blur={blurHandler}
    on:input={inputHandle}
    on:input
    bind:this={input}
    />

    {#if !passwordVisible}
        <svg viewBox="0 0 24 24" tabindex="0" role="button" aria-label="показать пароль">
            <path d="M21.25 9.14999C18.94 5.51999 15.56 3.42999 12 3.42999C10.22 3.42999 8.49 3.94999 6.91 4.91999C5.33 5.89999 3.91 7.32999 2.75 9.14999C1.75 10.72 1.75 13.27 2.75 14.84C5.06 18.48 8.44 20.56 12 20.56C13.78 20.56 15.51 20.04 17.09 19.07C18.67 18.09 20.09 16.66 21.25 14.84C22.25 13.28 22.25 10.72 21.25 9.14999ZM12 16.04C9.76 16.04 7.96 14.23 7.96 12C7.96 9.76999 9.76 7.95999 12 7.95999C14.24 7.95999 16.04 9.76999 16.04 12C16.04 14.23 14.24 16.04 12 16.04Z"/>
            <path d="M11.9999 9.14001C10.4299 9.14001 9.1499 10.42 9.1499 12C9.1499 13.57 10.4299 14.85 11.9999 14.85C13.5699 14.85 14.8599 13.57 14.8599 12C14.8599 10.43 13.5699 9.14001 11.9999 9.14001Z" />
        </svg>
    {:else}
        <svg viewBox="0 0 24 24" tabindex="0" role="button" aria-label="спрятать пароль">
            <path d="M21.2699 9.18005C20.9799 8.72005 20.6699 8.29005 20.3499 7.89005C19.9799 7.42005 19.2799 7.38005 18.8599 7.80005L15.8599 10.8001C16.0799 11.4601 16.1199 12.2201 15.9199 13.0101C15.5699 14.4201 14.4299 15.5601 13.0199 15.9101C12.2299 16.1101 11.4699 16.0701 10.8099 15.8501C10.8099 15.8501 9.37995 17.2801 8.34995 18.3101C7.84995 18.8101 8.00995 19.6901 8.67995 19.9501C9.74995 20.3601 10.8599 20.5701 11.9999 20.5701C13.7799 20.5701 15.5099 20.0501 17.0899 19.0801C18.6999 18.0801 20.1499 16.6101 21.3199 14.74C22.2699 13.2301 22.2199 10.6901 21.2699 9.18005Z"/>
            <path d="M14.0201 9.97989L9.98014 14.0199C9.47014 13.4999 9.14014 12.7799 9.14014 11.9999C9.14014 10.4299 10.4201 9.13989 12.0001 9.13989C12.7801 9.13989 13.5001 9.46989 14.0201 9.97989Z"/>
            <path d="M18.25 5.74993L14.86 9.13993C14.13 8.39993 13.12 7.95993 12 7.95993C9.76 7.95993 7.96 9.76993 7.96 11.9999C7.96 13.1199 8.41 14.1299 9.14 14.8599L5.76 18.2499H5.75C4.64 17.3499 3.62 16.1999 2.75 14.8399C1.75 13.2699 1.75 10.7199 2.75 9.14993C3.91 7.32993 5.33 5.89993 6.91 4.91993C8.49 3.95993 10.22 3.42993 12 3.42993C14.23 3.42993 16.39 4.24993 18.25 5.74993Z"/>
            <path d="M14.8601 12.0001C14.8601 13.5701 13.5801 14.8601 12.0001 14.8601C11.9401 14.8601 11.8901 14.8601 11.8301 14.8401L14.8401 11.8301C14.8601 11.8901 14.8601 11.9401 14.8601 12.0001Z"/>
            <path d="M21.7699 2.22988C21.4699 1.92988 20.9799 1.92988 20.6799 2.22988L2.22988 20.6899C1.92988 20.9899 1.92988 21.4799 2.22988 21.7799C2.37988 21.9199 2.56988 21.9999 2.76988 21.9999C2.96988 21.9999 3.15988 21.9199 3.30988 21.7699L21.7699 3.30988C22.0799 3.00988 22.0799 2.52988 21.7699 2.22988Z" />
        </svg>
    {/if}


</div>

<style>
    .input_wrapper{
        position: relative;
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
        flex: 1 0;
        transition: border 400ms ease, background 400ms ease;
    }

    input.text{
        background-color: var(--error-background);
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
        background-color: var(--background-focus);
        border: var(--border-width) solid var(--border-color-focus);
        outline: none;
    }

    input.not_valid,
    input.invalid{
        border: var(--border-width) solid var(--pumpkin);
    }


    svg{
        position: absolute;
        right: .75rem;
        top: 50%;
        transform: translateY(-50%);
        width: 1.5rem;
        height: 1.5rem;
        fill: var(--gray-blue);
        transition: fill 400ms ease-in-out;
    }

    svg:hover{
        fill: var(--faded-middle-blue);
    }

    svg:focus{
        outline: none;
        fill: var(--faded-middle-blue);
    }

    .error_mark{
        width: calc(18px * 1.125);
        height: 100%;
        border-radius: 30px 0 0 30px;
        background-color: var(--pumpkin);
        position: absolute;
        left: 1px;
        top: 0;
        display: none;
    }

    .error_mark svg{
        fill: var(--light-blue);
        width: 2px;
        max-height: 11px;
        position: relative;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }

    .error_mark.invalid{
        display: flex;
    }
</style>
