<script>
    import InterectiveElements from "$lib/components/InterectiveElements.svelte";
    import generateTextElements from "$lib/scripts/docWriter/generateTextElements";
    import DocWriter  from "$lib/components/DocWriter.svelte";
    import populateTextDataStore from "$lib/scripts/populateTextDataStore"

    //receiving data from load function
    export let data;

    let { locals } = data;
    let { html, graph } = locals.data;
    let cleanHtml = '';

    /*console.log("HTML: ", html);
    console.log("GRAPH: ", graph);*/

    if(locals.error){
        prompt(locals.error.message);
    }
    
    /*console.log("HTML on doc write: ", html);*/
    html = html.trim() + '';
    cleanHtml = html.match(/<body>[\s\S]*<\/body>/)[0];
    cleanHtml = cleanHtml.replace(/<body>/, "<div>")
                        .replace(/<\/body>/, "</div>");   
    /*console.log("DocWriter", cleanHtml);*/
    
    
    {   
        /** заполняем стор текстовых обьектов*/
        populateTextDataStore(graph);

        /** генерируем span элементы в строчном виде и вставляем их в разметку*/
        cleanHtml = generateTextElements(graph, cleanHtml);
    }
</script>

<main>
    <div class="element">
        <InterectiveElements {graph}/>
    </div>

    <!--<div class="devider"></div>-->

    <div class="element">
        <DocWriter html={cleanHtml} {graph}/>
    </div>
</main>

<style>
    main{
        display: flex;
        background-color: var(--main-bg);
        position: absolute;
        top: 0;
        left: 0;
        overflow-y: scroll;
        height: 100vh;
        width: 100vw;
    }

    .element{
        flex: 1;
    }

    .devider{
        width: 4px;
        height: 100%;
        background-color: black;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }
</style>