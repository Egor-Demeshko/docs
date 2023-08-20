<script>
    import DocName from "$lib/components/CntrElem/DocName.svelte";

    let list_show = false;

    /*для анимации появления необходимо показать с задержкой
    затем возможно просто спиннер будем крутить пока список получаем*/
    function enablelist(){
        setTimeout( () => list_show = true, 200);
    }


</script>

<div class="list" class:list_show use:enablelist>
    <DocName/>
    <DocName/>
    <DocName/>
</div>


<style>
    .list{
        width: 100%;
        display: none;
        flex-direction: column;
        gap: 1rem;
    }

    .list.list_show{
        display: flex;
    }
</style>