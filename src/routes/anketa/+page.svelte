<script>
    import generateTextElements from "$lib/scripts/docWriter/generateTextElements";
    import DocWriter  from "$lib/components/DocWriter.svelte";
    import { nodes } from "$lib/scripts/stores";
    import createMassive from "$lib/scripts/createMassive";
	import TopControllBar from "$lib/components/TopControllBar.svelte";
	import Tabs from "$lib/components/Tabs/Tabs.svelte";
    import MessagesContainer from "$lib/components/MessagesContainer.svelte";
    import Tooltip from "$lib/components/CntrElem/Tooltip.svelte";
    import Modal from "$lib/components/Modal.svelte";
	import InputElements from "../../lib/components/anketa/InputElements.svelte";

    //receiving data from load function
    export let data;

    let { locals } = data;
    let { html, graph } = locals.data;
    let cleanHtml = '';

    /*console.log("HTML: ", html);*/
    //console.log("GRAPH: ", graph);

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
		"active": true
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
		"active": true
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
		"active": true
	},
	
	"4": {
		"parent_id": 1,
		"name": "Имя узла",
		"description": "узел c радиобатоном - единственный выбор. При выборе добавляем в content одно из значений options (в дочерних узлах должны быть соответствующие зависимости)",	
		"data_type": "string",
		"node_type": "select",
		"options": ["красный","зелёный","синий"],
        "view_type": "radiobutton",
		"content": "зелёный",
		"condition": null,
		"trigger": null,
		"x": 300,
		"y": 300,
		"active": true
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
		"active": true
	},

    "6": {
        "parent_id": null,
		"name": "Не привязанный узел",
		"description": "узел с зависимостями, condition сравнивает content верхнего узла со своим trigger (операторы: gt, lt, gte, lte, equal, not_equal, in, not_in, in_range, not_in_range)",	
		"data_type": "string",
		"node_type": "text",
		"content": "Текст не привязанного блока",
		"condition": null, 
		"trigger": null,
		"x": 300,
		"y": 450,
		"active": true,
        "validity": {
            "status": "invalid",
            "err_data": [
                {
                    "field_name": "content",
                    "message": "Выбран тип данных число, а введены текстовые символы."
                }
            ]
        }
    },

    "7": {
        "parent_id": null,
		"name": "НЕАКТИВНЫЙ",
		"description": "вариант неактивного узла",	
		"data_type": "string",
		"node_type": "text",
		"content": "Очень важный текст в договоре",
		"condition": null, 
		"trigger": null,
		"x": 550,
		"y": 350,
		"active": false
    },
    "8": {
        "parent_id": 1,
		"name": "НЕАКТИВНЫЙ",
		"description": "вариант неактивного узла со связью",	
		"data_type": "string",
		"node_type": "text",
		"content": "Очень важный текст в договоре",
		"condition": "equal", 
		"trigger": "строка триггер",
		"x": 50,
		"y": 550,
		"active": false,
    },
    "11": {
        "parent_id": 5,
		"name": "Имя узла",
		"description": "узел c радиобатоном - единственный выбор. При выборе добавляем в content одно из значений options (в дочерних узлах должны быть соответствующие зависимости)",	
		"data_type": "string",
		"node_type": "select",
		"options": ["Книга","Шарик","Кубик"],
        "view_type": "drop_list",
		"content": "Книга",
		"condition": null,
		"trigger": null,
		"x": 50,
		"y": 800,
		"active": true
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
        /**делаем из графа массив*/
        /* также задаем значения по умолчанию, если их нет*/
        graph = createMassive(graph);

        
        /* сохраняем граф в стор*/
        nodes.set(graph);


        /** генерируем span элементы в строчном виде и вставляем их в разметку*/
        cleanHtml = generateTextElements(graph, cleanHtml);
    }
</script>



<div class="redactors">

        <div class="element element__left">
            <TopControllBar />
            <InputElements />
        </div>

        <!--<div class="devider"></div>-->

        <div class="element">
            <Tabs id={"right"} tabNames={["Договор аренды помещения и еще больше текста", "Акт приема", "еще один акт прием"]}/>
            <DocWriter html={cleanHtml}/>
        </div>
</div>  


<Tooltip />
<Modal />




<style>

    .element{
        flex: 3;
        width: 100%;
        position: relative;
    }

    .element__left{
        flex: 1.5;
        height: 100%;
        display: flex;
        flex-direction: column;
        display: relative;

    }


    .redactors{
        display: flex;
        position: absolute;
        top: 5.5rem;
        left: 0;
        gap: 1.5rem;
        height: calc(100% - 5.5rem);
        width: 100%;
    }




   /* .devider{
        width: 4px;
        height: 100%;
        background-color: black;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }*/

    @media print{
        .logo_position{
            display: none;
        }

        .element__left{
            display: none;
        }

        .background{
            display: none;
        }
    }
</style>