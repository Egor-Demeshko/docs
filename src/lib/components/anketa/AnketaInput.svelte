<script>
    import TextArea from "$lib/components/CntrElem/TextArea.svelte";
    export let data;

    let name = "Имя поля";
</script>



<div class="input_anketa">
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
        --color="var(--deep-blue)"/>
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