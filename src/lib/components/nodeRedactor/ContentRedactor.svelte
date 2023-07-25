<script>
    export let id = "id";
    export let placeholder = "Описание будет отбражаться в анкете";
    export let required = false;
    export let pattern = '.*';
    export let type = "text";
    export let label ="Название блока";
    export let rows = 1;
    export let node_type;

    import Toggle from "$lib/components/nodeRedactor/Toggle.svelte";

    let valid = '';
    let invalid = '';
    let input;


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
</script>

<label class={ (node_type === "checkbox" || node_type === "radiobutton") ? "height_100" : "" }>
    <span>{label}</span>
    <div class="textarea__wrapper">
        <textarea {placeholder} {id} name={id} {type} {required} {pattern} autocomplete="off" {rows}></textarea>
        {#if id === "content"}
            <div class="toggle__position">
                <Toggle />
            </div>
        {/if}
    </div>
</label>

<style>
    label{
        display: flex;
        flex-flow: column;
        align-items: start;
        gap: 0.25rem;
        font-weight: 400;
        width: 100%;
    }


    label.height_100{
        height: 100%;
    }

    span{
        font-size: 0.875rem;
    }


    .textarea__wrapper{
        width: 100%;
        height: 100%;
        position: relative;
    }

    textarea{
        border: none;
        background-color: var(--light-blue);
        border-radius: 15px;
        color: var(--deep-blue);
        padding: .5rem 5.5rem .5rem 1rem;
        resize: vertical;
        scrollbar-width: 8px;
        scrollbar-color: var(--middle-blue) transparent;
        width: 100%;
        height: 100%;
    }

    .toggle__position{
        position: absolute;
        top: .5rem;
        right: 1rem;
        float: right;
        width: 4.5rem;
    }

    textarea::-webkit-scrollbar{
       width: .5rem;
    }

    textarea::-webkit-scrollbar-track{
        display: none;
    }


    textarea::-webkit-scrollbar-thumb {
        background-color: var(--gray-blue); 
        border-radius: 10px;
        transition: background 400ms ease;
        cursor: pointer;

    }

    textarea::-webkit-scrollbar-thumb:hover{
        background-color: var(--middle-blue);
    }

    textarea::placeholder{
        color: var(--faded-gray-blue);
    }
</style>