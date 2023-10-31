<script>
    import { fly } from "svelte/transition";
    import { nodes } from "$lib/scripts/stores";
    import { getContext } from "svelte";
    import { showTooltip } from "$lib/scripts/stores";

    import elementsDataUpdate from "$lib/scripts/controllers/elementsDataUpdate.js";
    import { setElementActive, setElementInactive, setElementHoverLike, removeElementHoverLike }
             from "$lib/scripts/docElements/controllers/ElementsSideFocusBlurProcess";



    export let data;
    
    const controller = getContext("controller");


   /*
        Компонент отображается выпадающие меню опций в зависимости от переданного массива
        этих самых опции. Переменная options.
        состоит из двух основных блоков, один отвечает за отображение элемента, в основном интерфейса программа
        содержит значение по умолчанию / выбранное на текущий момент

        второй блок это выпадающее меню, отображается оставшиеся опции

        стандартный селект не использовался, так как сложно ему поменять визуальную составляющую
   */

    $: isOpened = false;
    $: rotate = (isOpened) ? true : false;

    let options = data.options;
    let derivedOptions = [];
    let description = data.description;
    let hoverBackground = false;
    
    for(let i = 0; i < options.length; i++){
        if( options[i] === data.content ){
            derivedOptions.push( {
                selected: true,
                text: options[i]
            } );
        } else {
            derivedOptions.push( {
                selected: false,
                text: options[i]
            } );
        }
    }

    $:no_events = (derivedOptions[0]?.text) ? false : true;

    //$: console.log("[DropDown]: options state:  ", $options);


    function handleClick(){
        //console.log("[DropDown] click event target: ", e.target);
        if(derivedOptions.length === 0) return;
        isOpened = !isOpened;

    }


    function handleKeyPressed(e){
        if(e.key === "Enter" || e.key === " "){
            isOpened = !isOpened;  
        }
    }


    function releasePopUp(e){
        if(e.target.closest(".dropdown")) return;
        if(isOpened) isOpened = false;
    }


    /** update store, changing selected element*/
    function changeHandle(e){
        let target = e.target;
        let type = target.value;  //значение выбранной опции


        derivedOptions.forEach( (elem) => {
            if(elem.text === type) {
                
                elem.selected = true;
                /**обновление элементов в тексте*/
                elementsDataUpdate({id: data.id, name: data.name, content: type});
                
                //AnketaGraphController
                $controller.saveData({node_id: data.id, content: target.value});
            } else {
                elem.selected = false;
            }
        });


        derivedOptions = derivedOptions;


        isOpened = false;

        /*console.log("[DropDown]: change event: ", {
            target,
            type
        });*/
    }


    function onInputEnter(e){
        e.stopPropagation();
        const input = e.target.querySelector('input');
        if(e.key === "Enter" || e.key === " "){
            changeHandle({target: input});
        }
    }


    /* ОБРАБОТКА ПОИНТЕР ИВЕНТОВ */
    function elementFocusIn(){
        setElementActive(data.id);
    }


    function elementFocusOut(){
        setElementInactive(data.id);
    }

    function elementPointerEnter(e){
        hoverBackground = true;
        const target = e.target;
        let {x: targetX, y: targetY} = target.getBoundingClientRect();
        targetY += 50;
        let {clientX, clientY} = e;
        let x, y;
        setElementHoverLike(data.id);
        if(!description) return;
        y = clientY;
        x = clientX;
        console.log({targetY, clientY});
        if(targetY  > clientY){ 
            showTooltip.set({show: true, coors: {x, y: y + 20}, text: description, place: "above"});
        } else {
            showTooltip.set({show: true, coors: {x, y: y - 40}, text: description, place: "above"});
        }
    }

    function elementPointerLeave(){
        hoverBackground = false;
        showTooltip.set({show: false});
        removeElementHoverLike(data.id);
    }
    
</script>



<svelte:document on:click={releasePopUp}></svelte:document>


<div class="wrapper"
class:hoverBackground
on:pointerenter={elementPointerEnter}
on:pointerleave={elementPointerLeave}
>
    <div class="name">
        <span>{data.name}</span>
    </div>

    <div class="dropdown" class:no_events
    on:change={changeHandle}>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <div class="main_view" on:click={handleClick} 
        on:keydown={handleKeyPressed} 
        on:focus={elementFocusIn}
        on:blur={elementFocusOut}
        role="button" tabindex="0">

            {#if derivedOptions[0]?.text}
                {#each derivedOptions as {text, selected}}
                    {#if selected}
                    <div class="main_label">
                        <input class="main_input" type="radio" value={text} name={data.name} checked={selected}
                        tabindex="-1"/>

                        <span class="main_name">
                            {text}
                        </span>
                    </div>
                    {/if}
                {/each}

            <svg class="arrow" class:rotate>
                <use href="/assets/icons/all.svg#arrow"></use>
            </svg>
            {:else}
                <div class="main_label" >
                    <span class="main_name"> ПУСТО </span>
                </div>
            {/if}


        </div>

        {#if isOpened}
            <div class="options"
            transition:fly={{ y: 8 }}>

                {#each derivedOptions as {text, selected}}
                    {#if !selected}
                    <label class="options__label option-in-drop"
                    transition:blur tabindex="0" on:keypress={onInputEnter} role="button">
                        <input class="main_input" type="radio" value={text} name={data.name} checked={selected} />

                        <span class="main_name">
                            {text}
                        </span>
                    </label>
                    {/if}
                {/each}
                
            </div>
        {/if}   
    </div>
</div>



<style>
    :root{
        --border: 2px solid var(--light-blue);
    }

    .wrapper{
        display: flex;
        gap: 1rem;
        padding: .5rem;
        align-items: center;
        transition: background 400ms ease;
        border-radius: 8px;
    }


    .wrapper.hoverBackground{
        background-color: var(--faded-light-blue);
    }


    .name{
        flex-basis: 6.8rem;
        flex-grow: 0;
        flex-shrink: 0;
    }

    .name span{
        color: var(--middle-blue);
    }


    .dropdown{
        font-size: 0.875rem;
        position: relative;
        width: 100%;
        flex: 1 0;
        background-color: var(--white-blue);
        border-radius: 30px;
    }


    .main_view{
        display: flex;
        border: 2px solid var(--gray-blue);
        border-radius: 30px;
        align-items: center;
        position: relative;
        transform: translate(0);
        z-index: 4;
        transition: background 400ms ease;
        background-color: var(--white-blue);
    }


    .main_label{
        display: flex;
        justify-content: start;
        align-items: center;
        gap: .4rem;
        padding: var(--padding);
        cursor: pointer;
        border-radius: inherit;
        outline: 2px solid transparent;
        transition: outline 400ms ease;
    }

    .no_events .main_view{
        background-color: var(--light-blue);
    }

    .main_view:hover{
        background-color: var(--light-gray-blue);
    }

    .main_view:focus{
        border: 2px solid var(--orange);
        outline: none;
    }


    .options__label{
        display: flex;
        justify-content: start;
        align-items: center;
        padding: .2rem .875rem;
        cursor: pointer;
        outline: 2px solid transparent;
    }


    .options__label:focus{
        outline: 2px solid var(--orange);
    }


    .main_input{
        appearance: none;
        position: absolute;
        top: 0;
        left: 0;
        width: 0;
        height: 0;
    }

    .main_name{
        font-size: .875rem;
        text-overflow: clip;
        overflow: hidden;
        color: var(--middle-blue);
    }


    .no_events{
        pointer-events: none;
    }


    .arrow{
        fill: var(--gray-blue);
        width: 0.875rem;
        height: 0.5rem;
        position: absolute;
        right: 0.75rem;
        animation-duration: 400ms;
        animation-name: rotate-back;
        animation-timing-function: ease-in-out;
        animation-fill-mode: forwards;
        animation-direction: normal;
    }


    .arrow.rotate{
        animation-duration: 400ms;
        animation-name: rotate;
        animation-timing-function: ease-in-out;
        animation-fill-mode: forwards;
        animation-direction: normal;
    }


    .options{
        position: absolute;
        display: flex;
        flex-direction: column;
        gap:.2rem;
        top: 50%;
        left: 0;
        background-color: var(--white-blue);
        padding-top: 1.6rem;
        padding-bottom: .5rem;
        width: 100%;
        border: 2px solid var(--gray-blue);
        border-top: none;
        z-index: 2;
        border-radius: 0 0 12px 12px;
    }


    .options .main_label{
        padding: .2rem 1.5rem .2rem .875rem
    }

    .option-in-drop{
        transition: background 400ms ease;
    }

    .option-in-drop:hover{
        background-color: var(--light-gray-blue);
    }

    @keyframes rotate{
        0%{
            transform: rotateZ(0);
        }

        50%{
            transform: rotateZ(90deg);
        }

        100%{
            transform: rotateZ(180deg);
        }
    }

    @keyframes rotate-back{
        0%{
            transform: rotateZ(180deg);
        }

        50%{
            transform: rotateZ(90deg);
        }

        100%{
            transform: rotateZ(0);
        }
    }
</style>