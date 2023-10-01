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
    export let autocomplete = "on";
    export let validity;
    export let text = '';
    export let invalid = '';


    let valid = '';
    let input;
    const dispatcher = createEventDispatcher();

    $: not_valid = (validity?.status === "invalid" && isCurrentField()) ? true : false; 

    function isCurrentField(){
        let data = validity.err_data;
        console.log("[input]: data: ", data);
        console.log("[input]: name: ", name);
        for(let i=0; i < data.length; i++){
            if(data[i]?.field === name) return true;
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
        dispatcher("valid", {id, validity: true});
        showTooltip.set({show: false});
        text="";
        invalid = false;
    }


    function setInvalid(){
        dispatcher("invalid", {id, validity: false});

        if (id === "reg_name"){
            text = "Латинские или кирилические буквы, цифры, не менее четырех";
        } else if (id !== "reg_mail"){
            text = "Латинские буквы, цифры и спецсимволы, не менее четырех";
        } else {
            text = "Почта должна быть вида example@mail.ex";
        }
        
        invalid = true;
    }


    function blurHandler(){
        startValidation();
    }


    function inputEvent(){
        startValidation();
    }
</script> 

<div class="input_wrapper" class:not_valid>

    <div class="error_mark" class:invalid>
        <svg>
            <use href="/assets/icons/all.svg#ex_mark"></use>
        </svg>
    </div>

    <input {placeholder} id={id} {name} {required} {pattern} {type} {value} {autocomplete}
    class:not_valid
    class:invalid
    minlength={4} maxlength={30}
    class:text
    on:blur={blurHandler}
    on:focus
    on:mouseenter
    on:mouseleave
    on:input={inputEvent}
    on:input
    bind:this={input}
    />
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

    input.text{
        background-color: var(--error-background);
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
