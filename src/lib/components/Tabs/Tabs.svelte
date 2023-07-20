<script>
    import Tab from "./Tab.svelte";
    export let tabNames = ["Договор аренды помещения и еще больше текста", "Акт приема"];

    let active = false;
    let activeTab = "activeTab";
</script>

<div class="tab_bar">
    <ul>
        {#each tabNames as name, i}
            {#if i == 0}
                <Tab {name} active={true} id={i}/>
            {:else}
                <Tab {name} id={i}/>
            {/if}
        {/each}
            <li>
                <div>
                    <svg>
                        <use href="/assets/icons/all.svg#plus"></use>
                    </svg>
                </div>
            </li>
    </ul>
</div>

<style>
    .tab_bar{
        height: 2rem;
    }

    ul{
        list-style: none;
        margin: 0;
        padding: 0;
        height: 100%;
        display: flex;
    }
</style>