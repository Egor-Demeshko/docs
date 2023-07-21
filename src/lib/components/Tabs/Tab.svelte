<script>
    import { activeTabId, tabsQuantity } from "$lib/scripts/stores";
    export let name = "Имя";
    export let active = false;
    export let id;

    $: active = ( id === $activeTabId ) ? true : false;
    $: activeTab =  (active) ? "activeTab" : "ordinary";
    $: activeSvg = (active) ? "activeSvg" : "ordinarySvg";
    $: svgShadow =  (id > $activeTabId) ? "rightShadow" : 
                    (id < $activeTabId) ? "leftShadow" : 
                    (id === $activeTabId && id === 0) ? "rightShadow" : "leftShadow";
    $: zIndex = (id === $activeTabId) ? $tabsQuantity :
                (id > $activeTabId) ? $tabsQuantity - id : id;
    

    function handelClick(){
        activeTabId.set(id);
    }
</script>


<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="wrapper" style="z-index: {zIndex}" on:click={handelClick}>
    <svg class="border-curve {activeSvg} {(id === 0 || svgShadow === "rightShadow") ? '' : svgShadow}" 
        viewBox="0 0 40 32" 
        fill="none" xmlns="http://www.w3.org/2000/svg">
            <path class="" fill-rule="evenodd" clip-rule="evenodd" d="M40 32H0C12.2219 32 18.7403 27.8258 21.9995 16.1894C23.6304 6.96624 31.0695 0 40 0V32Z"/>
    </svg>


    <li class={activeTab}>
        <span contenteditable={active}>{name}</span>
    
        {#if active}
            <svg class="icons pen">
                <use href="/assets/icons/all.svg#pen"></use>
            </svg>
        {/if}
        {#if active}
            <svg id="close" class="icons close">
                <use href="/assets/icons/all.svg#plus"></use>
            </svg> 
        {/if}
    </li>


    <svg class="border-curve {activeSvg} {(id === $tabsQuantity - 1 || svgShadow === "leftShadow") ? '' : svgShadow}" 
        viewBox="0 0 40 32" 
        fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M0 32H40C27.7781 32 21.2597 27.8258 18.0005 16.1894C16.3696 6.96624 8.93053 0 0 0V32Z"/>
    </svg> 
</div>

<style>
    :root{
        --curve-width: 2.5rem;
    }


    .border-curve{
        width: var(--curve-width);
    }

    

    .border-curve.activeSvg{
        fill: var(--middle-blue);
    }
    
    .border-curve.ordinarySvg{
        fill: var(--faded-middle-blue);
    }

    .activeSvg.leftShadow{
        filter: drop-shadow(-2px 0 0 var(--deep-blue));
    }

    .activeSvg.rightShadow{
        filter: drop-shadow(2px 0 0 var(--deep-blue));
    }

    .ordinarySvg.leftShadow{
        filter: drop-shadow(-2px 0 0 var(--middle-blue));
    }

    .ordinarySvg.rightShadow{
        filter: drop-shadow(2px 0 0 var(--middle-blue));
    }




    .wrapper{
        height: 100%;
        display: inline-flex;
        z-index: 1;
    }


    .wrapper:nth-child(n + 1){
        margin-right: -4.5rem;
    }


    li{
        display: flex;
        position: relative;
        justify-content: start;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        line-height: 1.1rem;
        height: 100%;
        padding: .5rem .5rem .5rem 1rem;
        white-space: nowrap;
        width: 80px;
    }


    .ordinary{
        background-color: var(--faded-middle-blue);
        padding: 0.5rem  1rem .5rem 1rem;
    }

    
    .activeTab{
        width: 250px;
        background-color: var(--middle-blue);
        padding: 0.5rem  1.3rem .5rem 1rem;
    }


    span{
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .ordinary>span{
        cursor: default;
    }


    .icons{
        display: block;
        height: 100%;
        flex: 0 0 1.2rem;
    }


    svg.close{
        transform: translateY(-50%) rotateZ(45deg);
        position: absolute;
        width: .6rem;
        top: 50%;
        right: 0;
    }


    .close{
        transition: filter 600ms ease;
    }


    .close:hover{
        filter: drop-shadow(0 0 4px var(--orange));
    }
</style>