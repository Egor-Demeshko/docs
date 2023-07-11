<script>
    import { storeForSimpleTexts } from "$lib/scripts/stores.js";
    import elementsDataUpdate from "$lib/scripts/controllers/elementsDataUpdate";
    /**ELEMENT TO SHOW VARIBLES PRESENTATION*/
    export let name;
    export let content;
    export let id = 1;
    let active;


    /**@description функция валидирует кнопки и отправляет значения в документ*/
    function inputHandler(e){
        //в input что ввели можно считать в свойстве {data
        //после этого изменением значение в сторе
        /*textElementsData.set([ ...$textElementsData, {
                                        id: id,
                                        content: e.data,
                                        name: name
                                    }]);*/

        elementsDataUpdate({ id, name, content: e.target.value });                                                                 
    }

    /** @description show active styles on input, and on document elements*/
    function focusinHandler(){
        active = "active";

        $storeForSimpleTexts.forEach( (elObj) => {
            elObj.setActive(id);
        });
    }

    /** @description stop showing active elements on this element */
    function focusoutHandler(){
        active = "";

        $storeForSimpleTexts.forEach( (elObj) => {
            elObj.setInactive(id);
        });
    }
</script>


<label>
    <input name={name} value={content} placeholder="Укажите значение" 
    on:input={inputHandler}
    on:focusin={focusinHandler}
    on:focusout={focusoutHandler}
    class={active}/>
    <span>{name}</span>
</label>


<style>
    label{
        display: block;
        padding: 1rem;
        position: relative;
        inline-size: 100%;
        border-bottom: 2px solid grey;
    }

    span{
        position: absolute;
        left: 1.5rem;
        top: 0;
        transform: translateY(-50%);
        font-size: 0.8rem;
        font-weight: bold;
        color: grey;
    }

    input{
        padding: .5rem 1rem;
        border: none;
        border-radius: 10px;
        font-size: 1.5rem;
        inline-size: 100%;
        transition: background 400ms ease;
    }

    .active{
        outline: 2px solid var(--active-node-bg);
        background-color: var(--active-node-bg);
    }
</style>