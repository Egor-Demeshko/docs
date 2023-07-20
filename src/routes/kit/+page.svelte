<script>
    import Input from "$lib/components/CntrElem/Input.svelte";
    import Button from "$lib/components/CntrElem/Button.svelte";
    import Form from "$lib/components/Form.svelte";
	import SerachInput from "../../lib/components/CntrElem/SerachInput.svelte";
	import InputwithLabel from "../../lib/components/CntrElem/InputwithLabel.svelte";
    import Tabs from "$lib/components/Tabs/Tabs.svelte";
</script>

<main>
    <div class="wrapper">
        <div>
            <Input/>
        </div>
    
        <div>
            <Button fnToRunOnClick={ () => console.log("ПРИВЕТ")} name={"Вход"}
                --bg="var(--middle-blue)" --color="var(--white-blue)"
                --bg-hover="var(--white-blue)"
                --color-hover="var(--middle-blue)"
                --border="3px solid var(--middle-blue)"
                --border-hover="3px solid var(--white-blue)"/>
        </div>

        <div style="background-color: var(--middle-blue)">
            <SerachInput />
        </div>

        <div style="color: var(--light-blue); background-color: var(--middle-blue)">
            <InputwithLabel />
        </div>
    </div>

    <aside>
        <Form />
        <div style="max-width: 600px">
            <Tabs />
        </div>
    </aside>
</main>



<style>
    main{
        display: flex;
        flex-flow: column;
        align-items: center;
        gap: 2rem;
        background-color: var(--light-blue);
        color: var(--middle-blue);
    }
    .wrapper{
        display: flex;
        gap: 1.125rem;
        flex-wrap: wrap;
    }

    div{
        padding: 1rem;
        min-width: 200px;
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    aside{
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        width: 100%;
        border-top: 6px solid var(--deep-blue);
        padding: 2rem;
    }
</style>