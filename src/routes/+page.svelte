<script>
    import InterectiveElements from "$lib/components/InterectiveElements.svelte";
    import DocWriter  from "$lib/components/DocWriter.svelte";

</script>

<main>
    <div class="element">
        <InterectiveElements />
    </div>

    <div class="element">
        <DocWriter />
    </div>
</main>

<style>
    main{
        display: flex;
        background-color: var(--main-bg);
        position: absolute;
        top: 0;
        left: 0;
        overflow-y: scroll;
        height: 100vh;
        width: 100vw;
    }

    .element{
        flex: 1;
    }
</style>