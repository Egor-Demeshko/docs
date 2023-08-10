<script>
    export let id = "login";
    export let type = "text";
    export let placeholder = "Логин";
    export let required = false;
    export let pattern = '.*';
    export let value = '';
    export let name = '';
    import syncDataInNodesStores from "$lib/scripts/controllers/syncDataInNodesStores.js";

   /* let valid = '';
    let invalid = '';*/
    let input;

/*
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
    }*/
</script>    

{#if type === 'text'}
    <input {placeholder} {id} {name} {required} {pattern} type="text" bind:value={value}
    bind:this={input}
    />
{:else if type === "number"}
    <input {placeholder} {id} {name} {required} {pattern} type="tel" bind:value={value}
    bind:this={input}
    />
{/if}

<style>
    input{
        border: var(--border-width) solid var(--border-color);
        padding: var(--padding);
        border-radius: 30px;
        font-size: var(--font-size);
        width: 100%;
        color: var(--color);
        background-color: var(--background);
        flex: 1 0;
        outline: none;
        transition: border 400ms ease, background 400ms ease;
    }


    input::placeholder{
        color: var(--faded-gray-blue);
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





</style>
