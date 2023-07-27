<script>
  import { nodes } from "$lib/scripts/stores";

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


    nodes.subscribe( (allBlocks) => {
        /*console.log("[LINE]: ", allBlocks);*/
        let parentToFind;
       
        for(let i = 0; i < allBlocks.length; i++){
            let obj = allBlocks[i];

            if(obj.id != startId || obj.parent_id != parentId) continue;
            
            if(obj.id){
                
                startX = obj.x;
                startY = obj.y;
                startHeight = obj.height;
                startWidth = obj.width;
                parentToFind = obj.parent_id
                
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
                console.log("[LINE]: nodes.subscribe", {
                    endX,
                    endY,
                    endHeight,
                    endWidth
                });
                break;
            }
        }

        d = drawLine()
        //console.log(`[LINE]:  insubscribe: `, allBlocks);  
    });


    //$: d;

    /**
     * функция прорисовывают линию
     * @param startBlock
     * @param endBlock
     */
   function drawLine(){   
        /*console.log("[Draw Line]");*/
        let startBlockCenter = startX  + (startWidth / 4);
        let endBlockX = endX + (endWidth / 4);
        let halfOfYBetweenBlocks = (startY - ( endY + endHeight)) / 2;
        let sign = (startBlockCenter - endBlockX > 0) ? 1 : -1;
        
        
        //console.log(`[obj.id checker] : `,);

        d=`
            M ${ startBlockCenter } ${ startY - (markerHeight / 2)}
            S ${ endBlockX } ${endY + endHeight + 52} ${endBlockX} ${ endY + endHeight }
        `
        
       /* d = `
            M ${startBlockCenter} ${ startY }
            l ${0} ${-halfOfYBetweenBlocks + 30}
            q 0 -30 ${20 * sign} ${-halfOfYBetweenBlocks + 30}
            Q ${endBlockX } ${(endY + endHeight) + 40} ${endBlockX} ${endY + endHeight + 10}
        `*/
        //console.log(`[LINE]: DRAWLINE: startId: ${startId} parentId: ${parentId}`, d);
        /*d=`
            M ${startBlockCenter} ${ startY + startHeight }
            t ${endBlockX - startBlockCenter} ${halfOfYBetweenBlocks * 2}
        `*/
    return d;
}



</script>

<!--   -->
<g use:drawLine>
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
    <path {d} marker-start="url(#arrow)"/>
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
        z-index: 0;
    }
</style>