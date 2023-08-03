<script>
    export let display = "content";
    export let placeholder = "Описание будет отбражаться в анкете";
    export let required = false;
    export let pattern = '.*';
    export let label ="Название блока";
    export let rows = 1;
    export let node_type;
    export let value = '';
    export let id = '';
    export let data_type = '';

    import Toggle from "$lib/components/nodeRedactor/Toggle.svelte";
    import { storeForSimpleTexts } from "$lib/scripts/stores";

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


    function focusTextArea(){        
        let elements = $storeForSimpleTexts;

        for(let i = 0; i < elements.length; i++){
            if(elements[i]["id"] !== id) continue;
            elements[i].setActive(id);

            break;
        }

        elements = null;
    }

    
    function blurTextArea(){
        
        let elements = $storeForSimpleTexts;
        for(let i = 0; i < elements.length; i++){
            if(elements[i]["id"] !== id) continue;
            elements[i].setInactive(id);

            break;
        }

        elements = null;
    }
</script>

<label class={ (node_type === "checkbox" || node_type === "select") ? "height_100" : "" }>
    <span>{label}</span>

    <div class="textarea__wrapper">

        <!-- У некоторых типов блока в поле ввода основного контента есть toggle. чтобы текст не перекрывался тоглом
        там где он есть сделан больший паддинг справа. это регулируется классом -->
        <textarea {placeholder} {id} name={display} {required} {pattern} autocomplete="off" {rows}
        bind:value={value}
        class={ (node_type === "checkbox" || node_type === "select") ? "normal_padding" : "big_padding" }
        on:input={inputHandle}
        on:focus={focusTextArea}
        on:blur={blurTextArea}></textarea>

        <!-- Некоторые текстовые поля имеют переключатели -->
        {#if display === "content"}
            <div class="toggle__position">
                <Toggle bind:data_type={data_type}/>
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