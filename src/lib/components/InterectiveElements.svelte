<script>
    import Button from "$lib/components/CntrElem/Button.svelte";
    import VarField from "$lib/components/CntrElem/VarField.svelte";
    import { fade } from "svelte/transition"; 
    import { docRoot } from "$lib/scripts/stores";
    //TODO ADD FUNCTION TO BUTTON, labelname, name

    export let graph;
    let interectiveRoot;
    let active = false;


    function fnToRunOnClick(){
        //при клике мы на документ вышаем один слушатель на элемент 
        //при этом ссылка тогда будет храниться в store
        //работать с selection event changed
        active = true;
        $docRoot.addEventListener("selectionchange", (e) => console.log("selectstart", e));
        
    }


    function cancelCreation(){
        active = false;
    }

    $: active;

</script>


<section class="root">

    {#if active}
        <div class="overlap" in:fade={{duration: 600}}
        out:fade={{duration: 600}}>
            <p>для создания переменной выберете место в тексте</p>
            <Button name={"ОТМЕНА"} labelName={"Отменить создание переменной"}
            fnToRunOnClick={cancelCreation}/>
        </div>
    {/if}

    <div class="element">
        <Button name={"Создать переменную"} labelName={"Создайте переменную"} {fnToRunOnClick}/>
    </div>
    
    <form>
        <ul class="variables_list">
            {#each graph as {name, content, id} }
                <li>
                    <VarField {name} {content} {id}/>
                </li>
            {/each}
        </ul>
    </form>

</section>


<style>
    .root{
        display: flex;
        flex-flow: column;
        justify-content: flex-start;
        align-items: center;
        height: 100%;
        overflow: scroll;
        min-width: 600px;
        border-right: 2px solid var(--black);
        position: relative;
    }


    .overlap{
        display: flex;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 10;
        background-color: #1C191990;
        height: 100vh;
        width: 50%;
        min-width: 600px;
        flex-flow: column;
        align-items: center;
        justify-content: center;
        gap: 3rem;
    }


    .overlap p {
        color: var(--white);
        font-size: 1.125rem;
        font-weight: 800;

    }

/*
    .overlap.active{
        display: flex;
    }

*/
    .element{
        margin: 1rem auto;
    }

    .variables_list{
        display: flex;
        flex-flow: column;
        gap: 2rem;
        margin: 0;
        padding: 0;
        list-style: none;
    }

    form{
        inline-size: 100%;
        padding: 0 1rem;
        margin-top: 2rem;
        height: 100%;
    }
</style>