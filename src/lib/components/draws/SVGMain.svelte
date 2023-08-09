<script>
    import { drawRoot, linesStore, nodes } from "$lib/scripts/stores";
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
</style>