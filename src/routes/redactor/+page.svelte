<script>
    import generateTextElements from "$lib/scripts/docWriter/generateTextElements";
    import DocWriter  from "$lib/components/DocWriter.svelte";
    import { nodes, documents } from "$lib/scripts/stores";
    import SVGMain from "$lib/components/draws/SVGMain.svelte";
    import createMassive from "$lib/scripts/createMassive";
	import NodeRedactor from "$lib/components/nodeRedactor/NodeRedactor.svelte";
	import TopControllBar from "$lib/components/TopControllBar.svelte";
	import Tabs from "$lib/components/Tabs/Tabs.svelte";

	import AddButton from "$lib/components/CntrElem/AddButton.svelte";
    import MessagesContainer from "$lib/components/MessagesContainer.svelte";
    import Tooltip from "$lib/components/CntrElem/Tooltip.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import Documents from "$lib/scripts/controllers/documents/Documents.js";

    //receiving data from load function
    export let data;

    let { locals } = data;
    let { html, graph } = locals.data;
    let cleanHtml = '';

    console.log("HTML: ", html);
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
        "view_type": "select",
		"content": "красный",
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
    }
}


html = [
        {   
            id: "15-17-18",
            string: `HTML:  <!DOCTYPE html>
                    <html>
                    <head>
                        <title> %project_name% </title>
                        </head>
                        <body>
                            <p>город %id=(1)%</p>
                            <p>%id=(2)% года</p>
                            <p>%id=(3)%, именуемый в дальнейшем «Арендодатель», с одной стороны и %id=(4)%, в дальнейшем
                                именуемый «Арендатор», именуемые в дальнейшем совместно «Стороны»,
                        заключили настоящий договор о нижеследующем:</p>
                        
                        
                        <h1>1. Предмет договора</h1>
                        <p>1.1. Арендодатель предоставляет за плату, а Арендатор принимает во
                            временное владение и пользование %id=(5)% (далее – «Объект»), расположенного по адресу: %id=(6)%,
                            общей площадью %id=(7)% кв. см. Объект принадлежит
                            Арендодателю на основании договора купли-продажи.</p>
                            
                            
                            <h1>2. Права и обязанности сторон</h1>
                            <p>2.1. Арендатор обязан:</p>
                            <p>2.1.2. Содержать Объект в технически исправном, надлежащем санитарном и
                                соответствующем противопожарном состоянии.</p>
                                <p>2.1.3. Не производить никаких перепланировок и переоборудования
                                    арендуемых помещений без письменного разрешения Арендодателя.</p>
                                    <p>2.1.4. Любой ремонт Объекта, перенос инженерных сетей и коммуникаций
                                        выполнять только с письменного разрешения Арендодателя.</p>
                                        <p>%id=(8)%</p>
                                        
                                        <h1>3. Платежи и расчеты по Договору</h1>
                                        <p>3.1. Арендатор оплачивает Арендодателю арендную плату в размере %id=(9)% рублей в
                                            месяц. Оплата производится до %id=(10)% числа ежемесячно за текущий месяц.</p>
                                            <p>3.2. В течение рабочих дней с момента подписания акта приема-передачи
                                                Объекта Арендатор обязан внести арендную плату за текущий месяц, а также
                                                перечислить на счет Арендодателя сумму, равную размеру арендной платы за
                                                один месяц, в качестве страхового платежа.</p>
                                                
                                                <h1>%id=(11)%</h1>
                                                <p>%id=(12)%</p>
                                                </body>
                                        </html>`,
            name: "Название документа 1"
        },
        
        {
            id: "15-6-19",
            string: `<body>
                    <p>это совсем другой тестовый документ,  %id=(1)% даже абзац этот поменяли %id=(2)% года</p>
                    <p>%id=(3)%, именуемый в дальнейшем «Арендодатель», с одной стороны и %id=(4)%, в дальнейшем
                        именуемый «Арендатор», именуемые в дальнейшем совместно «Стороны»,
                    заключили настоящий договор о нижеследующем:</p>
                    
                    
                    <h1>1. Предмет договора</h1>
                    <p>Sed ut perspiciatis unde omnis iste natus error sit %id=(5)% accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas 
                        sit aspernatur aut odit aut fugit, sed %id=(5)% consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. 
                        Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, %id=(6)%, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate 
                        velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas %id=(6)% pariatur?</p>
                        
                        
                    <h1>2. Права и обязанности сторон</h1>
                    <p>2.1. Арендатор обязан:</p>
                    <p>2.1.2. Содержать Объект в технически исправном, надлежащем санитарном и
                    соответствующем противопожарном состоянии.</p>
                    <p>2.1.3. Не производить никаких перепланировок и переоборудования
                        арендуемых помещений без письменного разрешения Арендодателя.</p>
                        <p>2.1.4. Любой ремонт Объекта, перенос инженерных сетей и коммуникаций
                            выполнять только с письменного разрешения Арендодателя.</p>
                            <p>%id=(8)%</p>
                            
                            <h1>3. Платежи и расчеты по Договору</h1>
                            <p>3.1. Арендатор оплачивает Арендодателю арендную плату в размере %id=(9)% рублей в
                                месяц. Оплата производится до %id=(10)% числа ежемесячно за текущий месяц.</p>
                                <p>3.2. В течение рабочих дней с момента подписания акта приема-передачи
                                    Объекта Арендатор обязан внести арендную плату за текущий месяц, а также
                                    перечислить на счет Арендодателя сумму, равную размеру арендной платы за
                                    один месяц, в качестве страхового платежа.</p>
                                    
                                    <h1>%id=(11)%</h1>
                                    <p>%id=(12)%</p>
                                    </body>`,
            name: "Название документа 2"
        }
    ]
    
    if(locals.error){
        prompt(locals.error.message);
    }

    /**делаем из графа массив*/
    /* также задаем значения по умолчанию, если их нет*/
    graph = createMassive(graph);
    /* сохраняем граф в стор*/
    nodes.set(graph);
    
    
    
    const docs = new Documents(html, graph);
    /**заполняем стор документов*/
    documents.set(docs);

</script>



<div class="redactors">

        <div class="element element__left">
            <MessagesContainer />
            <!--<Tabs tabsPosition={"left"} tabNames={["Схема 1"]}/>-->
            <TopControllBar />
            <AddButton --width="3.4rem" --height="3.4rem"/>
            <SVGMain />
            <NodeRedactor />
        </div>

        <!--<div class="devider"></div>-->

        <div class="element">
            <Tabs tabsPosition={"document"} documents={$documents.docs}/>
            <DocWriter />
        </div>
</div>  


<Tooltip />
<Modal />




<style>

    .element{
        flex: 2;
        width: 100%;
        position: relative;
    }

    .element__left{
        flex: 3;
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