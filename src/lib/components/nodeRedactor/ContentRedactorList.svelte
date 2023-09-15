<script>
    import Toggle from "$lib/components/nodeRedactor/Toggle.svelte";
    import { storeForSimpleTexts } from "$lib/scripts/stores";
	import { getContext } from "svelte";
    
    let display = "description";
    export let placeholder = "Описание будет отбражаться в анкете";
    export let required = false;
    export let pattern = '.*';
    export let label ="Название блока";
    export let rows = 1;
    export let node_type;
    export let id = '';
    export let validity;
    export let data;

    /**@description обьект узла*/
    $: if(data){
        
        console.log("[CONTENT REDACTOR]", data);
    }

    let description = data.description;

    $: data.description = description;




    let valid = '';
    let invalid = '';
    let input;


    $: not_valid = (validity?.status === "invalid" && isCurrentField()) ? true : false; 
    /*$: console.log("[NODERedacto]: validity and disaply prop:  ", {
        validity,
        display
    });*/

    /**проверяем поля ошибок*/
    function isCurrentField(){
        let data = validity.err_data;

        for(let i=0; i < data.length; i++){
            if(data[i]?.field === display) return true;
        }

        return false;
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

    <div class="textarea__wrapper" class:not_valid>

        <div class="error_mark">
            <svg>
                <use href="/assets/icons/all.svg#ex_mark"></use>
            </svg>
        </div>

        <!-- У некоторых типов блока в поле ввода основного контента есть toggle. чтобы текст не перекрывался тоглом
        там где он есть сделан больший паддинг справа. это регулируется классом -->

            <textarea {placeholder} {id} name={display} {required} {pattern} autocomplete="off" {rows}
            bind:value={description}
            class={ (node_type === "checkbox" || node_type === "select") ? "normal_padding" : "big_padding" }
            on:focus={focusTextArea}
            on:blur={blurTextArea}
            ></textarea>

    </div>
</label>

<style>
    :root{
        --border-radius: 15px;
    }

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
        padding: .75rem 0 0 .625rem;
    }

    .error_mark svg{
        fill: var(--light-blue);
        width: 2px;
        max-height: 11px;
    }


    .not_valid .error_mark{
        display: flex;
    }
    /********/


    textarea{
        border: 2px solid var(--light-blue);
        background-color: var(--light-blue);
        border-radius: var(--border-radius);
        color: var(--deep-blue);
        resize: vertical;
        scrollbar-width: 8px;
        scrollbar-color: var(--middle-blue) transparent;
        width: 100%;
        height: 100%;
        transition: border 400ms ease-in-out, background 400ms ease-in-out;
        outline: none;
    }

    textarea::placeholder{
        font-style: italic;
        color: var(--faded-gray-blue);
    }

    textarea:hover{
        background-color: var(--light-gray-blue);
        border: 2px solid var(--light-gray-blue);
    }

    textarea:focus{
        border: 2px solid var(--orange);
        background-color: var(--light-blue);
    }

    .not_valid textarea{
        border: 2px solid var(--pumpkin);
        background-color: var(--light-blue);
    }


    textarea.big_padding{
        padding: .5rem 5.5rem .5rem 1.75rem;
    }


    textarea.normal_padding{
        padding: .5rem 1rem .5rem 1.75rem;
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