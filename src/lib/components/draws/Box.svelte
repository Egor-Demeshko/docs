<script>
  import { onMount } from "svelte";
  import { drawRoot, connections } from "$lib/scripts/stores"
  import { linesStore, activeBlocks, blockClickedId } from "$lib/scripts/stores";
  import boxClickHandler from "$lib/scripts/eventHandlers/boxClickHandler";
  
  export let id; 
  export let name;
  let text; // var for text element
  $: textWidth = 0;
  $: textHeight = 0;
  
  /**block coordinates and sizes data*/
  let x = 0;
  let y = 0;
  let parent = undefined;
  let width = 200;
  let height = 100;
  /****/

  let fill = "grey";
  let pointDown = true;
  let pointUp = true;
  let boxRootElement;
  let strokeWidth = 4;
  let stroke = "black";
  let root;
  
  $: active = ($activeBlocks.has(id)) ? $activeBlocks.get(id) : false;
  

  /** обновляются данные в случае перетаскивания блока*/
  connections.subscribe( (allBlocksValues) => {
    allBlocksValues.forEach( ( obj )=> {
      if(obj.id !== id) return;
        x = obj.x;
        y = obj.y;
        parent = obj.parent;
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
    centerText();
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

    if(e.target.tagName === "rect"){
        root.addEventListener("pointerup", () => {
          root.removeEventListener("mousemove", coordinate);
          
        });
        root.addEventListener("mousemove", coordinate);
    }


    function coordinate(e){
        x = e.layerX - width / 2;
        y = e.layerY - height / 2;

        connections.update( (allBlocks) => {
            for(let i = 0; i < allBlocks.length; i++){
              let obj = allBlocks[i];
              
              if(obj.id === id){
                  obj.x = x;
                  obj.y = y;
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


/**
 * центруем текст в svg элементе
*/
function centerText(){
      let { width, height } = text.getBoundingClientRect();
      textWidth = width;
      textHeight = height;
}

</script>



  <g bind:this={boxRootElement} class:active {width} {height} viewport>

      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <rect {x} {y} {width} {height} {fill} stroke-width={strokeWidth} {stroke} rx="6" 
      on:pointerdown={startDraging}
      on:click={ () => blockClickedId.set(id) }
      />

      <text x={x + width / 2 - textWidth / 2} 
      y={y + height / 2 + textHeight / 2} 
      bind:this={text} 
      >{name}</text>
      
      {#if pointDown}
          <circle class:pointDown cx={(x + width - width / 2)} cy={y + height} r="8" on:click={addConnection}/>
      {/if}

      {#if pointUp}
          <circle class:pointUp cx={(x + width - width / 2)} cy={y} r="8"/>
      {/if}
  </g>

<style>
    .pointDown,
    .pointUp{
        fill: red;
        stroke: grey;
        stroke-width: 2px;

    }

    g{
      transition: filter 600ms ease;
      z-index: 10;
      position: relative;
    }

    g:hover{
      filter: drop-shadow(0 0 4px #ff3434);
    }

    .active{
        filter: drop-shadow(0 0 4px orange);
    }

    text{
      font-size: 20px;
      text-align: center;
    }



</style>