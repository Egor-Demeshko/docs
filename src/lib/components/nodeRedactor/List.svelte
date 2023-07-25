<script>
    import Input from "../CntrElem/Input.svelte";
    import InputwithLabel from "../CntrElem/InputwithLabel.svelte";

    /**из графа это options*/
    let listElements = [
        "Нежилое помещение в строящемся здании",
        "Нежилое помещение в отдельно строящемся здании"
    ];

</script>

<form id="list" class="list__wrapper">
    <span class="list__name">Элементы списка</span>
    <div class="list">
        {#each listElements as value, i}
        {#if i === 0}
            <InputwithLabel view_type={"list"} label={"Значение по-умолчанию"} id={`list_${i}`}
            {value}
            --color="var(--deep-blue)"
            --border="2px solid var(--middle-blue)"
            --label-color="var(--middle-blue)"
            --padding="0.375rem 1rem"/>
        {:else}
            <div class="list__options">
                {#if i === 1}
                    <span class="list__additional">Дополнительные значения:</span>
                    <Input {value} placeholder={"Введите название элемента списка"} id={`list_${i}`}         
                    --color="var(--deep-blue)"
                    --border-width="2px"
                    --border-color="var(--middle-blue)"
                    --padding="0.375rem 1rem"
                    --font-size=".875rem"/>
                {:else}
                    <Input {value} placeholder={"Введите название элемента списка"} id={`list_${i}`}             
                    --color="var(--deep-blue)"
                    --border-width="2px"
                    --border-color="var(--middle-blue)"
                    --padding="0.5rem 1rem"
                    --font-size=".875rem"/>
                {/if}
        
                <button>Добавить элемент</button>
            </div>
            {/if}
        {/each}

    </div>
</form>

<style>

    .list{
        border-radius: 15px;
        background-color: var(--light-blue);
        padding: 1rem 1.5rem 1rem 1rem;
        height: 100%;
    }

    .list__wrapper{
        display: flex;
        flex-flow: column;
        gap: .25rem;
        width: 100%;
        color: var(--middle-blue);
    }

    .list__name{
        color: var(--white-blue);
        font-size: .875rem;
    }

    .list__options{
        width: 100%;
        display: flex;
        flex-flow: column;
        gap: .375rem;
    }

    .list__additional{
        display: block;
        margin-top: 1rem;
        font-size: .875rem;
        color: var(--middle-blue);
    }

    button{
        border: none;
        background-color: var(--middle-blue);
        padding: .2rem;
        font-size: .875rem;
        width: 100%;
        margin-top: .1rem;
        border-radius: 10px;
    }
</style>