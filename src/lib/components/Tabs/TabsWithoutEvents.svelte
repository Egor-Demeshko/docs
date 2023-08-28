<script>
    import TabWithoutEvents from "$lib/components/Tabs/TabWithoutEvents.svelte";
    import { tabsQuantity } from "$lib/scripts/stores"; 
    export let tabsPosition = '';
    export let documents;
    //$:console.log("[TABS]: ddocuments", documents);

   tabsQuantity.update( (obj) => ({ ...obj, [tabsPosition]: documents.length}));

</script>


<div class="tab_bar">
    <ul>
        {#each documents as {name, id}, i}
            {#if i == 0}
                <TabWithoutEvents {name} active={true} tabId={i} parentId={tabsPosition} documentId={id}/>
            {:else}
                <TabWithoutEvents {name} tabId={i} parentId={tabsPosition} documentId={id}/>
            {/if}
        {/each}           
    </ul>
</div>


<style>
    .tab_bar{
        height: 2rem;
        position: absolute;
        top: -2rem;
        left: 3.5rem;
        width: 92%;
        overflow-y: scroll;
        scrollbar-width: none;
        -ms-overflow-style: none; 
    }


    .tab_bar::-webkit-scrollbar{
        display: none;
    }


    ul{
        list-style: none;
        margin: 0;
        padding: 0;
        height: 100%;
        display: flex;
    }

    li{
        display: inline-flex;
        height: 100%;
        align-items: center;
        /*margin-left: -2.5rem;*/
        z-index: 0;      
    }

    li svg{
        width: 2.5rem;
    }


    .add_tab{
        display: inline-block;
        background-color: var(--light-slate-gray);
        height: 100%;
        width: 2rem;
        position: relative;
        transition: background 400ms ease-in-out;
    }

    .add_tab__wrapper.hover .add_tab{
        background-color: var(--pale-orange);
    }



    .curve{
        display: inline;
        fill: var(--light-slate-gray);
        transition: fill 400ms ease-in-out;
    }

    .add_tab__wrapper.hover .curve{
        fill: var(--pale-orange);
    }   

    
    .add_tab_clicker{
        position: absolute;
        top: 0;
        right: .7rem;
        width: 2.7rem;
        height: 100%;
        z-index: 10;
        background-color: transparent;
    }




    .plus{
        width: 0.625rem;
        height: 0.625rem;
        position: absolute;
        top: 50%;
        right: -10%;
        transform: translateY(-50%);
        fill: var(--white-blue);
    }

    @media print{
        .tab_bar{
            display: none;
        }
    }

</style>