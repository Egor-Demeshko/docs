<script>
    import {getHtml} from "$lib/scripts/docWriter/redactor.js";
    import { printCallback } from "$lib/scripts/stores";
    let pages;
    let wrapper;
    let page;

    /**отобразить контейнер для подсчета количества страниц и размера печати*/
    let show = false;

    printCallback.set(startPrintingProcess);

    async function startPrintingProcess(){
        /**фсинхронно чтобы обновиться внутреннее состояние редактора, до того как пойдет на печать*/
        let html = await getHtml();
        wrapper.classList.add("show");
        page.innerHTML = html;

        /**коллекция DOM элементов в докумете*/
        let elements = page.children;
        /**максимальная высота области для расчета y координаты элемента
         * относительно wrapper, вообще высота листа 11,7 инча, но 
         * у нас есть отступы по 1см сверху и снизу. учитываем отступ сверху
         * 1 см, получаем 11,3 инча*/
        const innerPageHeight = 11.3;
        const pixelRate = Math.floor(innerPageHeight * 96 / window.devicePixelRatio);
        /**высота области, где будет текст*/
        const pixelRateForPages = Math.floor((innerPageHeight - 0.394) * 96 / window.devicePixelRatio);
        //вычисляем количество страниц. чтобы точно понимать сколько разрывов надо создать
        
        const pages = Math.ceil(page.offsetHeight / pixelRateForPages);
        /**когда найдем элемент который будет около 1132 болтаться, то создаем разрыв */
        for ( let j = 1; j <= pages; j++){
            for( let i = 0; i < elements.length; i++ ){
                /**
                 * если элемент больше pixelRate, а прошлый элемент меньше, то
                 * прошлый элемент будет последний элементом на странице, создаем
                 * новый div и дальше распологаем элементы
                 */
        
                const element = elements[i];
                let previousElement = (i > 0) ? elements[i - 1] : undefined;

                if(element.offsetTop + element.offsetHeight >= pixelRate &&
                    previousElement &&
                    previousElement.offsetTop + previousElement.offsetHeight < pixelRate){
                    elements = gartherRestElements(element);
                    
                    /**создаем новый div*/
                    const newDiv = document.createElement("div");
                    newDiv.classList.add("print__page");
                    
                    newDiv.append(...elements);
                    
                    wrapper.append(newDiv);
                    break;
                } 
            }
        
        }
        window.print();

        /**после отправки на печать, очищаем элемент, оставляем первую страницу*/
        {
            const pages = wrapper.children;
            const pagesLength = pages.length - 1;
            
            for(let i = pagesLength; i >= 0; i--){
                const el = pages[i];
                if(i === 0){
                    /**у первый страницы удаляем всех дитей*/
                    const firstPage = el.children;
                    const lastLegth = firstPage.length - 1;
                    for(let i = lastLegth; i >= 0; i--){
                        firstPage[i].remove();
                    }
                } else {
                    /**все остальные страницы просто удаляем*/
                    el.remove();
                }
            };

            wrapper.classList.remove("show");
        }

    }

    /**проблема, последний элемент, которые должен быть один на след. странице может не попасть
     * сейчас element?.nextElementSibling кидает null и стркоа elements.add(element) не срабатывает
    */
    function gartherRestElements(element){
        const elements = new Set([element]);

        while(true){
            if(element?.nextElementSibling){    
                elements.add(element);

                let nextElement = element?.nextElementSibling;
                element.remove();
                element = nextElement;
            } else {
                element?.remove();
                break;
            }
        }
        return Array.from(elements);
    }
</script>

<div class="print__wrapper" bind:this={wrapper} class:show>

        <div class="print__page" bind:this={page}></div>
        <!--<div style="break-after: always;"></div> -->

</div>

<style>
    .print__wrapper{
        display: none;
    }

    .print__wrapper.show{
        display: block;
        position: fixed;
        left: -1500px;
        top: 0;
        background-color: aliceblue;
    }

    :global(.print__page){
        padding: 10mm 10mm 10mm 20mm;
        width: 210mm;
        color: var(--deep-blue);
        position: relative;
    }

    @media print{
        .print__wrapper{
            display: block;
        }


        .print__wrapper.show{
            position: relative;
            left: 0;
            top: 0;
        }


        :global(.print__page){
            position: relative;
            page-break-before: always;
        }


        :global(.print__page *){
            color: var(--deep-blue);
        }

        
        @page{
            size: A4;
            margin:  0 0 0 0;
        }
    }
</style>