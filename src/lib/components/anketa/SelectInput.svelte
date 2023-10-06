<script>
    import RadioLabel from "$lib/components/anketa/RadioLabel.svelte";
    import { setElementHoverLike, removeElementHoverLike, setElementActive, setElementInactive } from "$lib/scripts/docElements/controllers/ElementsSideFocusBlurProcess";
    import elementsDataUpdate from "$lib/scripts/controllers/elementsDataUpdate";

    export let data;

    let {options, name, id} = data;
    const controller = getContext("controller");
    console.log("[SelectInput]: {initizialization}: data", data);

    /**Более расширенная версия options с добавление selected, сразу тут помечаем какой элемент выбран*/
    let derivedOptions = [];

    for(let i = 0; i < options.length; i++){
        let option = options[i];

        if(option === data.content){
            derivedOptions.push( {
                selected: true,
                text: options[i]
            } );
        } else {
            derivedOptions.push( {
                selected: false,
                text: options[i]
            } );
        }
    }


    function setHoverLike(){
        setElementHoverLike(data.id);
    }


    function removeHoverLike(){
        removeElementHoverLike(data.id);
    }


    function focusIn(e){
        e.stopPropagation();
        const target = e.target;

        if(target.tagName !== "INPUT") return;
        setElementActive(data.id);
    }


    function focusOut(e){
        e.stopPropagation();
        const target = e.target;

        if(target.tagName !== "INPUT") return;
        setElementInactive(data.id);
    }   


    function inputHandler(e){
        //читаем value из event
        //прошлый элемент selected делаем false
        //делаем его selected
        //через updateContent обновляем значение на редакторе текста
        //так как на data с анкеты не отправляется на сервер, нет большого смысла пока обновлять data
        let value = e.target.value;

        for(let i = 0; i < derivedOptions.length; i++){
            let element = derivedOptions[i];

            if(element.selected) derivedOptions[i].selected = false;

            if(element.text === value) derivedOptions[i].selected = true;
        }
        
        //console.log("[SelectInput]: {inputHandler} derivedoptions: ", derivedOptions);
        updateContent();
    }


    function updateContent(){
        let content = '';
        derivedOptions.forEach( (value) => {
            if(value.selected) content = value.text;
        });

        elementsDataUpdate({id, name, content});

        $controller.saveData({node_id: data.id, content});
    }
</script>

<div class="wrapper" 
on:pointerenter={setHoverLike}
on:pointerleave={removeHoverLike}
on:focusin={focusIn}
on:focusout={focusOut}>
    <div class="name">
        <span>{name}</span>
    </div>
    <div class="inputs" on:input={inputHandler}>

        {#each derivedOptions as {text}}
            <RadioLabel {name} {text}/>
        {/each}
    </div>
</div>


<style>
    .wrapper{
        display: flex;
        gap: 1.5rem;
        padding: 1rem 0;
    }


    .name{
        flex-basis: 6.8rem;
        flex-grow: 0;
        flex-shrink: 0;
    }

    .name span{
        color: var(--middle-blue);
    }

    .inputs{
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
</style>