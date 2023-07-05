<script>
    import generateTextElements from "$lib/scripts/docWriter/generateTextElements";
	import { onMount } from "svelte";
    import { storeForSimpleTexts } from "$lib/scripts/stores";

    /** @description разметка документа */
    export let html = '';

    /**@description массив обьектов, описывающие переменные */
    export let graph;

    /** @description корневой элемент документа*/
    let root;
    let cleanHtml = '';

    /*console.log("HTML on doc write: ", html);*/
 
    html = html.trim() + '';
    cleanHtml = html.match(/<body>[\s\S]*<\/body>/)[0];
    cleanHtml = cleanHtml.replace(/<body>/, "<div>")
                        .replace(/<\/body>/, "</div>");   
    /*console.log("DocWriter", cleanHtml);*/

    /**
     * проходим по массиву обьектов. находим айди, индекс. берем ближайший p
     * берем иннерHTML и меняем в строке айди на span с айди.
     * получаем этот элемент по айди и создаем класс.
     * в классе будет логика для получения значений из переменных, а также если там меняется что-то
     * чтобы менялось сразу в тексте.
    */
    {   
        cleanHtml = generateTextElements(graph, cleanHtml);
    }

    onMount( () => {
        /**objects of text elements should be connected with there representinal elements*/
        $storeForSimpleTexts.forEach( (element) => element.connect(root));

        /*console.log("$storeForSimpleTexts: ", $storeForSimpleTexts[0].domLinks);*/
    });

</script>


<section bind:this={root}>
    <div class="document">
        {@html cleanHtml}
    </div>
</section>


<style>
    section{
        padding:2rem 2rem;
        height: 100%;
        min-width: 600px;
        border-left: 2px solid var(--black);
    }

    .document{
        background-color: var(--white);
        box-shadow: 0 0 4px var(--black);
        height: 100%;
        border-radius: 10px;
        padding: 1rem;
        overflow-y: scroll;
    }
</style>