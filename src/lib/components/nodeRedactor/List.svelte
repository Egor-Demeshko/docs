<script>
    import DynamicInput from "$lib/components/CntrElem/DynamicInput.svelte";
    import InputwithLabel from "../CntrElem/InputwithLabel.svelte";
    import syncSeveralDatasInNodeStore from "$lib/scripts/controllers/syncSeveralDatasInNodeStore.js";
    import { createEventDispatcher } from "svelte";
    import { get } from "svelte/store";
    import { nodes } from "$lib/scripts/stores"; 


    export let id = "";
    let options = [""];
    let firstMount = true;

    $: if(id){
        const nodeList = get(nodes);
        options.length = 0;

        for (let i = 0; i < nodeList.length; i++) {
            const element = nodeList[i];
            if (element.id === id) {
                if(element.options){
                    options = [...element.options];
                } else {
                    options = [""];
                }
            }            
        }
    }

    const dispatch = createEventDispatcher();
    let wrapper;

    $: syncSeveralDatasInNodeStore(id, { "options": [...options], "content": options[0]});

    $: {
        if(!firstMount){
            let displayChangedObj = {};

            if(options.length >= 1){
                displayChangedObj["content"] = options[0];
            } else if(options.length === 0){
                displayChangedObj["content"] = "";
            }

            displayChangedObj["options"] = [...options];
            displayChangedObj["id"] = id;
            dispatch("data-changed", displayChangedObj);
            displayChangedObj = null;
        } else {
            firstMount = false;
        }

    }
    


    /** TODO сделать сохранение куда-то, пока мы только в runtime добавляем в массив*/
    function addInput(e){
        e.stopPropagation();
        options.push('');
        options = options;
        
        if(options.length === 1){
            
            setTimeout( () => {
                if(!wrapper) return;

                let forFocus = wrapper.querySelector("input");
                forFocus.focus();
                wrapper = null;
            });
        }
    }

    /**
     * удалние элемента делает через реактивность родителя. 
     * optins это ссылка на массив прямо в обьекте графа
    */
    function deleteItem(e){
        //у каждого элемента есть айди. айди фактически порядковый номер в массиве.
        /*let valueOfElementToBeDeleted = '';*/
        
        if(e.target.tagName === "path" || e.target.tagName == "svg"){
            let div = e.target.closest("div[id*=list]");
            let id = +div.id.replace("list_", '');

            options = options.filter( ( v, i) => {
                if(i === id){ 
                    /*valueOfElementToBeDeleted = v;*/
                    //console.log("[LIST]: deleteItem, click handle in filter function, valueOfElementToBeDeleted: ", valueOfElementToBeDeleted);
                    return false;
                }
                return true;
            });
        }
    }
</script>



<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<form id="list" class="list__wrapper" on:click={deleteItem} on:submit={ (e) => e.preventDefault() }>
    <span class="list__name">Элементы списка</span>

    <div class="list" >
       <!-- {#if options } -->
            {#each options as value, i (i)}

            <!-- первый элемент должен быть с надписью значение по умолчанию. Остальные идут отдельным списком, без подписи.
            поэтому первый элемент инпут с лайбел. остальные просто инпут. -->
                {#if i === 0}
                <div class="line" id={`list_${i}`} bind:this={wrapper}>
                    <InputwithLabel label={"Значение по-умолчанию"}
                    bind:value={value} name={"options"}
                    --color="var(--deep-blue)"
                    --border-width="2px"
                    --border-color="var(--middle-blue)"
                    --label-color="var(--middle-blue)"
                    --padding="0.375rem 1rem"
                    --background-color="var(--white-blue)"
                    --placeholder="var(--faded-gray-blue)"
                    --background-hover="var(--light-gray-blue)"
                    --border-color-hover="var(--middle-blue)"
                    --border-radius="15px"
                    />
                    
                    <svg class="icon" viewBox="0 0 10 10">
                        <path d="M9.07675 5.92428H5.91769V9.07572C5.91769 9.58797 5.50612 10 4.99444 10C4.48276 10 4.07119 9.58797 4.07119 9.07572V5.92428H0.923248C0.411568 5.91314 0 5.50111 0 4.98886C0 4.74276 0.100111 4.51002 0.266963 4.33185C0.444939 4.16481 0.678532 4.06459 0.923248 4.06459H4.07119V0.924276C4.07119 0.412027 4.48276 0 4.99444 0C5.50612 0 5.91769 0.412027 5.91769 0.924276V4.06459H9.07675C9.58843 4.06459 10 4.47661 10 4.98886C10 5.50111 9.58843 5.91314 9.07675 5.92428Z"/>
                    </svg>
                    
                </div>
                {/if}
            {/each}
        <!-- {/if} -->

        <!-- повторно делаем each по тому же массиву, чтобы сформировать список остальных возможных опций. первый элемент
        отрисовывать не надо -->
        <!--{#if options} -->
            <div class="list__options">
                <span class="list__additional">Дополнительные значения:</span>
                {#each options as value, i (i)}

                    {#if i === 1}
                        <div class="line" id={`list_${i}`} >               
                            <DynamicInput bind:value={value} placeholder={"Введите название элемента списка"}         
                            --color="var(--deep-blue)"
                            --border-width="2px"
                            --border-color="var(--middle-blue)"
                            --padding=".375rem 1rem"
                            --font-size=".875rem"
                            --background-hover="var(--light-gray-blue)"
                            --border-color-hover="var(--middle-blue)"/>

                            <svg class="icon_not_translated" viewBox="0 0 10 10">
                                <path d="M9.07675 5.92428H5.91769V9.07572C5.91769 9.58797 5.50612 10 4.99444 10C4.48276 10 4.07119 9.58797 4.07119 9.07572V5.92428H0.923248C0.411568 5.91314 0 5.50111 0 4.98886C0 4.74276 0.100111 4.51002 0.266963 4.33185C0.444939 4.16481 0.678532 4.06459 0.923248 4.06459H4.07119V0.924276C4.07119 0.412027 4.48276 0 4.99444 0C5.50612 0 5.91769 0.412027 5.91769 0.924276V4.06459H9.07675C9.58843 4.06459 10 4.47661 10 4.98886C10 5.50111 9.58843 5.91314 9.07675 5.92428Z"/>
                            </svg>
                        </div>    
                    {:else if i > 1}
                        <div class="line" id={`list_${i}`}>
                            <DynamicInput bind:value={value} placeholder={"Введите название элемента списка"}              
                            --color="var(--deep-blue)"
                            --border-width="2px"
                            --border-color="var(--middle-blue)"
                            --padding=".375rem 1rem"
                            --font-size=".875rem"
                            --background-hover="var(--light-gray-blue)"
                            --border-color-hover="var(--middle-blue)"/>

                            <svg class="icon_not_translated" viewBox="0 0 10 10" data-close="true">
                                <path d="M9.07675 5.92428H5.91769V9.07572C5.91769 9.58797 5.50612 10 4.99444 10C4.48276 10 4.07119 9.58797 4.07119 9.07572V5.92428H0.923248C0.411568 5.91314 0 5.50111 0 4.98886C0 4.74276 0.100111 4.51002 0.266963 4.33185C0.444939 4.16481 0.678532 4.06459 0.923248 4.06459H4.07119V0.924276C4.07119 0.412027 4.48276 0 4.99444 0C5.50612 0 5.91769 0.412027 5.91769 0.924276V4.06459H9.07675C9.58843 4.06459 10 4.47661 10 4.98886C10 5.50111 9.58843 5.91314 9.07675 5.92428Z"/>
                            </svg>
                        </div>    
                    {/if}    

                {/each}
            </div>
      <!-- {/if} -->
        
        <button on:click={addInput} type="button">Добавить элемент</button>

    </div>
</form>



<style>
    .list{
        border-radius: 15px;
        background-color: var(--light-blue);
        padding: 1rem 1.5rem 1rem 1rem;
        max-height: 280px;
        overflow-y: scroll;
    }

    /**сделай стилизацию скролл бара для .list*/
    .list::-webkit-scrollbar{
        width: 8px;
    }

    .list::-webkit-scrollbar-thumb{
        background-color: var(--gray-blue);
        border-radius: 4px;
    }

    .list::-webkit-scrollbar-track{
        background-color: transparent;
    }

    .list::-webkit-scrollbar-button{
        display: none;
    }



    .list__wrapper{
        display: flex;
        flex-flow: column;
        gap: .25rem;
        width: 100%;
        color: var(--middle-blue);
    }

    .list__name{
        color: var(--white-blue);
        font-size: .875rem;
    }

    .list__options{
        width: 100%;
        display: flex;
        flex-flow: column;
        gap: .375rem;
        /*overflow-y: scroll;*/
    }

    .list__additional{
        display: block;
        margin-top: 1rem;
        font-size: .875rem;
        color: var(--middle-blue);
    }


    .line{
        display: flex;
        gap: .5rem;
        align-items: center;
    }


    .icon,
    .icon_not_translated{
        display: block;
        width: .6rem;
        height: .6rem;
        fill: var(--middle-blue);
        cursor: pointer;
        transition: fill 400ms ease;
    }


    .icon{
        transform: translateY(106%) rotateZ(45deg);
    }


    .icon_not_translated{
        transform: rotateZ(45deg);
    }

    .icon:hover,
    .icon_not_translated:hover{
        fill: var(--pale-orange);
    }


    button{
        border: none;
        background-color: var(--middle-blue);
        padding: .2rem;
        font-size: .875rem;
        width: 100%;
        margin-top: .375rem;
        border-radius: 10px;
        transition: background 400ms ease, outline 400ms ease;
        outline: 2px solid transparent;
    }

    button:hover{
        background-color: var(--gray-blue);
    }

    button:focus{
        outline: 2px solid var(--orange);
    }

    button:active{
        background-color: var(--orange);
    }
</style>