<script>
    import SimpleInput from "$lib/components/CntrElem/SimpleInput.svelte";
    import FilePicker from "$lib/components/CntrElem/FilePicker.svelte";
    import Spinner from "$lib/components/Spinner.svelte";
    import ModalSingleButton from "$lib/components/ModalSingleButton.svelte";
    import Mark from "$lib/components/small/Mark.svelte";
    import { enhance } from '$app/forms';
    import { onDestroy } from "svelte";

    let telephone_input = "";
    let mail_input = "";
    let loading = false;
    let buttonName = "Отправить";
    let outro = false;
    let selected = false;

    $: button_disabled = (telephone_input || mail_input) ? false : true;


    function enhanceProcess(){
        loading = true;
        return async ({result}) => {
            
            loading = false;
            outro = true;


        }
    }

    /**обработка выбора файла*/
    function fileSelected(e){
        const target = e.target;

        if(target.files.length > 0){
            selected = true;
        } else {
            selected = false;
        }
    }

</script>

{#if !outro}
<form method="POST" use:enhance={enhanceProcess} enctype="multipart/form-data">

        {#if loading}
            <div class="spinner_wrapper">
                <Spinner/>
            </div>
        {/if}

        <h1>Что-то не так? Напишите нам</h1>
        <div class="sector">
            <div class="input">
                <label>
                    <span class="input_name">
                        Телефон
                    </span>
                    <div style="flex: 1">
                        <SimpleInput placeholder={"Введите ваш номер телефона"}
                        autocomplete={"on"}
                        name={"phone"}
                        type={"tel"}
                        --border-width="2px"
                        --border-color="var(--middle-blue)"
                        --padding=".625rem 1.25rem"
                        --background="var(--white-blue)"
                        --placeholder="var(--gray-blue)"
                        --background-hover="var(--light-blue)"
                        --border-color-hover="var(--middle-blue)"
                        --color="var(--deep-blue)"
                        on:input={ (e) => telephone_input = e.data }
                        />
                    </div>
                </label>
            </div>

            <div class="input">
                <label>
                    <span class="input_name">
                        Эл. почта
                    </span>
                    <div style="flex: 1">
                        <SimpleInput placeholder={"Введите ваш номер телефона"}
                        autocomplete={"on"}
                        name={"email"}
                        type={"email"}
                        --border-width="2px"
                        --border-color="var(--middle-blue)"
                        --padding=".625rem 1.25rem"
                        --background="var(--white-blue)"
                        --placeholder="var(--gray-blue)"
                        --background-hover="var(--light-blue)"
                        --border-color-hover="var(--middle-blue)"
                        --color="var(--deep-blue)"
                        on:input={ (e) => mail_input = e.data }
                        />
                    </div>
                </label>
            </div>
        </div>

        <div class="sector">
            <textarea rows="9"
            placeholder="Подробно опишите Вашу проблему" name="request"></textarea>
            <div class="file">
                <FilePicker
                text={"Прикрепить файл"}
                name={"file"}
                accept={"*"}
                --padding=".25rem 1rem"
                --bg="var(--light-blue)"
                --color="var(--middle-blue)"
                --bg-hover="var(--light-gray-blue)"
                --border="2px solid var(--light-blue)"
                --font-size="1.125rem"
                --color-hover="var(--middle-blue)"
                --border-hover="2px solid var(--light-gray-blue)"
                on:change={fileSelected}
                />
                {#if selected}
                    <Mark 
                        --position="absolute"
                    />
                {/if}
            </div>
        </div>

        <div class="contact_buttons">
            <button class="send" disabled={button_disabled}>{buttonName}</button>
            <a class="telegram" href="https://t.me/egor_demeshko" target="_blank" 
            rel="external" aria-label="Перейти в Telegram">Связаться с нами в Telegram</a>
        </div>
    </form>
{:else}
    <div class="outro">
        <ModalSingleButton on:click={() => window.history.back()}
            heading={"Сообщение отправлено!"}
            text={"Благодарим Вас за обратную связь. Мы свяжемся с Вами в ближайшее время."}/>
    </div>
{/if}

<style>
    form,
    .outro{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 3rem 2.5rem;
        background-color: var(--white-blue);
        border-radius: 20px;
        text-align: center;
        justify-content: stretch;
        min-width: 50rem;
    }

    .outro{
        min-width: 500px;
    }

    label{
        display: flex;
        align-items: center;
    }

    .input_name{
        flex-basis: 6.125rem;
        color: var(--middle-blue);
        font-style: italic;
    }

    .input{
        width: 100%;
        flex: 1;
    }   

    .input:nth-child(n){
        margin-top: 1rem;
    }

    .sector{
        margin-top: 1.25rem;
        position: relative;
    }

    textarea{
        border: 2px solid var(--middle-blue);
        border-radius: 20px;
        width: 100%;
        padding: 1rem 1.25rem;
        resize: vertical;
        transition: border 400ms ease, background 400ms ease;
        background-color: var(--white-blue);
        color: var(--deep-blue);
    }

    textarea::placeholder{
        color: var(--gray-blue);
        font-style: italic;
    }

    textarea:hover{
        background-color: var(--light-blue);
    }

    textarea:focus{
        outline: none;
        border: 2px solid var(--orange);
        background-color: var(--white-blue);
    }

    h1{
        font-size: 1.5rem;
        color: var(--middle-blue);
        font-weight: 500;
        margin: 0;
    }


    .contact_buttons{
        display: flex;
        gap: 1rem;
        flex-direction: column;
        margin-top: 1rem;
    }


    .send,
    .telegram{
        appearance: none;
        border-radius: 20px;
        transition: background 400ms ease, border 400ms ease, outline 400ms ease;
        border: none;
        padding: .625rem;
        cursor: pointer;
        outline: 2px solid transparent;
    }

    .send:focus,
    .telegram:focus{
        outline: 2px solid var(--orange);
    }


    .send{
        background-color: var(--middle-blue);
        color: var(--white-blue);
    }

    .send:hover{
        background-color: var(--gray-blue);
    }

    .send:disabled{
        background-color: var(--light-gray-blue);
        color: var(--light-blue);
        cursor: auto;
    }

    .telegram{
        background-color: var(--light-blue);
        color: var(--middle-blue);
        text-decoration: none;
    }

    .telegram:hover{
        background-color: var(--light-gray-blue);
    }


    /**стили кнопки добавить файл*/
    .file{
        position: absolute;
        bottom: 1.25rem;
        left: 1rem;
    }


    :global(textarea:hover~.file label){
        background-color: var(--white-blue); 
    }

    :global(textarea:focus~.file label){
        background-color: var(--light-gray-blue);
        border: 2px solid var(--light-gray-blue);
    }



    .spinner_wrapper{
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--spinner-back);
        z-index: 100;
        border-radius: 20px;
    }

</style>