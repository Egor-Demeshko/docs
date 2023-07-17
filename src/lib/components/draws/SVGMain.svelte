<script>
    import { drawRoot, linesStore, connections } from "$lib/scripts/stores";
    import Line from "$lib/components/draws/Line.svelte";
    import Box from "$lib/components/draws/Box.svelte";

let height=3000;
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

</script>


<div class="svg_wrapper">
    <svg id="playground" {width} {height} viewBox={`0 0 ${width} ${height}`} use:svgLoaded>
        <g id=lines>
            {#each lines as {startId, endId}}
                <Line {startId} parentId={endId}/>
            {/each} 
        </g>
        {#each $connections as {id, name}}
            <Box {id} {name}/>
        {/each}
    </svg>
</div>

<style>
    .svg_wrapper{
        overflow: scroll;
        width: 100%;
        height: 600px;
    }

    #playground{
        background-color: lightgray;
    }
</style>