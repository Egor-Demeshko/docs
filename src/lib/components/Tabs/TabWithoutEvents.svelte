<script>
    import { activeTabId, tabsQuantity, documents, showTooltip, modalFieldsStore} from "$lib/scripts/stores";
    export let name = "Имя";
    export let active = false;
    export let tabId;
    export let parentId = '';
    export let documentId = null;
    
    //при первой отрисовке, первые вкладки слева и справа делаем активными.
    if(active) activeTabId.update( (obj) => ({...obj, [parentId]: tabId}));
    if(tabId === 0) documents.update( (docs) => {
        docs.setActive(documentId);
        return docs;
    });

    $: active = ( tabId === $activeTabId[parentId] ) ? true : false;
    $: activeTab =  (active) ? "activeTab" : "ordinary";
    $: activeSvg = (active) ? "activeSvg" : "ordinarySvg";
    $: svgShadow =  (tabId > $activeTabId[parentId]) ? "rightShadow" : 
                    (tabId < $activeTabId[parentId]) ? "leftShadow" : 
                    (tabId === $activeTabId[parentId] && tabId === 0) ? "rightShadow" : "leftShadow";
    $: zIndex = (tabId === $activeTabId[parentId]) ? $tabsQuantity[parentId] :
                (tabId > $activeTabId[parentId]) ? $tabsQuantity[parentId] - tabId : tabId;
    /*$: console.log(`activetab, ${parentId}`, { 
                                                "parent_ID": parentId,
                                                "activeTab id": $activeTabId[parentId], 
                                                "current id": id, 
                                                "quantity": $tabsQuantity[parentId]});*/

    

    function handelClick(){
        activeTabId.update( (obj) => ({...obj, [parentId]: tabId}));
        documents.update( (docs) => {
            docs.setActive(documentId);
            //console.log("[TAB]: handle click");
            return docs;
        });
    }

</script>


<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="wrapper" style="z-index: {zIndex}" on:click={handelClick}>
    <svg class="border-curve {activeSvg} {(tabId === 0 || svgShadow === "rightShadow") ? '' : svgShadow}" 
        viewBox="0 0 40 32" 
        fill="none">
            <path class="" fill-rule="evenodd" clip-rule="evenodd" d="M40 32H0C12.2219 32 18.7403 27.8258 21.9995 16.1894C23.6304 6.96624 31.0695 0 40 0V32Z"/>
    </svg>


    <li class={activeTab}>
        <span contenteditable="false">{name}</span>
    </li>


    <svg class="border-curve {activeSvg} {(tabId === $tabsQuantity[parentId] - 1 || svgShadow === "leftShadow") ? '' : svgShadow}" 
        viewBox="0 0 40 32" 
        fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M0 32H40C27.7781 32 21.2597 27.8258 18.0005 16.1894C16.3696 6.96624 8.93053 0 0 0V32Z"/>
    </svg> 
</div>

<style>
    :root{
        --curve-width: 2.5rem;
    }


    .border-curve{
        width: var(--curve-width);
        transition: fill 400ms ease-in-out, filter 400ms ease-in-out;
    }
  

    .border-curve.activeSvg{
        fill: var(--middle-blue);
    }
    
    .border-curve.ordinarySvg{
        fill: var(--faded-middle-blue);
    }

    .wrapper:hover .border-curve.activeSvg,
    .wrapper:hover .border-curve.ordinarySvg{
        fill: var(--gray-blue);
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


    /**СОСТОЯНИЕ ТЕНЕЙ ВКЛАДОК*/
    .wrapper:hover .activeSvg.leftShadow,
    .wrapper:hover .ordinarySvg.leftShadow{
        filter: drop-shadow(-2px 0 0 var(--middle-blue));
    } 
    
    .wrapper{
        height: 100%;
        display: inline-flex;
        z-index: 1;
    }


    .wrapper:nth-child(n + 1){
        margin-right: -3.5rem;
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
        transition: background 400ms ease-in-out;
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

    .wrapper:hover .ordinary,
    .wrapper:hover .activeTab{
        background-color: var(--gray-blue);
    }


    span{
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        pointer-events: none;
        cursor: auto;
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
        fill: var(--white-blue);
        cursor: pointer;
    }


    .close{
        transition: filter 600ms ease;
    }


    .close:hover{
        filter: drop-shadow(0 0 4px var(--orange));
    }
</style>