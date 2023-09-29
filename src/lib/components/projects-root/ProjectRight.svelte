<script>
    import DocName from "$lib/components/CntrElem/DocName.svelte";

    export let documentsToShow;
    $: console.log("documentsToShow", documentsToShow);

    let list_show = false;

    /*для анимации появления необходимо показать с задержкой
    затем возможно просто спиннер будем крутить пока список получаем*/
    function enablelist(){
        setTimeout( () => list_show = true, 200);
    }


</script>

<div class="list" class:list_show use:enablelist>
    {#if documentsToShow}
        {#if documentsToShow.length > 0}
            {#each documentsToShow as documentObj}
                <DocName {documentObj}/>
            {/each}
        {:else}
            <div class="list__empty">
                <svg width="144" height="144" viewBox="0 0 144 144" fill="none">
                    <path d="M79.8026 120.612C80.2743 120.721 80.3262 121.361 79.8745 121.535C78.7288 121.977 77.5241 122.399 76.2601 122.82L66.7801 125.94C42.9601 133.62 30.4201 127.2 22.6801 103.38L15.0001 79.68C7.32009 55.86 13.6801 43.26 37.5001 35.58L45.7241 32.8565C46.127 32.7231 46.505 33.1214 46.3578 33.5194C45.3824 36.1564 44.5377 39.1233 43.7401 42.42L37.8601 67.56C31.2601 95.82 40.9201 111.42 69.1801 118.14L79.8026 120.612Z"/>
                    <path d="M103.019 19.26L92.9991 16.92C72.9591 12.18 61.0191 16.08 53.9991 30.6C52.1991 34.26 50.7591 38.7001 49.5591 43.8L43.6791 68.94C37.7991 94.0201 45.5391 106.38 70.5591 112.32L80.6391 114.72C84.1191 115.56 87.3591 116.1 90.3591 116.34C109.079 118.14 119.039 109.38 124.079 87.72L129.959 62.64C135.839 37.56 128.159 25.14 103.019 19.26ZM91.7391 79.98C91.1991 82.0201 89.3991 83.3401 87.3591 83.3401C86.9991 83.3401 86.6391 83.2801 86.2191 83.22L68.7591 78.7801C66.3591 78.1801 64.9191 75.7201 65.5191 73.3201C66.1191 70.9201 68.5791 69.4801 70.9791 70.0801L88.4391 74.5201C90.8991 75.1201 92.3391 77.5801 91.7391 79.98ZM109.319 59.7C108.779 61.74 106.979 63.0601 104.939 63.0601C104.579 63.0601 104.219 63 103.799 62.94L74.6991 55.5601C72.2991 54.96 70.8591 52.5 71.4591 50.1001C72.0591 47.7001 74.5191 46.26 76.9191 46.86L106.019 54.24C108.479 54.78 109.919 57.24 109.319 59.7Z"/>
                </svg>
            </div>
        {/if}
    {/if}
</div>

<style>
    .list{
        width: 100%;
        height: 100%;
        display: none;
        flex-direction: column;
        gap: 1rem;
    }

    .list.list_show{
        display: flex;
    }

    .list__empty{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .list__empty>svg{
        fill: var(--light-blue);
    }
</style>