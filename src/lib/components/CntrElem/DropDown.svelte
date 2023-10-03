<script>
    import { fly } from "svelte/transition";
    import { nodes } from "$lib/scripts/stores";
    import syncDataInNodesStore from "$lib/scripts/controllers/syncDataInNodesStores.js";
    import { getContext } from "svelte";
    import { get } from "svelte/store";

    export let options;    //стор типа узлов
    export let name = 'dropdown default';   //по нему определяем тип для которого отображается дроб даун
    export let isWithIcon = true;
    export let buildTypeid = 'none';
    export let id = '';

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
    $: if(id){
        //по name получаем имя поля, которое считаем в data.
        //а затем по нему считаем значение этого поля из даты.
        let activeOption = '';
        for(let i = 0; i < $nodes.length; i++){
            if($nodes[i]["id"] !== id) continue;

            activeOption = $nodes[i][name];
            break;
        }
        
        //теперь из стора опций для дропдауна, делаем нашу опцию активной.
        options.update( (options) => {
            for(let i = 0; i < options.length; i++){
                /** при старте программы, есть значения по умолчанию, если
                 * убрать эту проверку, то далее они будут перезаписаны на false
                */
                if(!activeOption) return options;
                
                if(options[i]["value"] !== activeOption ){
                    options[i].selected = false;
                    continue;
                };

                options[i].selected = true;
            }

            return options;
        });
    }

    //$: console.log("[DropDown]: options state:  ", $options);


    function handleClick(){
        //console.log("[DropDown] click event target: ", e.target);
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
        

        options.update( (array) => {
            array.forEach( (elem) => {
                
                if(elem.value === type) {
                    
                    elem.selected = true;
                    
                    //TODO delete this
                    //let nodesData = get(nodes);
                    const filedsToBeUpdate = controller.normolize(name, elem.value);
                    //console.log("[DROPDOWN]: filedsToBeUpdate", filedsToBeUpdate);
                    
                    syncDataInNodesStore(id, null, null, filedsToBeUpdate);
                    //controller.saveNourgentAsObj(id, filedsToBeUpdate);
                    //let result = controller.sendDataInQueue();

                } else {
                    elem.selected = false;
                }
            });


            return array;
        });

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
    

</script>



<svelte:document on:click={releasePopUp}></svelte:document>




<div class="dropdown" on:change={changeHandle}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <div class="main_view" on:click={handleClick} on:keydown={handleKeyPressed} role="button" tabindex="0">

        {#each $options as {text, value, selected}}
            {#if selected}
            <div class="main_label">
                <input id={buildTypeid} class="main_input" type="radio" {value} {name} checked={selected}
                tabindex="-1"/>
                {#if isWithIcon}
                    <svg class="icon">
                        <use href="/assets/icons/all.svg#{value}"></use>
                    </svg>
                {/if}
                <span class="main_name">
                    {text}
                </span>
            </div>
            {/if}
        {/each}

        <svg class="arrow" class:rotate>
            <use href="/assets/icons/all.svg#arrow"></use>
        </svg>
    </div>

    {#if isOpened}
        <div class="options"
        transition:fly={{ y: 8 }}>

            {#each $options as {text, value, selected}}
                {#if selected}
                
                {:else}
                <label class="options__label option-in-drop"
                transition:blur tabindex="0" on:keypress={onInputEnter} role="button">
                    <input class="main_input" type="radio" {value} {name} checked={selected} />
                    {#if isWithIcon}
                        <svg class="icon">
                            <use href="/assets/icons/all.svg#{value}"></use>
                        </svg>
                    {/if}
                    <span class="main_name">
                        {text}
                    </span>
                </label>
                {/if}
            {/each}
            
        </div>
    {/if}   
</div>




<style>
    .dropdown{
        font-size: 0.875rem;
        position: relative;
        width: 100%;
        flex: 1 0;
    }


    .main_view{
        display: flex;
        border: var(--border);
        border-radius: 30px;
        align-items: center;
        position: relative;
        z-index: 4;
        transition: background 400ms ease;
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

    .main_view:hover{
        background-color: var(--light-slate-gray);
    }

    .main_view:focus{
        outline: 2px solid var(--orange);
    }


    .options__label{
        display: flex;
        justify-content: start;
        align-items: center;
        gap: .4rem;
        padding: var(--padding-options);
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
    }


    .icon{
        width: 0.8rem;
        height: 0.8rem;
    }


    .arrow{
        fill: var(--white-blue);
        width: 0.5rem;
        height: 0.25rem;
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
        top: 50%;
        left: 0;
        background-color: var(--middle-blue);
        padding-top: 1.3rem;
        padding-bottom: .5rem;
        width: 100%;
        border: var(--border);
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
        background-color: var(--light-slate-gray);
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