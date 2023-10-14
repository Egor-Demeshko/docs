<script>
    import TextArea from "$lib/components/CntrElem/TextArea.svelte";
    import { setElementHoverLike, removeElementHoverLike} from "$lib/scripts/docElements/controllers/ElementsSideFocusBlurProcess.js"
    
    /*обьект данных из графа, конкретный для инпута*/
    export let id;
    export let name;
    export let content;
    export let data_type;


    /*описывает hover сосотояние на элементе в текстовом редакторе.*/
    function setHoverLike(){
        setElementHoverLike(id);
    }

    /*описывает removehover сосотояние на элементе в текстовом редакторе.*/
    function removeHoverLike(){
        removeElementHoverLike(id);
    }
</script>



<div class="input_anketa"
on:pointerenter={setHoverLike}
on:pointerleave={removeHoverLike}>
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