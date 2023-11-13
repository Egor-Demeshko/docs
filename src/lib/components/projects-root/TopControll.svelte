<script>
	import SearchInput from "$lib/components/CntrElem/SearchInput.svelte";

</script>

<div class="controll">
    <div class="controll__left">
        <span class="heading">Проекты</span>
    </div>

    <div class="controll__right">
        <SearchInput/>
    </div>  
</div>

<style>

    .controll{
        padding: 1.125rem 1.5rem;
        background-color: var(--middle-blue);
        border-radius: 20px 20px 0 0;
        position: relative;
        display: flex;
        justify-content: space-between;
        width: 100%;
    }

    .controll__left{
        display: flex;
        justify-content: start;
    }

    .controll__right{
        display: flex;
        justify-content: right;
    }

    .heading{
        font-size: 1.5rem;
        font-weight: 500;
        line-height: 1.5rem;
    }

</style>