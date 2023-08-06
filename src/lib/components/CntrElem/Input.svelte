<script>
    export let id = "login";
    export let type = "text";
    export let placeholder = "Логин";
    export let required = false;
    export let pattern = '.*';
    export let value = '';
    export let name = '';
    export let validity;
    import syncDataInNodesStores from "$lib/scripts/controllers/syncDataInNodesStores.js";

    let valid = '';
    let invalid = '';
    let input;

    $: not_valid = (validity?.status === "invalid" && isCurrentField()) ? true : false; 

    function isCurrentField(){
        let data = validity.err_data;

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
        syncDataInNodesStores(id, name, e.target.value);
    }
</script> 

<div class="input_wrapper" class:not_valid>
    <div class="error_mark">
        <svg>
            <use href="/assets/icons/all.svg#ex_mark"></use>
        </svg>
    </div>

    <input {placeholder} {id} {name} {required} {pattern} {type} {value}
    class:not_valid
    on:blur={blurHandler}
    on:change={changeHandle}
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
        transition: border 400ms ease;
    }

    input.not_valid{
        border: 1px solid var(--pumpkin);
    }


    input::placeholder{
        color: var(--faded-gray-blue);
        font-style: italic;
    }

        /**отрисовка восклицательного знака*/
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
