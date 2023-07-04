<script>
    import Button from "$lib/components/CntrElem/Button.svelte";
    import VarField from "$lib/components/CntrElem/VarField.svelte";
    //TODO ADD FUNCTION TO BUTTON, labelname, name

    export let graph;

</script>


<section class="root">

    <div class="element">
        <Button name={"Создать переменную"} labelName={"Создайте переменную"}/>
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
    }

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