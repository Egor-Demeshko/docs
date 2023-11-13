<script>
	import { onMount } from "svelte";

    /**@type {htmlElement}*/
    export let whereToSearch;
    export let MarkOfElementsToSearchFor;

    /**@type {string[]} дополнительные элементы которые необходимо скрыть в процессе поиска*/
    export let sideElementsToBeHidden;
    const freeze = 500;
    let eventsDone = false;
    /**@type {htmlElement[]}*/
    let allSideElementsToBeHidden = [];

    /**@type {htmlElement[]}
     * элементы в которых ищем текст*/
    let elements = [];
    /**@type {htmlElement[]}*/
    let lines = [];


    

    function search(e){
        if(whereToSearch === undefined || whereToSearch === null) return;
        if (MarkOfElementsToSearchFor === undefined | MarkOfElementsToSearchFor === null) return;

        /**делаем поиск по элементам, которые мы найдем чере MarkOfElementsToSearchFor
         * htmlElement в котором ищем элемент будет в переменной whereToSearch
         * также будет через settimeout и в флаг freeze задержка между поиском
         * 
         * TODO:
         * 0. перед стартом поиска вешаем событий для отслеживание клавиши esc и pointerclick
         * поэтим события сбрасываем все. элементы все видимые становятся.
         * очищаем input 
         * 1. находим все элемент предназначенные для поиска.
         * 2. делаем все элементы visibility:hidden
         * 3. сохраняем ссылку dom на элемент и текстовые данные.
         * 4. делаем поиск по текстовым данным элементам 
         * 5. элементы в которых есть совпадение остаются видимыми, остальные скрываются
         * 7.
         * 
        */
        const target = e.target;
        let searchValue = e.target.value;

        /**инициализируем события, а также находим элементы для поиска.
         * на этот флаг поиск элементов ориентируется чтобы исключить поиск лементов на каждый вводи инпута
        */
        if(!eventsDone){
            eventsDone = true;
            document.addEventListener("keydown", keyDown);
            document.addEventListener("click", pointerDown);
            elements = whereToSearch.querySelectorAll( MarkOfElementsToSearchFor);
            allSideElementsToBeHidden = searchForSideElements();
        }

        makeInvisible();
        if(elements === null) return;
        if(searchValue === ''){
            makeAllVisible();
            return;
        }
        //ищем domэлементы
        searchForText(searchValue);


        /** при нажатии esc сбрасываем все*/
        function keyDown(e){
            if(e.key === "Escape"){
                document.removeEventListener("keydown", keyDown);
                eventsDone = false;
                target.value = "";
                makeAllVisible();
            }
        }
        
        /**или при нажатии мыши сбрасываем все*/
        function pointerDown(){
            document.removeEventListener("pointerdown", pointerDown);
            eventsDone = false;
            target.value = "";
            makeAllVisible();
        }
    }

    /**
     * Делает все элементы в массиве 'elements' невидимыми, 
     * устанавливая их свойство visibility на "hidden".
     * Также скрывает все элементы в массиве 'allSideElementsToBeHidden'.
     */
    function makeInvisible(){
        
        // Скрываем элементы в массиве 'elements'
        for(let i = 0; i < elements.length; i++){
            elements[i].style.visibility = "hidden";
        }

        // Скрываем элементы в массиве 'allSideElementsToBeHidden'
        for(let i = 0; i < allSideElementsToBeHidden.length; i++){
            allSideElementsToBeHidden[i].style.visibility = "hidden";
        }
    }


    function makeAllVisible(){
        // Скрываем элементы в массиве 'elements'
        for(let i = 0; i < elements.length; i++){
            elements[i].style.visibility = "visible";
        }

        // Скрываем элементы в массиве 'allSideElementsToBeHidden'
        for(let i = 0; i < allSideElementsToBeHidden.length; i++){
            allSideElementsToBeHidden[i].style.visibility = "visible";
        }
    }


    function searchForSideElements(){
        let allSideElements = [];
        for(let i = 0; i < sideElementsToBeHidden.length; i++){
            let el = whereToSearch.querySelectorAll(sideElementsToBeHidden[i]);
            if(el === null) continue;
            allSideElements = [...allSideElements, ...Array.from(el)];
        }
        return allSideElements;
    }


    /**
     * Ищет текст в элементах и соответствующим образом устанавливает их видимость.
     * @param {string} text - Текст для поиска.
     */
    function searchForText(text){
        let textForSearch = text.toLowerCase();

        for(let i = 0; i < elements.length; i++){
            let el = elements[i];
            // Проверяем, содержит ли внутренний текст элемента искомый текст
            if( el.textContent.toLowerCase().includes(textForSearch.toLowerCase()) ){
                el.style.visibility = "visible"; // Показываем элемент
            } else {
                el.style.visibility = "hidden"; // Скрываем элемент
            }
        }
    }
</script>


<div>
    <input type="text" placeholder="Найти блок по имени" name="searchInput" on:input={search}>
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M0.666504 7.8916C0.666504 3.90138 3.86679 0.666664 7.81454 0.666664C9.71031 0.666664 11.5284 1.42786 12.869 2.7828C14.2095 4.13774 14.9626 5.97543 14.9626 7.8916C14.9626 11.8818 11.7623 15.1165 7.81454 15.1165C3.86679 15.1165 0.666504 11.8818 0.666504 7.8916ZM14.8443 13.7119L16.9732 15.4303H17.0101C17.4408 15.8657 17.4408 16.5715 17.0101 17.0068C16.5794 17.4422 15.8811 17.4422 15.4504 17.0068L13.6838 14.9821C13.5167 14.8138 13.4229 14.5853 13.4229 14.347C13.4229 14.1086 13.5167 13.8801 13.6838 13.7119C14.0059 13.392 14.5222 13.392 14.8443 13.7119Z" fill="#DDE6ED"/>
    </svg>
</div>

<style>
    div{
        max-width: 15rem;
        position: relative;
    }


    input{
        border: none;
        border-bottom: 1px solid var(--light-blue);
        background-color: var(--middle-blue);
        padding: 0.09rem 0 0.22rem;
        width: 100%;
    }


    input::placeholder{
        color: var(--faded-gray-blue);
        font-style: italic;
        font-size: 0.875rem;
    }

    input:focus{
        border: none;
        border-bottom: 1px solid var(--light-blue);
        outline: none;
    }

    svg{
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
    }
</style>