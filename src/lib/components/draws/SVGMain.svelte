<script context="module">
    export function getCors(){
        const svgMain = document.getElementById("playground");

        return svgMain.getBoundingClientRect();
    }
</script>


<script>
    import { drawRoot, linesStore, nodes, showDeleteStore, deleteLineFunction } from "$lib/scripts/stores";
    import Line from "$lib/components/draws/Line.svelte";
    import Box from "$lib/components/draws/Box.svelte";
	import PresentationLine from "$lib/components/draws/PresentationLine.svelte";
	import { onDestroy } from "svelte";
    import { tweened } from "svelte/motion";
    import { get } from "svelte/store";
    import { sineOut } from "svelte/easing";

let freezed = false;

let animationTime = 150;
let height = 3000;
let width = 3000;
let viewHeight = tweened(3000, {
    duration: animationTime,
    easing: (t) => t
});

let minviewHeight = 1000;
let maxviewHeight = 8000;

/** obtain connection with svg element*/
function svgLoaded(...args){        
    let svgRoot;

    if(args[0].tagName === 'svg'){
        svgRoot = args[0]
    };

    if(svgRoot){
        drawRoot.set(svgRoot);
    } else {
        console.error("no draw/SVG root");
    }
}

let allNodes;


$: allNodes = $nodes;
$: length = allNodes.length;
$: linesLength = lines.length;
$: showDelete = $showDeleteStore;
$: deleteLine = $deleteLineFunction;
$: lines = $linesStore;
$: console.log("~~~~TEST LINES~~~~,", {lines});
//$: if(lines) lines = lines;
//$: if(allNodes) allNodes = allNodes;
//$: console.log("[SVGMAIN]: allNodes: ", allNodes);
    onDestroy( () => {
        linesStore.set([]);
    });

    /**@description функция меняет маштаб при прокрутке
     * для изменения маштаба используются значения viewHeight, viewWidth
     * обработка события wheel происходит только при зажатой клавишем ctrl
    */
    function wheel(e){
        let {deltaY, ctrlKey} = e;
        if(!ctrlKey) return;
        if(freezed) {
            e.preventDefault();
            return;
        }
        e.preventDefault();

        let height = get(viewHeight);

        if(deltaY < 0){
            freezed = true;
            viewHeight.set(Math.floor(Math.max(deltaY * 5 + height, minviewHeight)));
        } else if (deltaY > 0){
            freezed = true;
            viewHeight.set(Math.floor(Math.min(deltaY * 5 + height, maxviewHeight)));
        }
        setTimeout( () => freezed = false, animationTime);
    }

</script>


<div class="svg_wrapper" on:wheel={wheel}>
    
    <svg id="playground" {width} {height} viewbox="0 0 {$viewHeight} {$viewHeight}" use:svgLoaded>
        <PresentationLine />
        {#key linesLength}
            <g id=lines>
                {#each lines as {startId, endId}}
                    
                    <Line {startId} parentId={endId}/>
                    
                {/each}  
            </g>
        {/key}
        
        {#key length}
        <g id="nodes">
            {#each allNodes as node, i}
                
                <Box {node}/>
                
            {/each}        
        </g>
        {/key}


        {#if showDelete}
            <foreignObject class="close" 
            x={showDelete.deleteButtonX} 
            y={showDelete.deleteButtonY} 
            width={showDelete.width} 
            height={showDelete.height}
            on:click={deleteLine}>
                <div>
                    <svg>
                        <use href="/assets/icons/all.svg#plus"></use>
                    </svg>
                </div>
            </foreignObject>
        {/if}
    </svg>
</div>


<style>
    .svg_wrapper{
        overflow-y: scroll;
        width: 100%;
        height: 100%;
        flex: 1;
        background-image: url("/assets/images/block_background.svg");
        background-repeat: repeat;
        background-color: var(--white-blue);
        background-origin: border-box;
        background-size: 24px;
        scrollbar-color: var(--gray-blue);
    }

    .close{
        filter: drop-shadow(0 0 3px var(--deep-blue));
        transform: translate(0);
    }


    .close div{
        background-color: var(--pumpkin);
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 6px;
        height: 100%;
        padding: .4rem;
        cursor: pointer;
        transition: background 400ms ease-out;
    }

    .close div:hover{
        background-color: var(--orange);
    }

    .close div svg{
        width: 100%;
        height: 100%;
        transform: rotateZ(45deg);
        fill: var(--white-blue);
    }


    /**webkit scrollbar */
    .svg_wrapper::-webkit-scrollbar{
        width: 8px;
    }

    .svg_wrapper::-webkit-scrollbar-thumb{
        background-color: var(--gray-blue);
        border-radius: 4px;
    }

    .svg_wrapper::-webkit-scrollbar-button{
        display: none;
    }

    .svg_wrapper::-webkit-scrollbar-track{
        background-color: transparent;
    }
</style>