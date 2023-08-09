<script>
  import { nodes, linesStore, showDeleteStore, deleteLineFunction } from "$lib/scripts/stores";

    export let startId = "";  //айди текущего блока
    export let parentId = "";   //айди родителя куда надо рисовать связь
    let d;

    let startX;
    let startY;
    let startHeight;
    let startWidth;

    let endX;
    let endY;
    let endWidth;
    let endHeight;

    let markerHeight = 8;

    let deleteButtonX = null;
    let deleteButtonY = null;

    let hoverlike = false;
    let width = 28;
    let height = 28;

    nodes.subscribe( (allBlocks) => {

        let parentToFind;   
       
        for(let i = 0; i < allBlocks.length; i++){
            let obj = allBlocks[i];

            if(obj.id != startId || obj.parent_id != parentId) continue;
            
            if(obj.id){
                //console.log("[LINE]: subscribe");
                startX = obj.x;
                startY = obj.y;
                startHeight = obj.height;
                startWidth = obj.width;
                parentToFind = obj.parent_id
                /*
                console.log("[LINE]: nodes.subscribe", {
                    startX,
                    startY,
                    startHeight,
                    startWidth
                });*/
                break;
            }
        }

        for(let i = 0; i < allBlocks.length; i++){
            let obj = allBlocks[i];

            if(obj.id === parentToFind){
                endX = obj.x;
                endY = obj.y;
                endHeight = obj.height;
                endWidth = obj.width;

                break;
            }
        }

        d = drawLine()
        //console.log(`[LINE]:  in subscribe: `, allBlocks);  
    });


    //$: d;

    /**
     * функция прорисовывают линию
     * @param startBlock
     * @param endBlock
     */
   function drawLine(){   
    
        //console.log("[Draw Line]");
        let startBlockCenter = startX  + (startWidth / 4);
        let endBlockX = endX + (endWidth / 4);
        let halfOfYBetweenBlocks = (startY - ( endY + endHeight)) / 2;
        let sign = (startBlockCenter - endBlockX > 0) ? 1 : -1;
        
        
        /*console.log(`[obj.id checker] : `, {
            startBlockCenter,
            endBlockX
        });*/

        d=`
            M ${ startBlockCenter } ${ startY - (markerHeight / 2)}
            S ${ endBlockX } ${endY + endHeight + 52} ${endBlockX} ${ endY + endHeight }
        `
/*
        {
            let endBlockY = endY + endHeight;
            //расчет точки для кнопки удалить связь
            let dx = (Math.abs(startBlockCenter - endBlockX)) / 2 - width / 2;
            let dy = (Math.abs(startY - endBlockY)) / 2 - height / 2;

            //deleteButtonX = (startBlockCenter > endBlockX) ? endBlockX + dx : startBlockCenter + dx;
            //deleteButtonY = (startY > endBlockY) ? endBlockY + dy + 28 : (startY + dy + endHeight - 28);
*/
            /*console.log('[Line]: {drawing delete button}: ', {
                deleteButtonY,
                startY,
                endBlockY,
                height,
                dy
            });*/
        /*}*/
        
    return d;
}

function clickHandle(e){

    deleteButtonX = e.pageX - width / 2;
    deleteButtonY = e.layerY - height * 1.5;
    showDeleteStore.set({
        deleteButtonX,
        deleteButtonY,
        width,
        height
    });
    deleteLineFunction.set(deleteLine);

    /**регистрируем слушатель чтобы убрать кнопку, если клик пришелся куда попало*/
    setTimeout( () => {

        document.addEventListener("click", () => {
            if($showDeleteStore){
                showDeleteStore.set(false);
            }
            if(deleteLineFunction){
                deleteLineFunction.set(false);
            }
        }, {once: true});

    }, 10);
}


function deleteLine(){
    //в nodes найти блок с id === start_id
    //удалить запись parent_id
    //найти линию по parent_id и start_id
    showDeleteStore.set(false);
   
    
    linesStore.update( (lines) => {
        return lines = lines.filter( (line) => {
            if( line['startId'] === startId && line["endId"] === parentId ){
                /*console.log('[Line]: linesStore update',{
                    "lineStart": line.startId,
                    "lineEndId": line["endId"],
                    startId,
                    parentId
                });*/
                return false;
            }
            return true;
        });
    });


    nodes.update( function(allNodes){
            /*console.log('[Line]: nodes.update:', {
                startId,
                parentId
            });*/
            
            for(let i = 0; allNodes.length; i++){
                const element = allNodes[i];
                
                if(element["id"] !== startId) continue;
                
                element["parent_id"] = null;
                break;
            }

            return allNodes;
    });


    /** используем для отложенного исполения срабатывания обновления node. от этого зависит 
     * прорисовка линий. если убрать, то сразу после удаление линия не исчеснет.
     * тут уж такая архитектурная реализация.
    */
    setTimeout(() => {
        nodes.update( (nodes) => nodes);
    }); 

    deleteLineFunction.set(false);
}


function pointerEnter(){
    hoverlike = true;
}

function pointerLeave(){
    hoverlike = false;
}

</script>

<!--   -->
<g use:drawLine >
    <defs>
        <!-- A marker to be used as an arrowhead -->
        <marker
          id="arrow"
          viewBox="0 0 8 8"
          refX="4"
          refY="4"
          markerWidth="8"
          markerHeight={markerHeight}
          orient="auto-start-reverse">
          <path d="M 0 0 L 8 4 L 0 8 z" />
        </marker>
      </defs>
    <path {d} class:hoverlike marker-start="url(#arrow)"/>
    <path {d} class="invisible_twin" 
    on:pointerenter={pointerEnter} 
    on:pointerleave={pointerLeave}
    on:click={clickHandle}/>

</g>

<style>
    marker path{
        fill: var(--middle-blue);
    }


    path{
        fill: none;
        stroke: var(--middle-blue);
        stroke-width: 1;
        stroke-linecap: round;
        width: 4px;
        transition: filter 400ms ease-in-out, stroke 400ms ease-in-out;
    }


    path.hoverlike{
        filter: drop-shadow(0 0 2px var(--pumpkin));
        stroke: var(--deep-blue);
    }


    .invisible_twin{
        fill: none;
        stroke-opacity: 0;
        stroke-width: 10;
    }

</style>