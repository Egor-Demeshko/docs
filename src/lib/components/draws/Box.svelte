<script context="module">
  export let changeNameStore = writable({id: null, name: null});
  export let changeValidityStore = writable({id: null, validity: null});
</script>


<script>
  import { getContext, onMount } from "svelte";
  import { drawRoot, nodes } from "$lib/scripts/stores"
  import { linesStore, activeBlocks, storeForSimpleTexts, blockClickedId, parentConnection, childConnection,
  mouseLine } from "$lib/scripts/stores";
  import connectCreationReset from "$lib/scripts/eventHandlers/connectCreationReset.js";
  import boxClickHandler from "$lib/scripts/eventHandlers/boxClickHandler";
	import BoxInner from "./BoxInner.svelte";
  import BoxPoint from "./BoxPoint.svelte";
  import BoxButtons from "./BoxButtons.svelte";
  import deleteFlow from "$lib/scripts/utils/nodes/deleteFlowForBox.js";
  import {writable} from "svelte/store";

  const controller = getContext("controller");

  /**
   * Компонент визуализации узла в виде интерактивного прямоугольника на канве.
   * имеет 4 состояния для визуализации
   * при клике открывает блок редактирования узла. <NodeRedactor/>
   * плюс есть кнопочки добавить связь
   */
  export let node;

  let { 
    id = "", 
    name = "Имя блока", 
    node_type = "entry", 
    active = true, 
    x = 0, 
    y = 0, 
    parent_id: parent = undefined, 
    width = 204, 
    height = 40,
    condition = "",
    trigger = "",
    validity
  } = node;

  /****/
  $: pointUp = (parent) ? false : true; // отображать ли кнопку подключения связи вниху
  let pointDown = true;  // отображать ли кнопку подключения связи вверху
  let root;
  let glow;
  let boxElement;

  /** используется для отображения кнопку управления блоком, появляется при фокусе*/
  let showButtons = false;

  $: parent = updateParent($nodes);

  /**отвечает за включение подстветки блока через тени
   * смысл основной такой. стор parentConnection при первом клике
   * получается стартовое айди. Весь этот блок это для проверки 
   * родительского подключения
  */
  $: if($parentConnection && $parentConnection.end === null){
      let connectInfo = $parentConnection;

      if(connectInfo.start !== id && isParentConnectionPossible(connectInfo)){
            //console.log("[BOX]: {$parentConnection} create listener ", id);

            glow = true;
            boxElement.addEventListener("click", secondStepOnParentConnect, {once: true});
      }

  } else {
            glow = false;
            if(boxElement) {
              //console.log("[BOX]: reset click lisneres");
              boxElement.removeEventListener("click", secondStepOnParentConnect);      
            }
  }

  $: if($childConnection && $childConnection.end === null){
      let connectInfo = $childConnection;
    
      if(connectInfo.start !== id && isChildConnectionPossible(connectInfo)){
          glow = true;
          boxElement.addEventListener("click", secondStepOnChildConnect, {once: true});
      } 
  } else {
      glow = false;
      if(boxElement){
        boxElement.removeEventListener("click", secondStepOnChildConnect);
      }
  }


  changeValidityStore.subscribe(({id: idFromEvent, validity: validityFromEvent}) => {
    if(!idFromEvent) return;
    if(id === idFromEvent && validityFromEvent){
      validity = validityFromEvent;
    }
  });


  /**ссылка на этот элемент Box в Dom*/
  $: isBlockChoosen = ($blockClickedId === id)? "isBlockChoosen" : ""; 
  $: hoverLike = ($activeBlocks.has(id)) ? "isBlockChoosen" : "";

  /**определяем какого вида границу блока рисовать. зависит от наличия условия триггера и condition в data <= $nodes
  */
  $: gotConditions = (condition && !(trigger === undefined || trigger === '' || trigger === null)) ? true : false;
  //$: console.log("[Box]: gotConditions", {condition, gotConditions, trigger});  
/**переопределние класса отображение неактивного блока, если флаг актив false*/
  $: box_inactive = (active) ? "" : "box_inactive";
  $: not_valid = (validity?.status === "invalid") ? true : false; 


  /** обновляются данные блока и связанные визуализации, при взаимодействии с другими частями блока*/
  nodes.subscribe( (allBlocksValues) => {
    if(allBlocksValues === undefined || allBlocksValues === null) return;

    allBlocksValues.forEach( ( obj )=> {
      if(obj.id !== id) return;
       /* console.log("[BOX]: nodes.subsdcrive obj.x: ", obj.x);
        console.log("[BOX]: nodes.subscribe x: ", x);*/
        if(x != obj.x) x = obj.x;
        if(y != obj.y) y = obj.y;
        if(name !== obj.name) name = obj.name;
        if(node_type !== obj.node_type) node_type = obj.node_type;
        if(condition !== obj.condition) condition = obj.condition;
        if(trigger !== obj.trigger) trigger = obj.trigger;
        if (active !== obj.active) active = obj.active; 
        if(active === undefined) throw new Error("[BOX]: undefined 'active' field");

        parent = obj.parent || parent;
        width = obj.width  || width;
        height = obj.height || height;
    });

  });


  changeNameStore.subscribe( (obj) => {
    if(!obj?.id) return;

    if(obj.id === id){
      name = obj.name;
    }
  });


  onMount( () => {
    try{
      root = $drawRoot;
    } catch {
      console.log('[BOX]: no root to draw');
    }
/*  
    document.addEventListener("parent_connection", () => processNewParentConnection());
    document.addEventListener("bottom_connection", () => processBottomConnection());
    document.addEventListener("remove_answer", () => removeAnswer());*/
  });


  /**обновляет свойство parent, так как оно не динамическое*/
  function updateParent(nodes){
      
      for (let i = 0; i < nodes.length; i++) {
        const element = nodes[i];

        if(element["id"] !== id) continue;

        return element["parent_id"];      
      }
      
      return parent ;  
  }


    //проверяем дополнительные параметры, при создании связи
  function isParentConnectionPossible(connectInfo){
    const data = $nodes;
    var start = connectInfo.start;

    //  - блок не может подключится к блоку, у которого блок на который можно отправить связь
    //    который уже является дочерним

    //ищем узел по цепочке со значением стартового узла
    if(isStartInChain(id)) return false;


    if(start === parent) return false;

    return true;

    function isStartInChain(currentblockId){

      //console.log('[BOX]: {isStartInChain} currentBlockId: ', currentblockId);
        for(let i=0; i<data.length; i++){
            if(data[i]["id"] !== currentblockId) continue;
            
            let nextParentId = data[i]["parent_id"];
            if(!nextParentId) return false;
            
            if(nextParentId === start) {
              return true;
            };

            return isStartInChain(nextParentId);
        }
    }
  }

  /**функция, при попытки создать дочернюю связь, проверяет блоки к которым можно подключиться*/
  function isChildConnectionPossible(connectionInfo){
      if(!connectionInfo.start) return false;
      
      /**topblockchain определяется прик клике и является самым верхним блоком в цепочке.
       * к нему нельзя подключится, блоку который находится внизу той же цепи
      */
      if(connectionInfo.chainTopBlock === id)return false;

      if(parent) return false;

      return true;
  }
   



/**
 * ОБРАБОТКА ПЕРЕТАСКИВАНИЯ
 * 1. клик вниз
 * 2. активируем слушатель события mousemove.
 * 3. залочить pointerdown
*/
function startDraging(e){
    e.stopPropagation();
    let newX = x;
    let newY = y;
    let xToCompare = x;
    let yToCompare = y;

    if(e.target.tagName === "DIV" || e.target.tagName === "SPAN"){
        root.addEventListener("pointerup", () => {
          /**показываем поле с кнопками удалить, выделить текст на узле*/
          showButtons = true;
          root.removeEventListener("mousemove", coordinate); 
          if(xToCompare !== x && yToCompare !== y){
            //тут сохранение данных кординат
            controller.saveNourgent({node_id: id, field_name: "x", field_data: newX});
            controller.saveNourgent({node_id: id, field_name: "y", field_data: newY});
          }
          newX, newY = null;      
        }, {once: true});

        showButtons = false;
        root.addEventListener("mousemove", coordinate);
    }


    function coordinate(e){
        newX = x + e.movementX;
        newY = y + e.movementY;
        
        nodes.update( (allBlocks) => {
            for(let i = 0; i < allBlocks.length; i++){
              let obj = allBlocks[i];
              
              if(obj.id === id){
                  obj.x = newX;
                  obj.y = newY;
                  allBlocks[i] = obj;
                  break;
              }
            }

          return allBlocks;
        });
        
    }
}


function focusIn(e){
  
    //console.log("[BOX]: focusin handler: id", id);

    /*activeBlocks.update( (set) => {
        set.add(id);
        return set;
    });*/
    blockClickedId.set(id);

    $storeForSimpleTexts.forEach( (elObj) => {
        //console.log("[BOX]: trying to set active");
        elObj.setActive(id);
    });
    

    showButtons = true;
}


function focusOut(){

    if($storeForSimpleTexts){
      $storeForSimpleTexts.forEach( (elObj) => {
          elObj.setInactive(id);
      });
    }

    setTimeout( () => showButtons = false, 200);
}



function pointerEnter(){
    //тут возможно даже не надо блок активным типо делать.
    //только для симпл классов сделать вызовз метода hoverLike

    let elements = $storeForSimpleTexts;

    for(let i = 0; i < elements.length; i++){
        if(elements[i]["id"] !== id) continue;

        elements[i].setHoverLike();
        break;
    }

    elements = null;
}



function pointerLeave(){
    //тут возможно даже не надо блок активным типо делать.
    //только для симпл классов сделать вызовз метода inactive hoverlike

    let elements = $storeForSimpleTexts;

    for(let i = 0; i < elements.length; i++){
        if(elements[i]["id"] !== id) continue;

        elements[i].removeHoverLike();
        break;
    }

    elements = null;
}

function connectParentBlock(){
  //console.log("[BOX]: {connectParentBlock}");
  parentConnection.set( {
    start: id,
    end: null  
  } );
  setTimeout( () => document.addEventListener("click", connectCreationReset, {once: true}), 50);
  mouseLine.set({x, y, width, height, sign: "parent"});
}

/**создаем в сторе childConnection обьект
 * для старта отрисовки подстветки блоков которые можно подключить
 * их предварительно валидации
 * и продложения процесса подключения
*/
function connectChildBlock(){
    //перед создание обьекта в сторе 
    //необходимой найти самый верхний блок в цепочке.
    //его айди и пометим в chainTopBlock
    let chainTopBlock = undefined;
    let allNodes = $nodes;

    if(!parent) chainTopBlock = null;

    if(parent){
        chainTopBlock = searchForTopBlock(parent);
    }

    childConnection.set({
        start: id,
        end: null,
        chainTopBlock
     });
     
    setTimeout( () => document.addEventListener("click", connectCreationReset, {once: true}), 50);
    mouseLine.set({x, y, width, height, sign: "child"});


    function searchForTopBlock(blockId){
        //ищем блок с ай как parentId
        //смотри родителя этого блока
        //если родитель есть запускаем рекурсию с айди родителя
        //если нет родителя выходим из рекурсии с айди текущего блока

        for (let i = 0; i < allNodes.length; i++) {
            const element = allNodes[i];

            if(element['id'] !== blockId) continue;

            if(element["parent_id"]) return searchForTopBlock(element["parent_id"]);
            break;            
        }

        return blockId;
    }   
}


/**функция для улавливания второго клика при создании связи*/
async function secondStepOnParentConnect(e){

  /**если второй клик сам на себя, но до этого мы делаем проверкой и так это невозможным*/
  if($parentConnection.start === id){
    parentConnection.set(false);
    return;
  }

  parentConnection.update( (connectObj) => {
      connectObj.end = id;
      //console.log('[BOX]: {secondStep}, setting end id. received object', connectObj)
      return connectObj;
  });

  let store = $parentConnection;
  parentConnection.set(false);
  /**перед тем как обновить данные в самом приложении, отправляем данные на сервер
   * connectObj.start айди блока в котором необходимо установить parent_id
  */
  controller.saveNourgent({
            node_id: store.start, 
            field_name: "parent_id", 
            field_data: store.end
          });

  let {success} = await controller.sendDataInQueue();

  if(!success){
      document.dispatchEvent( new CustomEvent("error", {detail: {
        err_data: [
            {
                blockId: 0,
                message: "Не удалось сохранить блоки! Возможно один из блоков содержит неверный формат данных!",
                err_id: 1002,
                err_type: "emergency"
            }
          ]  
        }}));
      return;
  }
  

  nodes.update( (nodes) => {
      for (let i = 0; i < nodes.length; i++) {
          const element = nodes[i];


          /**secondStepOnParentConnect функция работает при создании связи,
           * срабатывает на втором кликнутом блоке. тоесть на блоке который мы выбираем как родитель.
           * чтобы установить правильного родителя, мы теперь должны найти блок, с которого начинался
           * процесс. стартовый блок.
          */
          if(element["id"] != store.start) continue;

          

          if(!element.parent_id){
            element.parent_id = store.end;
          } else {
            console.log("[Line creation error]: родитель уже назначен");
          }
          
          /*console.log('[BOX]: nodes update ', {
            element,
          });*/

          break;
      } 

    return nodes;
  });

  linesStore.update( ( lines ) => {
    lines.push({
        startId: store.start,
        endId: store.end
      });
    return lines;
  });

  console.log('[box.svelte]: {secondStepOnParentConnect} stores were update, going to call callback update');
  controller.updateCallBack();
}
/* [end] функция добавления связи*/


async function secondStepOnChildConnect(e){
    console.log("WORKING");
    childConnection.update( (connectObj) => {
      connectObj.end = id;
      console.log('[BOX]: {secondStep}, setting end id. received object', connectObj)
      return connectObj;
    });
    
    let store = $childConnection;
    childConnection.set(false);
    
    /**перед тем как обновить данные в самом приложении, отправляем данные на сервер
    * connectObj.start айди блока в котором необходимо установить parent_id
    */
    controller.saveNourgent({
            node_id: store.end, 
            field_name: "parent_id", 
            field_data: store.start
          });

    let {success} = await controller.sendDataInQueue();

    if(!success){
        document.dispatchEvent( new CustomEvent("error", {detail: {
                      err_data: [
                          {
                              blockId: 0,
                              message: "Не удалось сохранить блоки! Возможно один из блоков содержит неверный формат данных!",
                              err_id: 1002,
                              err_type: "emergency"
                          }
                      ]
                  }}));
        return;
    }


    /**обновляем данные в графе nodes*/
    nodes.update( (nodes) => {
        for (let i = 0; i < nodes.length; i++) {
            const element = nodes[i];

            if(element['id'] !== id) continue;

            element.parent_id = store.start;
            return nodes;
        }
    });

    linesStore.update( ( lines ) => {
      lines.push({
          startId: store.end,
          endId: store.start
        });
      return lines;
    });

    controller.updateCallBack();
}


function startDelete(e){
  if(e.key === "Delete"){
    deleteFlow(id, controller);
  }
}

</script>

<!-- bind:this={boxRootElement} -->
<!-- bind:this={boxElement} -->
  

    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <foreignObject {x} {y} {width} {height} 
      class="box_wrapper"
      class:glow
      class:isBlockChoosen
      bind:this={boxElement}
      tabindex=0
      role="tab"
      on:pointerdown={ startDraging }
      on:click={ () => blockClickedId.set(id)}
      on:focus={ focusIn }
      on:blur={ focusOut }
      on:pointerenter={ pointerEnter }
      on:pointerleave={ pointerLeave }
      on:dragstart={ (e) => e.preventDefault()}
      on:keydown={ startDelete }
      >
            <div class="box"
             
            class:hoverLike
            class:box_inactive
            class:not_valid>
              <BoxInner {name} {node_type} 
              {gotConditions}
              isLinked={ (parent) ? true : false }
            />
            </div>
    </foreignObject>

          
    {#if isBlockChoosen}
        {#if pointUp}
        <!--  Расчет центра точки квадрата считаем, координата икс(начало блока) + ширина блока/2 - ширина самой кнопки -->
          <foreignObject width="12" height="12" x={x + width / 2 - 6} y={y - 6}
          class="point" 
          role="button"
          on:click={connectParentBlock}>
            <BoxPoint />
          </foreignObject>
        {/if}


        {#if pointDown}
        <!--  Расчет центра точки квадрата считаем, координата икс(начало блока) + ширина блока/2 - ширина самой кнопки -->
          <foreignObject width="12" height="12" x={x + width / 2 - 6} y={y + height - 6}
          class="point" 
          role="button"
          on:click={connectChildBlock}
          >
            <BoxPoint />
          </foreignObject>
        {/if}
    {/if}

    {#if showButtons}
          <foreignObject  
          class="show_buttons" 
          width="16" {height} 
          x="{x + width + 6}" 
          {y}>
              <BoxButtons {id} {node_type} {box_inactive}/>
          </foreignObject>
    {/if}


<!-- СТИЛИ  -->
<style>
    .box_wrapper{
        outline: none;
        background-color: transparent;
        fill: none;
    }

    /** стандартное отображение */
    .box{
        background-color: var(--light-blue);
        color: var(--middle-blue);
        fill: var(--middle-blue);
        border-radius: 8px;
        transition: color 400ms ease, background 400ms ease, fill 400ms ease;
        outline: none;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
    }

    .box:hover{
        color: var(--orange);
        fill: var(--orange);
    }
    /**********/

    /** неактивные блоки */
    .box_inactive{
        background-color: var(--light-blue);
        color: var(--gray-blue);
        fill: var(--gray-blue);
    }


    .box_inactive:hover,
    .hoverLike{
        fill: var(--pale-orange);
        color: var(--pale-orange);
    }


    /** выбранные блок */
    .isBlockChoosen > .box{
        color: var(--deep-blue);
        background-color: var(--orange);
        fill: var(--deep-blue);
        z-index: 100;
    }

    .isBlockChoosen:hover > .box{
        background-color: var(--pale-orange);
        fill: var(--deep-blue);
        color: var(--deep-blue);
    }
    /***********/


    .point{
        color: var(--orange);
        transition: color 600ms ease-in-out;
    }

    
    .isBlockChoosen:hover~.point{
        color: var(--pale-orange);
    }

    .not_valid{
      background-color: var(--pumpkin);
    }

    .not_valid.box{
        fill: var(--deep-blue);
        color: var(--deep-blue);
    }

    .not_valid.box:hover{
        background-color: var(--peach);
    }


    .glow{
      filter: drop-shadow(0 0 6px var(--orange));
    }

    /**Buttons*/
    .show_buttons{
        position: relative;
        z-index: 15;
    }
</style>