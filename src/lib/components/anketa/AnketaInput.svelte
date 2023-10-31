<script>
    import TextArea from "$lib/components/CntrElem/TextArea.svelte";
    import { showTooltip } from "$lib/scripts/stores";
    import { setElementHoverLike, removeElementHoverLike} from "$lib/scripts/docElements/controllers/ElementsSideFocusBlurProcess.js"
    
    /*обьект данных из графа, конкретный для инпута*/
    export let id;
    export let name;
    export let content;
    export let data_type;
    export let description;

    /**@description управляет изменением цвета, когда курсор заходит на элемент.
     * иметирует ховер
    */
    let hoverBackground = false;



    /*описывает hover сосотояние на элементе в текстовом редакторе.*/
    function setHoverLike(e){
        hoverBackground = true;
        const target = e.target;
        let {x: targetX, y: targetY} = target.getBoundingClientRect();
        console.log({targetY, target});
        targetY += 50;
        let {clientX, clientY} = e;
        let x, y;
        setElementHoverLike(id);
        if(!description) return;
        y = targetY;
        x = clientX;
       // console.log({targetY, clientY});

        showTooltip.set({show: true, coors: {x, y: y - 40}, text: description, place: "above"});
    }


    /*описывает removehover сосотояние на элементе в текстовом редакторе.*/
    function removeHoverLike(){
        hoverBackground = false;
        showTooltip.set({show: false});
        removeElementHoverLike(id);
    }
</script>



<div class="input_anketa"
on:pointerenter={setHoverLike}
on:pointerleave={removeHoverLike}
class:hoverBackground>
    <div class="input_anketa__name">
        <span>{name}</span>
    </div>
    <div class="input_anketa__input">
        <TextArea 
        --border-width="2px"
        --border-color="var(--gray-blue)"
        --border-color-hover="var(--pale-orange)"
        --placeholder="var(--gray-blue)"
        --font-size=".875rem"
        --padding=".5rem 1.25rem"
        --background="var(--white-blue)"
        --background-hover="var(--white-blue)"
        --color="var(--deep-blue)"
        node_id={id}
        id={id}
        name={name}
        value={content}
        data_type={data_type}/>
    </div>
</div>

<style>
    .input_anketa{
        display: flex;
        gap: 1rem;
        align-items: center;
        padding: .5rem;
        border-radius: 8px;
        transition: background 400ms ease;
    }

    .input_anketa.hoverBackground{
        background-color: var(--faded-light-blue);
    }

    .input_anketa__name{
        flex-basis: 6.8rem;
        flex-grow: 0;
        flex-shrink: 0;
    }

    .input_anketa__name span{
        color: var(--middle-blue);
    }

    .input_anketa__input{
        flex: 1 1;
    }
</style>