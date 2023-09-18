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
    import validation from "$lib/scripts/utils/validation/validation";
	import { getContext, setContext } from "svelte";
    import DataSaver from "./DataSaver.svelte";

    let trigger = false;
    let closing_animation = false;

    let open = false;
    let not_valid = false;
    let keyChange = true;
    /**
     * @description используется для отображения сообщения о том, что блок не может быть сохранен
     * показывается однокартное сообщение
     */
    let messageWasShown = false;
    
    //TODO сохранение состояния по комбинации cntl + S
    const controller = getContext("controller");

    
    /**обработка анимации открытия*/
    function arrowClicked(){
        /** проверяем поля на требования устанавливыемые, например, с data_type 
         * и устанавливаем значение флага messageWasShown чтобы сообщение было показано
         *  только один раз
        */
        if(open && messageWasShown === false && !controller.checkDataTypeAndFields({...data})){
            messageWasShown = true;
            return;
        }

        open = !open;
        
        if(open){              
            
            setTimeout(() => {
                trigger = true;
                document.dispatchEvent(new CustomEvent("redactor-сhanged"));
            }, 650);     
            
        } else {
            let objTosend = controller.deleteNoBackendFields(data);

            /**проверяем, если данные типа integer, то преобразуем в int, иначе сервер не примет*/
            if(objTosend.data_type === "integer"){
                controller.forceContentToBeInt(objTosend);
            }
            
            controller.saveNourgentAsObj(data.id, objTosend);
            controller.sendDataInQueue();
            messageWasShown = false;
            
            trigger = false;
            closing_animation = true;
            
            setTimeout(() => {
                closing_animation = false;
                document.dispatchEvent(new CustomEvent("redactor-сhanged"));
            }, 650);  
            
        }
    }


    $: if(!open){
        not_valid = false;
    }


    /**получаем текущий активный node_type. выбирается на <FiledTypePicker> это дропдаун*/
    $: node_type = gainNodeType($nodeOptions);

    /** получаем обьект data выбранного сейчас блока, для получения данных и перерисовки интерфейса
     * фактически мы выдераем прямую ссылку на обьект данных, конкретного элемента.
     */
    $: data = getBlockObj($blockClickedId);

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
    nodes.subscribe( (nodes) => {
                console.log("[NodeRedactor]: {$NODES} store changed, trigger", nodes);
                console.log("[NodeRedactor]: {$NODES} DATA STATUS", data);
                keyChange = !keyChange;
                data = data;
    });

    $: if(data){
        // console.log("[NoedeRedactor]: before elementsupdate, check $nodes: ", $nodes);
        
        //console.log("[NodeRedactor]: BEFORE {validation} check data", data);
        validation(data);
        
        //console.log("[NodeRedactor]: AFTER {validation} check data", data);
        /*обновляем дом*/
        elementsDataUpdate(data);
        
        not_valid = false;
    }


    /*$: console.log("[NodeRedactor]: updated ", $nodes);*/
    /*$: console.log("[NodeRedactor]: node_type changed: ", node_type);*/
    /*$: console.log('[NodeRedactor]: data for active block: ', {
                                                                data,
                                                                "blockclickedId": $blockClickedId
                                                            });*/



    function getBlockObj(activeBlockId){
        //console.log("[NodeRedactor]: getBlockObj running. Arguments: ", activeBlockId);
        //console.log("[NodeRedactor]: getBlockObj running. nodes: ", $nodes);
        if(open) controller.saveDataBeforeChange(data.id, {...data});
        
        
        for(let i = 0; i < $nodes.length; i++){
            
            if($nodes[i]["id"] === activeBlockId){
                controller.setActiveNode($nodes[i]);
                keyChange = !keyChange;
                node_type = $nodes[i].node_type;
                return $nodes[i];
            }
        }
    }


    function gainNodeType(array){
        for(let i = 0; i < array.length; i++){
            if(array[i].selected === true) return array[i].value;
        }
    }


    function handleError({detail}){
        const {code} = detail;
  
        if(code === 806){
            not_valid = true;
        }
    }


    function dataChanged({detail}){
        console.log("~~~TEST [NodeRedactor]: detail changed", detail);
        if(data.id === detail.id){
            for (const key of Object.keys(detail)) {
                if(key === "id") continue;
                data[key] = detail[key];
            }
        }
        console.log("~~~TEST [NodeRedactor]: data changed", data);
    }


</script>

<svelte:document on:error={handleError}></svelte:document>

<form data-elements="node_redactor" 
class:open 
class:trigger 
class:closing_animation
class:not_valid>
    
    <div class="arrow__position">
        <Arrow bind:open={open} on:arrow_clicked={arrowClicked}/>
    </div>

    {#if trigger && data}
        <div class="controls">
            <FieldTypePicker id={data.id}/>

            <Compare id={data.id} 
            trigger={data.trigger} validity={data.validity}/>

            <InputwithLabel bind:value={data.name} id={data.id}
            name={"name"}
            validity={data.validity}
            --border-width="2px"
            --border-color="var(--light-blue)"
            --border-color-hover="var(--light-gray-blue)"
            --background = "var(--light-blue)"
            --background-hover="var(--light-gray-blue)"
            --color ="var(--deep-blue)"
            --placeholder="var(--faded-gray-blue)"
            --padding=".5rem 1rem .5rem 1.75rem"
            />

            {#if node_type === "checkbox"}
                <CheckBoxWithLabel id={data.id} isChecked={data.content} 
                on:data-changed={dataChanged}/>
            {/if}
            {#if node_type === "select"}
                <ToggleWhite id={data.id} view_type={data.view_type}
                on:data-changed={dataChanged}/>
            {/if}

        </div>

        <div class="redactors">
            <!--Реадктор по умолчанию имеет три различных визуализации. 
                выбор, что показывать, основан на типе узла который выбран-->
            
            {#if node_type === "text" || node_type === "entry"}
                <ContentRedactor id={data.id} display={"content"} {node_type} label={"Содержание блока"} rows={6}
                placeholder={"Содержание отображается в тексте документа"}
                validity={data.validity} content={data.content} data_type={data.data_type}
                on:data-changed={dataChanged}/>
                <ContentRedactor id={data.id} display={"description"} {node_type} label={"Описание блока"} 
                placeholder={"Описание будет отображаться в анкете"} description={data.description} 
                rows={3} validity={data.validity} 
                on:data-changed={dataChanged}/>
            {:else if node_type === "checkbox"}
                <ContentRedactor id={data.id} display={"description"} {node_type} label={"Описание блока"} 
                validity={data.validity} description={data.description} on:data-changed={dataChanged}/>
            {:else if node_type === "select"}
                
                <div class="select__wrapper">
                    <List id={data.id}
                    on:data-changed={dataChanged}
                    />
                    <ContentRedactor id={data.id} display={"description"} {node_type} label={"Описание блока"} 
                    validity={data.validity} description={data.description} on:data-changed={dataChanged}/>
                
                </div>
                
            {/if}
        </div>
    {:else if trigger && !data}
        <div>
            <h3>Выбирете блок</h3>
        </div>
    {/if}
    
</form>

<!--<DataSaver id={data?.id} data={{...data}} isRedactorOpen={open}/>-->


<style>
    form{
        display: flex;
        position: absolute;
        bottom: 0;
        left: 0;
        padding: 0;
        background-color: var(--middle-blue);
        width: 100%;
        min-height: 1.5rem;
        gap: 2.6rem;
        justify-content: space-between;
        z-index: 5;
        border-top: 3px solid transparent;
        transition: border 400ms ease;
    }

    form.not_valid{
        border-top: 3px solid var(--orange);
    }


    .open{
        min-height: 22.75rem;
        animation-name: open;
        animation-duration: 600ms;
        animation-timing-function: ease-in-out;
        animation-fill-mode: forwards;
    }


    .trigger{
        padding: 2rem 1.5rem 2rem 2rem;
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

    .closing_animation{
        animation-name: close;
        animation-duration: 600ms;
        animation-timing-function: ease-in-out;
        animation-fill-mode: forwards;
    }


    @keyframes open{
        0%{
            min-height: 1.5rem;
        }
        100%{
            min-height: 22.75rem;
        }
    }


    @keyframes close{
        0%{
            min-height: 22.75rem;
        }
        100%{
            min-height: 1.5rem;
        }
    }


</style>