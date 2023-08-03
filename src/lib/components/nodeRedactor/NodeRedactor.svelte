<script>
    import InputwithLabel from "../CntrElem/InputwithLabel.svelte";
    import Arrow from "./Arrow.svelte";
	import Compare from "./Compare.svelte";
	import ContentRedactor from "./ContentRedactor.svelte";
    import FieldTypePicker from "./FieldTypePicker.svelte";
    import { nodeOptions, blockClickedId, nodes, storeForSimpleTexts } from "$lib/scripts/stores";
    import elementsDataUpdate from "$lib/scripts/controllers/elementsDataUpdate";
    import CheckBoxWithLabel from "./CheckBoxWithLabel.svelte";
	import ToggleWhite from "./ToggleWhite.svelte";
    import List from "./List.svelte";


    //TODO сохранение состояния по комбинации cntl + S


    /**получаем текущий активный node_type. выбирается на <FiledTypePicker> это дропдаун*/
    $: node_type = gainNodeType($nodeOptions);
    
    /** получаем обьект data выбранного сейчас блока, для получения данных и перерисовки интерфейса
     * фактически мы выдераем прямую ссылку на обьект данных, конкретного элемента.
     */
    $: data = getBlockObj($blockClickedId);
    

    $: if(data){
        console.log("[NodeRedactor]: before elementsDataUpdate call. check data state", data);
        console.log("[NoedeRedactor]: before elementsupdate, check $nodes: ", $nodes);
        elementsDataUpdate(data);
    } 


    /**этот блок тригерритсся когда мы меняем что-то в DOM компонета. на*/
   /* $: if(data){
        console.log("[NodeRedactor]: if data BLOCK. EMPTY BLOCK" , data);
        /**
         * обновляем узел в списке узлов
        */
       /*
        nodes.update( (arrOfBlocksData) => {
            for(let i = 0; i < arrOfBlocksData.length; i++){
                if( data.id === arrOfBlocksData[i]["id"]){
                    arrOfBlocksData[i] = data;

                    break;
                }
            }
            console.log("[NodeRedactor]: data updater, $: data: arrOfBlocksData", arrOfBlocksData);

            return arrOfBlocksData;
        });*/
   /* }*/


    /**
     * когда меняется вцелом состояния стора $nodes мы просто перерисовываем состояние компонента
     *  через data = data. так как сам по себе data это прямая ссылка на нужные обьект в сторе.
    */
    $: if($nodes){
        data = data;
        console.log("[NodeRedactor]: if($NODES): NOW IT's empty block", $nodes);
    }
    


    /*$: console.log("[NodeRedactor]: updated ", $nodes);*/
    /*$: console.log("[NodeRedactor]: node_type changed: ", node_type);*/
    /*$: console.log('[NodeRedactor]: data for active block: ', {
                                                                data,
                                                                "blockclickedId": $blockClickedId
                                                            });*/



    function getBlockObj(activeBlockId){
        console.log("[NodeRedactor]: getBlockObj running. Arguments: ", activeBlockId);
        //console.log("[NodeRedactor]: getBlockObj running. nodes: ", $nodes);
        for(let i = 0; i < $nodes.length; i++){
            if($nodes[i]["id"] === activeBlockId){
                return $nodes[i];
            }
        }
    }


    function gainNodeType(array){
        for(let i = 0; i < array.length; i++){
            if(array[i].selected === true) return array[i].value;
        }
    }


    /*function inputNameChanged(e){
        console.log("[NodeRedactor]: changed: ", e);
        on:input_name_changed={inputNameChanged}
    }*/


</script>

<form>
    <div class="arrow__position">
        <Arrow />
    </div>

    <div class="controls">
        <FieldTypePicker id={data.id}/>

        <Compare id={data.id} 
        bind:trigger={data.trigger}/>

        <InputwithLabel bind:value={data.name} id={data.id}
        --background = "var(--light-blue)"
        --color ="var(--deep-blue)"
        --placeholder="var(--faded-gray-blue)"
        --border="none"
        --padding="0.5rem 1rem"
        />

        {#if node_type === "checkbox"}
            <CheckBoxWithLabel bind:isChecked={data.content}/>
        {/if}
        {#if node_type === "select"}
            <ToggleWhite id={data.id} bind:view_type={data.view_type}/>
        {/if}

    </div>

    <div class="redactors">
        <!--Реадктор по умолчанию имеет три различных визуализации. 
            выбор, что показывать, основан на типе узла который выбран-->

        {#if node_type === "text" || node_type === "entry"}
            <ContentRedactor id={data.id} display={"content"} {node_type} label={"Содержание блока"} rows={6}
            placeholder={"Содержание отображается в тексте документа"} bind:value={data.content} bind:data_type={data.data_type}/>
            <ContentRedactor id={data.id} display={"description"} {node_type} label={"Описание блока"} 
            placeholder={"Описание будет отображаться в анкете"} 
            bind:value={data.description} rows={3}/>
        {/if}

        {#if node_type === "checkbox"}
            <ContentRedactor id={data.id} display={"description"} {node_type} label={"Описание блока"} 
            bind:value={data.description}/>
        {/if}

        {#if node_type === "select"}
            <div class="select__wrapper">
                <List id={data.id}/>
                <ContentRedactor id={data.id} display={"description"} {node_type} label={"Описание блока"} bind:value={data.description}/>
            </div>
        {/if}
    </div>

</form>


<style>
    form{
        display: flex;
        position: absolute;
        bottom: 0;
        left: 0;
        padding: 2rem 1.5rem 2rem 2rem;
        background-color: var(--middle-blue);
        width: 100%;
        min-height: 22.75rem;
        gap: 2.6rem;
        justify-content: space-between;
    }


    .controls{
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: start;
        align-items: start;
    }


    .redactors{
        display: flex;
        flex-direction: column;
        justify-content: start;
        width: 100%;
        flex: 3;
    }

    .controls,
    .redactors{
        gap: 1rem;
    }

    .arrow__position{
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%, -35%);
    }

    .select__wrapper{
        display: flex;
        justify-content: center;
        width: 100%;
        height: 100%;
        gap: 2.5rem;
    }
</style>