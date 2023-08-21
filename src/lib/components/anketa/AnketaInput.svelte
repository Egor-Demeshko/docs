<script>
    import TextArea from "$lib/components/CntrElem/TextArea.svelte";
    import { setElementHoverLike, removeElementHoverLike} from "$lib/scripts/docElements/controllers/ElementsSideFocusBlurProcess.js"
    export let data;

    let name = data.name;


    function setHoverLike(){
        setElementHoverLike(data.id);
    }

    function removeHoverLike(){
        removeElementHoverLike(data.id);
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
        id={data.id}
        name={data.name}/>
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