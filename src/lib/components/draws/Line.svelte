<script>
  import { connections } from "$lib/scripts/stores";

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


    connections.subscribe( (allBlocks) => {
        /*console.log("[LINE]: ", allBlocks);*/
        let parentToFind;
       
        for(let i = 0; i < allBlocks.length; i++){
            let obj = allBlocks[i];

            if(obj.id != startId || obj.parent != parentId) continue;
            
            if(obj.id){
                
                startX = obj.x;
                startY = obj.y;
                startHeight = obj.height;
                startWidth = obj.width;
                parentToFind = obj.parent
                
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
        let startBlockCenter = startX + (startWidth / 2);
        let endBlockCenter = endX + (endWidth / 2);
        let halfOfYBetweenBlocks = (startY - ( endY + endHeight)) / 2;
        let sign = (startBlockCenter - endBlockCenter > 0) ? 1 : -1;


        //console.log(`[obj.id checker] : `,);

        d=`
            M ${ startBlockCenter } ${ startY }
            S ${ endBlockCenter } ${endY + endHeight + 52} ${endBlockCenter} ${ endY + endHeight + 8 }
        `
        
       /* d = `
            M ${startBlockCenter} ${ startY }
            l ${0} ${-halfOfYBetweenBlocks + 30}
            q 0 -30 ${20 * sign} ${-halfOfYBetweenBlocks + 30}
            Q ${endBlockCenter } ${(endY + endHeight) + 40} ${endBlockCenter} ${endY + endHeight + 10}
        `*/
        //console.log(`[LINE]: DRAWLINE: startId: ${startId} parentId: ${parentId}`, d);
        /*d=`
            M ${startBlockCenter} ${ startY + startHeight }
            t ${endBlockCenter - startBlockCenter} ${halfOfYBetweenBlocks * 2}
        `*/
    return d;
}



</script>


<g use:drawLine>
    <path {d}/>
</g>

<style>
    path{
        fill: none;
        stroke: rgb(89, 0, 255);
        stroke-width: 4;
        stroke-linecap: round;
        z-index: 0;
    }
</style>