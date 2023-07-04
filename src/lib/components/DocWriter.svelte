<script>
    //TODO получить разметку из load function

    /** @description разметка документа */
    export let html = '';

    /** @description корневой элемент документа*/
    let root;



</script>

<section bind:this={root}>
    <div class="document">

    </div>
</section>

<style>
    section{
        padding:2rem 2rem;
        height: 100%;
    }

    .document{
        background-color: var(--white);
        box-shadow: 0 0 4px var(--black);
        height: 100%;
        border-radius: 10px;
    }
</style>