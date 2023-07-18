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
    graph = [
        {   
            id: 1,
            x: 10,
            y: 50,
            parent: undefined,
            height: 100,
            width: 200,
            name: "город",
            content: "Буржуйск"
        },
        {   
            id: 2,
            x: 10,
            y: 300,
            parent: undefined,
            height: 100,
            width: 200,
            name: "дата",
            content: "10.01.2035"
        },
        {   
            id: 3,
            x: 140,
            y: 300,
            parent: undefined,
            height: 100,
            width: 200,
            name: "Сторона договора 1",
            content: "Иванов Иван Иваныч"
        },
        {   
            id: 4,
            x: 300,
            y: 300,
            parent: undefined,
            height: 100,
            width: 200,
            name: "Сторона договора 2",
            content: "Сергеев Сергей Сергеевич"
        },
        {   
            id: 5,
            x: 10,
            y: 450,
            parent: undefined,
            height: 100,
            width: 200,
            name: "Предмет договора",
            content: "Сыча"
        },
        {   
            id: 6,
            x: 300,
            y: 450,
            parent: undefined,
            height: 100,
            width: 200,
            name: "Адрес обьекта",
            content: "г. Буржуйск, ул. Строителей из себя, д.315, кв.73",
        },
        {   
            id: 7,
            x: 600,
            y: 450,
            parent: undefined,
            height: 100,
            width: 200,
            name: "Площадь обьекта",
            content: "573",
        },
        {   
            id: 8,
            x: 10,
            y: 600,
            parent: undefined,
            height: 100,
            width: 200,
            name: "Порядок сдачи объекта",
            content: "2.1.5. Письменно сообщить Арендодателю (не поздее чем за один месяц) о предстоящем освобождении Обьекта как в связи с окончанием срока действия договора, так и при досрочном освобождении и сдать Обьект по акту приемапередачи Арендодателю",
        },
        {   
            id: 9,
            x: 300,
            y: 600,
            parent: 1,
            height: 100,
            width: 200,
            name: "Арендная плата",
            content: "100500.00",
        },
        {   
            id: 10,
            x: 600,
            y: 600,
            parent: undefined,
            height: 100,
            width: 200,
            name: "Дата оплаты",
            content: "29",
        },
        {   
            id: 11,
            x: 10,
            y: 850,
            parent: undefined,
            height: 100,
            width: 200,
            name: "Раздел доп. условия",
            content: "4. Дополнительные условия",
        },
        {   
            id: 12,
            x: 140,
            y: 850,
            parent: undefined,
            height: 100,
            width: 200,
            name: "Доп. условие 4.1",
            content: "4.1 Арендатор обязан вернуть 2х сычей",
        }
]

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
        <BlockRedactor />
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