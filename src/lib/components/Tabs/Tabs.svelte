<script>
    import Tab from "./Tab.svelte";
    import { tabsQuantity } from "$lib/scripts/stores";
    export let tabNames = [];
    export let id = '';

    tabsQuantity.update( (obj) => ({ ...obj, [id]: tabNames.length}));

    let active = false;
    let activeTab = "activeTab";
</script>

<div class="tab_bar">
    <ul>
        {#each tabNames as name, i}
            {#if i == 0}
                <Tab {name} active={true} id={i} parentId={id}/>
            {:else}
                <Tab {name} id={i} parentId={id}/>
            {/if}
        {/each}
            <li>
                <div class="add_tab">
                    <svg class="plus">
                        <use href="/assets/icons/all.svg#plus"></use>
                    </svg>
                </div>

                <svg class="curve" viewBox="0 0 40 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M0 32H40C27.7781 32 21.2597 27.8258 18.0005 16.1894C16.3696 6.96624 8.93053 0 0 0V32Z"/>
                </svg> 
            </li>
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
        width: 4rem;
        position: relative;
    }


    .curve{
        display: inline;
        fill: var(--light-slate-gray);
    }


    .plus{
        width: 0.625rem;
        height: 0.625rem;
        position: absolute;
        top: 50%;
        right: -10%;
        transform: translateY(-50%);
    }

    @media print{
        .tab_bar{
            display: none;
        }
    }

</style>