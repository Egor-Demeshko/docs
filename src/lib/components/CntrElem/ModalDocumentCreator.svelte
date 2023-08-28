<script>
    import Button from "$lib/components/CntrElem/Button.svelte";
    import FilePicker from "$lib/components/CntrElem/FilePicker.svelte";
    import Spinner from "$lib/components/Spinner.svelte"
    import {documents, showModalDocumentCreator} from "$lib/scripts/stores";
	import { get } from 'svelte/store';
    import { fade } from "svelte/transition";

    let unsubscribe;
    let showSpinner;


    async function createNewDocument(){
        let result;
        showSpinner = true;
        let docClass;

        docClass = get(documents);
        //console.log(docClass);
        result = await docClass.createNewDocument();
        
        showSpinner = false;
        showModalDocumentCreator.set(false);
    }


    function closeClick(e){
        if(e.target.tagName === "BUTTON" || e.target.tagName === "LABEL" || e.target.tagName === "INPUT") return;

        console.log("[ModalDocumentCreator]: CLICK", e.target);

        let docClass = get(documents);
        let length = docClass.docs.length;

        if(!length) return;

        showModalDocumentCreator.set(false);
    }


    function change(e){
        /* с атрибутом мультипарт несколько файлов можно выбрать
        выбранные файлу содежрадться в input.files.это свойство возращает
        filelist 
        array-like обьект, свойство length вернет количество выбранных файлов.
        внутри будет лежать обьект file*/
        /*так как мы файлы можем много откуда отправлять
        то точно отправка файла должна быть отдельным классом,
        возможно в папке http
        --скорее всего обернем в form и отправим на сервер*/

        /*
        СХЕМА. отсюда запускаем отправку форму, или вызываем для этого отдельный класс.
        ждем ответа, т.е. функция должна быть асинхронной. 
        крутим спиннер.
        обязательно сделать проверку. ответа сервера.
        скорее всего через fetch, c адресом энд поинта. и в теле FormData.
        нужна будет форма. доступ к ней можно получить и через событие.
        */
        console.log("[ModalDocumentCreator]: change ", e.target);
        e.target.files[0].text().then( (value) => console.log("[result of file transfer]: ", value));
        
    }

</script>


<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="modal" 
in:fade
out:fade={{duration: 400}} 
on:click={closeClick}>
    {#if showSpinner}
        <Spinner/>
    {/if}

    {#if !showSpinner}
    <div class="buttons">
        <Button fnToRunOnClick={createNewDocument}
        name={"Создать новый документ"}
        --bg="var(--middle-blue)"
        --color="var(--light-blue)"
        --border="2px solid var(--middle-blue)"
        --font-size=".875rem"
        --padding=".625rem"
        --bg-hover="var(--gray-blue)"
        --color-hover="var(--white-blue)"
        --border-hover="2px solid var(--gray-blue)"
        />
        <form id="doc_file_picker">
            <FilePicker 
            text={"Загрузить документ"}
            --bg="var(--middle-blue)"
            --color="var(--light-blue)"
            --border="2px solid var(--middle-blue)"
            --font-size=".875rem"
            --padding=".625rem"
            --bg-hover="var(--gray-blue)"
            --color-hover="var(--white-blue)"
            --border-hover="2px solid var(--gray-blue)"
            --display="block"
            on:change={change}/>
        </form>
    </div>
    {/if}
</div>

<style>
    .modal{
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 20px 0 0 0;
        background-color: #DDE6ED80;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 0;
        left: 0;
        z-index: 100;
    }

    .buttons{
        width: 25.6rem;
        display: flex;
        flex-direction: column;
        gap: .875rem;
    }

</style>