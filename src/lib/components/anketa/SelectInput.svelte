<script>
    import RadioLabel from "$lib/components/anketa/RadioLabel.svelte";

    export let text = "Название поля";
    export let name = "list"; 
</script>

<div class="wrapper">
    <div class="name">
        <span>{text}</span>
    </div>
    <div class="inputs">
        <RadioLabel {name}/>
        <RadioLabel {name}/>
        <RadioLabel {name}/>
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