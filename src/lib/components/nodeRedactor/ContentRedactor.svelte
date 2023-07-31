<script>
    export let id = "id";
    export let placeholder = "Описание будет отбражаться в анкете";
    export let required = false;
    export let pattern = '.*';
    export let type = "text";
    export let label ="Название блока";
    export let rows = 1;
    export let node_type;
    export let value = '';

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


    function inputHandle(e){
        
    }
</script>

<label class={ (node_type === "checkbox" || node_type === "radiobutton") ? "height_100" : "" }>
    <span>{label}</span>

    <div class="textarea__wrapper">

        <!-- У некоторых типов блока в поле ввода основного контента есть toggle. чтобы текст не перекрывался тоглом
        там где он есть сделан больший паддинг справа. это регулируется классом -->
        <textarea {placeholder} {id} name={id} {type} {required} {pattern} autocomplete="off" {rows}
        {value}
        class={ (node_type === "checkbox" || node_type === "radiobutton") ? "normal_padding" : "big_padding" }
        on:input={inputHandle}></textarea>

        <!-- Некоторые текстовые поля имеют переключатели -->
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
        resize: vertical;
        scrollbar-width: 8px;
        scrollbar-color: var(--middle-blue) transparent;
        width: 100%;
        height: 100%;
    }


    textarea.big_padding{
        padding: .5rem 5.5rem .5rem 1rem;
    }


    textarea.normal_padding{
        padding: .5rem 1rem;
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