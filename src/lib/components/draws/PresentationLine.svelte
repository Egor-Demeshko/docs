<script>
    import { mouseLine, drawRoot } from "$lib/scripts/stores";
	import { onDestroy, onMount } from "svelte";
    /** точка старта линии, обычно середина стартаблока*/
    let startX; 
    let startY;
    /**то что будем получать от курсора мыши*/
    let endX = 0; 
    let endY = 0; 
    let showLine = false;
    let d= '';
    let blockSign = '';
    let blockWidth;
    let blockHeight;

    mouseLine.subscribe( ( infoObj ) => {
        if(infoObj){
            let{ x, y, width, height, sign } = infoObj;


            startX = x;
            startY = y;
            endX = x + width / 4;

            if(sign === "child"){
                endY = y + height;
            } else if(sign === "parent"){
                endY = y;
            }
            blockSign = sign;
            blockWidth = width;
            blockHeight = height;

            showLine = true;

            drawLine();
        } else {
            showLine = false;
            if($drawRoot){
                $drawRoot.removeEventListener("mousemove", updateCors);
            }
        }
    });


    function drawLine(){
        if(blockSign === "parent"){
            d = `
                M ${startX + blockWidth / 4} ${startY}
                S ${endX} ${endY} ${endX} ${endY}
            `

        } else if(blockSign  === "child"){   
            d = `
                M ${startX + blockWidth / 4} ${startY + blockHeight}
                S ${endX} ${endY} ${endX} ${endY}
            `
        }
    }


    function updateCors(e){
        let dy = $drawRoot.getBoundingClientRect();
        endX = e.pageX;
        endY = +(e.pageY - dy.y).toFixed(0);
        drawLine();
        console.log("[UPDATECORS], ", {endX, endY});
    }


    function startEvent(){
        if($drawRoot){
            $drawRoot.addEventListener( "mousemove", updateCors );
        }
    }

</script>

{#if showLine}
    <defs use:startEvent>
        <!-- A marker to be used as an arrowhead -->
        <marker
        id="arrow"
        viewBox="0 0 8 8"
        refX="4"
        refY="4"
        markerWidth="8"
        markerHeight={8}
        orient="auto-start-reverse">
        <path d="M 0 0 L 8 4 L 0 8 z" />
        </marker>
    </defs>
    <path {d} marker-end="url(#arrow)"/>
{/if}

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
