<script>
    import { drawRoot, linesStore, nodes, showDeleteStore, deleteLineFunction } from "$lib/scripts/stores";
    import Line from "$lib/components/draws/Line.svelte";
    import Box from "$lib/components/draws/Box.svelte";
	import PresentationLine from "$lib/components/draws/PresentationLine.svelte";

let height = 3000;
let width = "100%";

/** obtain connection with svg element*/
function svgLoaded(...args){        
    let svgRoot;

    if(args[0].tagName === 'svg'){
        svgRoot = args[0]
    };

    if(svgRoot){
        drawRoot.set(svgRoot);
    } else {
        console.log("no draw/SVG root");
    }
}


$: showDelete = $showDeleteStore;
$: deleteLine = $deleteLineFunction;
$: console.log("[SVGMAIN]: showdelete, ", showDelete);
$: console.log("[SVGMAIN]: deleteLine, ", deleteLine);
$: lines = $linesStore;
$: if(lines) lines = lines;

</script>


<div class="svg_wrapper">
    <svg id="playground" {width} {height} viewBox={`0 0 ${width} ${height}`} use:svgLoaded>
        <PresentationLine />
        <g id=lines>
            {#each lines as {startId, endId}}
                <Line {startId} parentId={endId}/>
            {/each} 
        </g>
        {#each $nodes as node}
            <Box {node} />
        {/each}

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
        overflow: scroll;
        width: 100%;
        height: 100%;
        flex: 1;
        background-image: url("/assets/images/block_background.svg");
        background-repeat: repeat;
        background-color: var(--white-blue);
        background-origin: border-box;
    }

    .close{
        filter: drop-shadow(0 0 3px var(--deep-blue));
        transform: translate(0);
        z-index: 10;
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
    }
</style>