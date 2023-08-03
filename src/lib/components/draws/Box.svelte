<script>
  import { onMount } from "svelte";
  import { drawRoot, nodes } from "$lib/scripts/stores"
  import { linesStore, activeBlocks, storeForSimpleTexts, blockClickedId } from "$lib/scripts/stores";
  import boxClickHandler from "$lib/scripts/eventHandlers/boxClickHandler";
	import BoxInner from "./BoxInner.svelte";
  import BoxPoint from "./BoxPoint.svelte";


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
    trigger = ""
  } = node;
  /****/
  $: pointDown = (parent) ? false : true; // отображать ли кнопку подключения связи вниху
  let pointUp = true;  // отображать ли кнопку подключения связи вверху
  //let boxRootElement;
  let root;
  
  $: isBlockChoosen = ($blockClickedId === id)? "isBlockChoosen" : ""; 
  $: hoverLike = ($activeBlocks.has(id)) ? "isBlockChoosen" : "";

  /**определяем какого вида границу блока рисовать. зависит от наличия условия триггера и condition в data <= $nodes
  */
  $: gotConditions = (condition && !(trigger == undefined || trigger == '' || trigger === null)) ? true : false;
  
  
/**переопределние класс отображение не активного блока, если флаг актив false*/
  $: box_inactive = (active) ? "" : "box_inactive";


  /** обновляются данные блока и связанные визуализации, при взаимодействии с другими частями блока*/
  nodes.subscribe( (allBlocksValues) => {

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
        
        parent = obj.parent || parent;
        width = obj.width  || width;
        height = obj.height || height;
    });
  });


  /** если при первоначальное загрузке есть связь с блоком родителя, 
   * то рисуем линию, рисуется через стор
  */
  if(parent){
    linesStore.update( (arrayOfDataObj) => {
      //console.log("[BOX]: saving lines data: ", arrayOfDataObj);

      arrayOfDataObj.push({
        startId: id,
        endId: parent
      });

      return arrayOfDataObj;
    });
  }


  onMount( () => {
    try{
      root = $drawRoot;
    } catch {
      console.log('[BOX]: no root to draw');
    }
  });


/**
 * ОБРАБОТКА ПЕРЕТАСКИВАНИЯ
 * 1. клик вниз
 * 2. активируем слушатель события mousemove.
 * 3. залочить pointerdown
*/
function startDraging(e){
    e.stopPropagation();

    if(e.target.tagName === "DIV" || e.target.tagName === "SPAN"){
        root.addEventListener("pointerup", () => {
          root.removeEventListener("mousemove", coordinate);       
        });
        root.addEventListener("mousemove", coordinate);
    }


    function coordinate(e){
        let target = e.target.closest('div');
        let newX = x + e.movementX;
        let newY = y + e.movementY;

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


/**
 * Логика добавления новой связи блока
*/
function addConnection(e){
    //console.log("addconnection");
    boxClickHandler(id);

    e.stopPropagation();
}


function focusIn(){
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
}


function focusOut(){

    //console.log("[BOX.FOCUSOUT]: block id, delete: ", id);

    /*activeBlocks.update( ( set ) => {
        set.delete(id);
        return set;
    });*/
    blockClickedId.set(id);

    $storeForSimpleTexts.forEach( (elObj) => {
        elObj.setInactive(id);
    });
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



</script>




<!-- bind:this={boxRootElement} -->
  

    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <foreignObject {x} {y} {width} {height} 
      class:isBlockChoosen 
      class:hoverLike
      class:box_inactive
      tabindex=0
      role="tab"
      on:pointerdown={ startDraging }
      on:click={ () => blockClickedId.set(id)}
      on:focus={ focusIn }
      on:blur={ focusOut }
      on:pointerenter={ pointerEnter }
      on:pointerleave={ pointerLeave }
      class="box">
          <BoxInner {name} {node_type} 
              {gotConditions}
              isLinked={ (parent) ? true : false }
              />
    </foreignObject>


          
    {#if isBlockChoosen}
        {#if pointDown}
        <!--  Расчет центра точки квадрата считаем, координата икс(начало блока) + ширина блока/2 - ширина самой кнопки -->
          <foreignObject width="12" height="12" x={x + width / 2 - 6} y={y - 6}
          class="point">
            <BoxPoint />
          </foreignObject>
        {/if}


        {#if pointUp}
        <!--  Расчет центра точки квадрата считаем, координата икс(начало блока) + ширина блока/2 - ширина самой кнопки -->
          <foreignObject width="12" height="12" x={x + width / 2 - 6} y={y + height - 6}
          class="point">
            <BoxPoint />
          </foreignObject>
        {/if}
    {/if}



<style>

    /** стандартное отображение */
    .box{
        background-color: var(--light-blue);
        color: var(--middle-blue);
        fill: var(--middle-blue);
        border-radius: 8px;
        transition: color 600ms ease-in-out, background 600ms ease-in-out, fill 600ms ease-in-out;
        outline: none;
        display: flex;
        justify-content: center;
        align-items: center;
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
    .isBlockChoosen{
        color: var(--deep-blue);
        background-color: var(--orange);
        fill: var(--deep-blue);
    }

    .isBlockChoosen:hover{
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

    
</style>