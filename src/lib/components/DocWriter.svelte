<script>
    import { page } from '$app/stores';
	import { getContext, onMount, tick } from "svelte";
    import { documents } from "$lib/scripts/stores";
    import createOnDocumentRedactorEvents from "$lib/scripts/docElements/GlobalRedactorEvents";
    import Modal from "$lib/components/Modal.svelte";
	import TroumboneRedactor from "./TroumboneRedactor.svelte";
    import Button2 from "$lib/components/CntrElem/Button2.svelte";
	import Download, { downloadState } from "./Download.svelte";
    import ModalWithInput from "$lib/components/ModalWithInput.svelte";


    const docCntl = getContext("templateController");
    const docStore = $documents;
    const route = $page.route.id;
    /**@description прошлое имя документа. для сравнения с текущим*/
    let previousName = '';

    /**@description input модалки*/
    let input;
    /**@description текст ошибки*/
    let spanText = '';

    
    /** @description разметка документа */
    /*export let html = '';
*/

    /** @description корневой элемент документа*/
    let root;
    let active = false;
    let invalid = false;
    let disabled = true;
    let wrapper_invalid = false;
    $: if(!active){
        disabled = false;
        wrapper_invalid = false;
        invalid = false;
    }


    onMount( async () => {
        createOnDocumentRedactorEvents(root);
    });


    async function download(){
        const name = docStore.getActiveDocumentName();
        const html = docStore.gainActiveHtml();
        
        try{
            let url = await docCntl.createDocFromHtml(name, html);
            downloadState.set({url, name}); 

        } catch (e){
            console.log('[DOCWRITER]: error: ', e.message);
            //TODO показать сообзение об ошибке загрузки файла
        }

    }


    async function save(){
        const name = input.value;
        const html = docStore.gainActiveHtml();
        const project_id = docStore.projectId;
        invalid = false;


        try {
            const result = await docCntl.saveDocument(project_id, name, html);
            
            if(result.success){
                previousName = '';
                active = false;
                document.dispatchEvent( new CustomEvent("error", {detail: {
                    err_data: [
                        {
                            blockId: 0,
                            message: "Документ успешно сохранен!",
                            err_id: 1000,
                            err_type: "simple"
                        }
                    ]
                }}));
            } else if (!result.success){
                const {details} = result;
                
                for(let i = 0; i < details.length; i++){
                    const errorObj = details[i];
                    const {message} = errorObj;
                    if(message === "Document name already exist"){
                    document.dispatchEvent( new CustomEvent("error", {detail: {
                        err_data: [
                            {
                                blockId: 0,
                                message: "Документ с таким именем уже существует!",
                                err_id: 1000,
                                err_type: "emergency"
                            }
                        ]
                    }}));
                    invalid = true;
                    //await tick();
                    previousName = input.value;
                    disabled = true;
                    spanText = "Документ с таким именем уже существует!";
                } else {
                    document.dispatchEvent( new CustomEvent("error", {detail: {
                        err_data: [
                            {
                                blockId: 0,
                                message: "Ошибка запроса сохранения документа! Попробуйте еще раз",
                                err_id: 1001,
                                err_type: "emergency"
                            }
                        ]
                    }}))
                    wrapper_invalid = true;
                    spanText = "Ошибка запроса сохранения документа! Попробуйте еще раз";
                }
                }
                
            }
        } catch (e){
            
            previousName = "";
            wrapper_invalid = true;
            document.dispatchEvent( new CustomEvent("error", {detail: {
                    err_data: [
                        {
                            blockId: 0,
                            message: "Сохранить документ не удалось. Попробуйте еще раз!",
                            err_id: 1000,
                            err_type: "emergency"
                        }
                    ]
                }}));
        }
    }
    
    
    function modalInput(e){
        wrapper_invalid = false;
        const target = e.target;
        if(target.value.length > 0 && previousName !== target.value){
            disabled = false;
            invalid = false;
        } else if (previousName === target.value){
            invalid = true;
            disabled = true;
        } else {
            disabled = true;
        }
    }


    function keyPress(event) {
        if (event.key === 'Enter' && !disabled) {
            save();
        } else if (event.key === 'Escape') {
            disabled = true;
            previousName = "";
            active = false;
        }
    }

</script>


<svelte:head>

</svelte:head>


<section bind:this={root} >
    <TroumboneRedactor />

    <Modal />

    {#if route.includes("anketa") }
    <div class="doc__buttons">
        <Button2 name={"Сохранить"}
        --bg="transparent"
        --color="var(--white-blue)"
        --border="2px solid var(--white-blue)"
        --font-size=".875rem"
        --padding=".25rem 1rem"
        --bg-hover="var(--gray-blue)"
        --color-hover="var(--white-blue)"
        --border-hover="2px solid var(--white-blue)"
        --focus-border="2px solid var(--orange)"
        --focus-outline="none"
        on:click={ () => active = true }
        />
        <Button2 name={"Скачать"}
        --bg="transparent"
        --color="var(--white-blue)"
        --border="2px solid var(--white-blue)"
        --font-size=".875rem"
        --padding=".25rem 1rem"
        --bg-hover="var(--gray-blue)"
        --color-hover="var(--white-blue)"
        --border-hover="2px solid var(--white-blue)"
        --focus-border="2px solid var(--orange)"
        --focus-outline="none"
        on:click={download}/>
    </div>
    {/if}

</section>


<Download document={docStore}/>

{#if route.includes("anketa") }
    <ModalWithInput
        
        bind:active={active}
        bind:wrapper_invalid={wrapper_invalid}
        text={"Введите уникальное имя для сохранения на сервере"}
        >
        
        <div slot="inner" class="modal_controls" on:keydown={ keyPress }>
            <div class="modal_row">
                {#if invalid}
                    <div class="modal_error">
                        <svg>
                            <use href="/assets/icons/all.svg#ex_mark"></use>
                        </svg>
                    </div>
                {/if}
                <input type="text" class="modal_input" required 
                class:invalid placeholder={"Введите имя документа"}
                bind:this={input}
                on:input={ modalInput }
                on:invalid={ () => invalid = true}/>
                <span class="modal_message" 
                class:invalid
                class:wrapper_invalid>{spanText}</span>
            </div>
            <div class="modal_row">
                <button on:click={save} class="modal_button" {disabled}>Сохранить</button>
                <button on:click={ () => {active = false; wrapper_invalid = false} } 
                    class="modal_button_with_ouline">Отмена</button>
            </div>
        </div>
        
</ModalWithInput>
{/if}


<style>
    section{
        height: 100%;
        width: 100%;
        position: relative;
        border-radius: 20px 0 0 0;
    }

    .doc__buttons{
        position: absolute;
        top: .6rem;
        right: 3.7rem;
        display: flex;
        gap: 1rem;
        z-index: 100;
    }

    /** МОДАЛКА */
    .modal_error{
        width: calc(15px * 1.125);
        height: 100%;
        border-radius: 15px 0 0 15px;
        background-color: var(--pumpkin);
        position: absolute;
        left: 1px;
        top: 0;
    }

    .modal_error svg{
        fill: var(--light-blue);
        width: 2px;
        max-height: 11px;
        position: relative;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }

    .modal_controls{
        display: flex;
        flex-direction: column;
        gap: 1.7rem;
    }

    .modal_row{
        display: flex;
        gap: 1rem;
        position: relative;
    }

    input.modal_input{
        border: 2px solid var(--light-blue);
        background: var(--light-blue);
        border-radius: 15px;
        padding: .5rem 1rem .5rem 1.5rem;
        width: 100%;
        color: var(--deep-blue);
        transition: border 400ms ease, background 400ms ease;
        outline: none;
        line-height: normal;
        font-size: .875rem;
    }

    .modal_button_with_ouline,
    .modal_button{  
        padding: .5rem 1rem;
        border-radius: 15px;
        width: 100%;
        cursor: pointer;
        transition: background 400ms ease, border 400ms ease;
        outline: none;
    }   

    .modal_button{
        border: 2px solid var(--middle-blue);
        background-color: var(--middle-blue);
        font-size: .875rem;
    }

    .modal_button_with_ouline{
        border: 2px solid var(--middle-blue);
        color: var(--middle-blue);
        background-color: transparent;
    }

    .modal_button:disabled{
        background-color: var(--light-gray-blue);
        color: var(--light-blue);
        border: 2px solid var(--light-gray-blue);
        cursor: auto;
        pointer-events: none;
    }

    input.modal_input::placeholder{
        color: var(--faded-gray-blue);
    }

    .modal_button_with_ouline:hover{
        background-color: var(--light-gray-blue);
    }

    input.modal_input:focus,
    .modal_button_with_ouline:focus{
        border: 2px solid var(--deep-blue);
        background-color: transparent;
    }

    input.modal_input:focus-visible,
    .modal_button_with_ouline:focus-visible{
        border: 2px solid var(--orange);
    }

    input.modal_input.invalid{
        border: 2px solid var(--pumpkin);
    }

    input.modal_input:hover{
        border: 2px solid var(--light-gray-blue);
        background-color: var(--light-gray-blue);
    }

    input.modal_input:hover:focus{
        border: 2px solid var(--orange);
        background-color: var(--light-gray-blue);
    }

    .modal_message{
        display: none;
        position: absolute;
    }

    .modal_message.invalid,
    .modal_message.wrapper_invalid{
        display: inline;
        color: var(--pumpkin);
        bottom: 0;
        transform: translateY(150%);
    }

    

    /* не удалять этот класс. на него валидируемся при событии*/
    :global(.doc_elements){
        position: relative;
        display: inline-block;
        background-color: var(--doc-element-bg);
        transition: background 400ms ease, transform 400ms ease;
        padding: 2px 3px;
        border-radius: 4px;
        cursor: default;
    }

    :global(.doc_elements:focus){
        outline: none;
    }


    :global(.doc_elements:hover){
        background-color: var(--pale-orange);
    }

    :global(.documents_hoverlike){
        background-color: var(--pale-orange);
    }

    :global(.doc_elements.not_valid){
        background-color: var(--peach);
    }

    :global(.doc_elements.not_valid:hover){
        background-color: var(--pale-orange);
    }

    :global(.documents_hoverlike.not_valid){
        background-color: var(--pale-orange);
    }


    :global(.no_display){
        display: none;
    }

    :global(.doc_active){
        background-color: var(--orange);
        transform: scale(107%) translate(0);
        z-index: 1;
        box-shadow: 0 0 2px var(--middle-blue);
    }

    @media print{
        :global(.doc_elements){
            background-color: none;
        }

        :global(.doc_active){
            transform: none;
            box-shadow: none;
            background-color: none; 
        } 
    }
</style>