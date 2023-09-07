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


    let valid = '';
    let invalid = '';
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

        invalid = false;
        valid = true; 
    }


    function setInvalid(){
        dispatcher("valid", {id, validity: false});
        const coors = input.getBoundingClientRect();
        if(id !== "reg_mail"){
            showTooltip.set({show: true, coors: {x: coors.x + input.offsetWidth/2, y: coors.y}, text: "Минимум 4 символа. Латинские буквы, цифры, _", place: "above"});
        } else if (id === "reg_name"){
            showTooltip.set({show: true, coors: {x: coors.x + input.offsetWidth/2, y: coors.y}, text: "Минимум 4 символа. Можно кирилицу, латиницу. Буквы, цифры, _", place: "above"});
        } else {
            showTooltip.set({
                show: true, 
                coors: {x: coors.x + input.offsetWidth/2, y: coors.y + 20},
                 text: "Почта должна быть вида example@mail.ex", place: "under"});
        }

        valid = false;
        invalid = true;
    }


    function blurHandler(){
        showTooltip.set({show: false});
        startValidation();
    }
</script> 

<div class="input_wrapper" class:not_valid>

    <input {placeholder} id={id} {name} {required} {pattern} {type} {value} {autocomplete}
    class:not_valid
    class:invalid
    minlength={4} maxlength={30}
    on:blur={blurHandler}
    on:focus
    on:mouseenter
    on:mouseleave
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

    input.not_valid,
    .invalid{
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
