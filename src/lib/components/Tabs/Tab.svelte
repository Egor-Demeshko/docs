<script>
    import { activeTabId, tabsQuantity, documents, showTooltip, modalFieldsStore} from "$lib/scripts/stores";
	import { get } from "svelte/store";
    export let name = "Имя";
    export let active = false;
    export let tabId;
    export let parentId = '';
    export let documentId = null;

    let openEnter = false;
    let spanElement;
    let truncElement;

    /**
     * активность вкладки определяется от активного докуметна.
     * если айди документа равно активному документу, то вкладка активная
     * сразу следом меняем activeTabId
    */
    $: active = (documentId === $documents.getActiveDocumentId()) ? true : false;
    console.log("[TAB]: active: ", active);
    $: if(active){
        activeTabId.update( (obj) => ({...obj, [parentId]: tabId}));
    }



    //$: active = ( tabId === $activeTabId[parentId] ) ? true : false;
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
        /**меняем номер активной вкладки*/
        if($activeTabId.document ===  tabId) return;
        
        activeTabId.update( (obj) => ({...obj, [parentId]: tabId}));
        /**меняем id активного документа. в сетактив таже будет сохраняться состояние html редактора*/
        documents.update( (docs) => {
            docs.saveHtmlState();
            docs.sendHtmlState();
            docs.setActive(documentId);
            //console.log("[TAB]: handle click");
            return docs;
        });
    }


    /**заркываем таб, закрытие приводит к удалению документа*/
    function closeTab(){
        //вывесити модалку
        //если ок, то удаляем документ.
        //ВСЕ ДЕЛАЕ ассинхронно
        //на сервер отправить запрос об удалении
        //почистить локал сторидж
        modalFieldsStore.set({
                show: true,
                text: 'Вы собираетесь удалить документ, Вы согласны?',
                okCallback: () => $documents.delete({documentId})
        });
    }


    /**сохраняем нахвание template или на enter или если blur */
    async function saveHeading(e){
        const newName = e.target.textContent;

        if(newName.length > 0) {
            openEnter = false;
        } else {
            openEnter = true;

            document.dispatchEvent( new CustomEvent("error", {detail: {
                    err_data: [
                        {
                            blockId: 0,
                            message: "Пустоe название нельзя сохранить!",
                            err_id: 1000,
                            err_type: "emergency"
                        }
                    ]
                }}));
            return;
        }
        if(name === newName) return;
        if(e.code === 'Enter'){
            e.preventDefault();
        }

        if(e.code && e.code === 'Enter' || e instanceof FocusEvent && e.type === "blur"){
            let result = await $documents.saveHeading(documentId, newName);
            if(e.code) { 
                
                e.target.blur();
            };
        }
    }


    function openEmptyRegistrarion(e){
        const text = e.target.textContent;

        if(text.length === 0){
            openEnter = true;
        }      
    }


    function changeViewOfText({target}){

        if(target.textContent.length === 0) return;
        if(target.tagName !== "SPAN") return;
        const text = target.textContent;
        target.textContent = text;
    }


    function deactiveTrunc(){
        const text = spanElement.textContent;
        truncElement.style.display = "none";
        spanElement.style.visibility = "visible";
        spanElement.focus();
    }


    function doTruncate({target}){
        const text = target.textContent;

        if(text.length < 25) {
            truncElement.textContent = "";

            truncElement.style.display = "none";
            spanElement.style.visibility = "visible";
            return;
        }
        
        spanElement.style.visibility = "hidden";
        
        truncElement.textContent = text.slice(0, 22) + "...";
        truncElement.style.display = "block";
    }


    /**hover like события*/
    let pointerEnterClose = (e) => showTooltip.set( {
        show: true,
        coors: {
            x: e.x,
            y: e.y
        },
        text: "УДАЛИТЬ ДОКУМЕНТ",
        place: "above" 
    } )
    let pointerLeaveClose = () => showTooltip.set(false);

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
        <span class="full_text"
        contenteditable={active}
        class:openEnter
        on:keypress={saveHeading} 
        on:blur={saveHeading}
        on:blur={changeViewOfText}
        on:blur={doTruncate}
        bind:this={spanElement}
        >{name}</span>
        <span class="truncated" bind:this={truncElement} 
        on:click={deactiveTrunc}></span>
    
        {#if active}
            <svg class="icons pen"
            class:openEnter
            on:click={openEmptyRegistrarion}>
                <use href="/assets/icons/all.svg#pen"></use>
            </svg>
        {/if}
        {#if active}
            <svg id="close" class="icons close" 
            on:pointerenter={pointerEnterClose}
            on:pointerleave={pointerLeaveClose}
             on:click={closeTab}>
                <use href="/assets/icons/all.svg#plus"></use>
            </svg> 
        {/if}
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


    span.full_text{
        overflow: hidden;
        white-space: nowrap;
        transform: translateY(2px);
        outline: none;
        border-bottom: 1px solid transparent;
    }

    span.full_text:active,
    span.full_text:focus{
        border-bottom: 1px solid var(--orange);
    }

    span.full_text.openEnter{
        width: 100%;
        border-bottom: 1px solid var(--pumpkin);
        animation: open;
        animation-duration: 400ms;
        animation-timing-function: ease;
        animation-fill-mode: forwards;
    }

    span.truncated{
        position: absolute;
        top: .44rem;
        left: 1rem;
        transform: translateY(2px);
        outline: none;
        border-bottom: 1px solid transparent;
    }

    .pen.openEnter{
        fill: var(--pumpkin);
    }

    .ordinary>span{
        cursor: default;
    }


    .icons{
        display: block;
        height: 100%;
        flex: 0 0 1.2rem;
    }

    svg.pen{
        transition: fill 400ms ease;
        fill: var(--white-blue);
        transform: translateY(1px);
    }

    svg.close{
        transform: translateY(-50%) rotateZ(45deg);
        position: absolute;
        width: .6rem;
        top: 50%;
        right: 0;
        cursor: pointer;
        fill: var(--white-blue);
    }


    .close{
        transition: filter 600ms ease;
    }


    .close:hover{
        filter: drop-shadow(0 0 4px var(--orange));
    }

    @keyframes open{
        0%{
            width: 0%;
        }

        100%{
            width: 100%;
        }
    }
</style>