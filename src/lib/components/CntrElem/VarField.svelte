<script>
    import { blockVars } from "$lib/scripts/stores.js";
    /**ELEMENT TO SHOW VARIBLES PRESENTATION*/
    export let name;
    export let content;
    export let id = 1;


    /**@description функция валидирует кнопки и отправляет значения в документ*/
    function inputHandler(e){
        //в input что ввели можно считать в свойстве {data
        //после этого изменением значение в сторе
        blockVars.set({ ...$blockVars, id: e.data });
    }
    
</script>


<label>
    <input name={name} value="{content}" placeholder="Укажите значение" on:input={inputHandler}/>
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
    }
</style>