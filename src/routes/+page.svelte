<script>
    import InterectiveElements from "$lib/components/InterectiveElements.svelte";
    import DocWriter  from "$lib/components/DocWriter.svelte";

    //receiving data from load function
    export let data;

</script>

<main>
    <div class="element">
        <InterectiveElements />
    </div>

    <div class="devider"></div>

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

    .devider{
        width: 4px;
        height: 100%;
        background-color: black;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }
</style>