<script>
    import Tab from "./Tab.svelte";
    import { tabsQuantity, showModalDocumentCreator } from "$lib/scripts/stores"; 
    export let tabsPosition = '';
    export let documents;
    //$:console.log("[TABS]: ddocuments", documents);

    tabsQuantity.update( (obj) => ({ ...obj, [tabsPosition]: documents.length}));

    /**дом елемент кнопки добавления документа*/
    let add_tab;
    let hover;

    let pointerEnter = () => hover = true;
    let pointerLeave = () => hover = false;

    function click(){
        showModalDocumentCreator.set(true);
    }
</script>


<div class="tab_bar">
    <ul>
        {#each documents as {name, id}, i}
            {#if i == 0}
                <Tab {name} active={true} tabId={i} parentId={tabsPosition} documentId={id}/>
            {:else}
                <Tab {name} tabId={i} parentId={tabsPosition} documentId={id}/>
            {/if}
        {/each}
            <li class="add_tab__wrapper" class:hover>
                <svg class="curve" viewBox="0 0 40 32" 
                fill="none" >
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M40 32H0C12.2219 32 18.7403 27.8258 21.9995 16.1894C23.6304 6.96624 31.0695 0 40 0V32Z"/>
                </svg>
                <div class="add_tab" bind:this={add_tab}>
                    <svg class="plus">
                        <use href="/assets/icons/all.svg#plus"></use>
                    </svg>
                </div>

                <svg class="curve" viewBox="0 0 40 32" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M0 32H40C27.7781 32 21.2597 27.8258 18.0005 16.1894C16.3696 6.96624 8.93053 0 0 0V32Z"/>
                </svg> 
            </li>

           
            <div class="add_tab_clicker" 
            aria-label="Добавить новый документ"
            role="button"
            on:pointerenter={pointerEnter}
            on:pointerleave={pointerLeave}
            on:click={click}>

            </div>
           
    </ul>
</div>


<style>
    .tab_bar{
        height: 2rem;
        position: absolute;
        top: -2rem;
        left: 3.5rem;
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