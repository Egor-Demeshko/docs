<script>
    import generateTextElements from "$lib/scripts/docWriter/generateTextElements";
    import DocWriter  from "$lib/components/DocWriter.svelte";
    import populateTextDataStore from "$lib/scripts/controllers/populateTextDataStore";
    import populateSvgBlocksStore from "$lib/scripts/controllers/populateSvgBlocksStore";
    import SVGMain from "$lib/components/draws/SVGMain.svelte";
	import BlockRedactor from "$lib/components/BlockRedactor.svelte";

    //receiving data from load function
    export let data;

    let { locals } = data;
    let { html, graph } = locals.data;
    let cleanHtml = '';

    /*console.log("HTML: ", html);*/
    /*console.log("GRAPH: ", graph);*/

    //TODO убрать тестовую реализацию графа
    graph = {
        "1": {
		"parent_id": null,
		"name": "Имя узла",
		"description": "узел с текстом",
		"data_type": "string",
		"node_type": "text",
		"content": "Рандомный текст",
		"condition": null,
		"trigger": null,
		"x": 10,
		"y": 50,
		"activ": true
	},	
	
	"2": {
		"parent_id": 1,
		"name": "Имя узла",
		"description": "узел c полем ввода",
		"data_type": "string",
		"node_type": "entry",
		"content": "fghfhf",
		"condition": null,
		"trigger": null,
		"x": 250,
		"y": 50,
		"activ": true
	},
	
	"3": {
		"parent_id": 1,
		"name": "Имя узла",
		"description": "узел c чекбоксом",
		"data_type": "bool",
		"node_type": "checkbox",
		"content": true,
		"condition": null,
		"trigger": null,
		"x": 10,
		"y": 300,
		"activ": true
	},
	
	"4": {
		"parent_id": 1,
		"name": "Имя узла",
		"description": "узел c радиобатоном - единственный выбор. При выборе добавляем в content одно из значений options (в дочерних узлах должны быть соответствующие зависимости)",	
		"data_type": "string",
		"node_type": "radiobutton",
		"options": ["красный","зелёный","синий"],
		"content": "зелёный",
		"condition": null,
		"trigger": null,
		"x": 300,
		"y": 300,
		"activ": true
	},
	
	"5": {
		"parent_id": 2,
		"name": "Имя узла",
		"description": "узел с зависимостями, condition сравнивает content верхнего узла со своим trigger (операторы: gt, lt, gte, lte, equal, not_equal, in, not_in, in_range, not_in_range)",	
		"data_type": "integer",
		"node_type": "text",
		"content": "Рандомный текст",
		"condition": "equal", 
		"trigger": 2500.00,
		"x": 10,
		"y": 450,
		"activ": true
	}
}

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
        /**разделяем блочно/визуальную и текстовые составляющие графа*/
        /** заполняем стор текстовых обьектов*/
        populateTextDataStore(graph);
        populateSvgBlocksStore(graph);

        /** генерируем span элементы в строчном виде и вставляем их в разметку*/
        cleanHtml = generateTextElements(graph, cleanHtml);
    }


        /**TODO receive from graph*/
        //connections.set(graph);
</script>



<main>
    <div class="element element__left">
        <SVGMain />
        <!--<BlockRedactor />-->
    </div>

    <!--<div class="devider"></div>-->

    <div class="element">
        <DocWriter html={cleanHtml}/>
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
        width: 100%;
    }

    .element__left{
        height: 100vh;
        display: flex;
        flex-direction: column;
    }

   /* .devider{
        width: 4px;
        height: 100%;
        background-color: black;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }*/
</style>