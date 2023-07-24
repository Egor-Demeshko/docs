<script>
    import Input from "$lib/components/CntrElem/Input.svelte";
    import Button from "$lib/components/CntrElem/Button.svelte";
    import Form from "$lib/components/Form.svelte";
	import SerachInput from "../../lib/components/CntrElem/SerachInput.svelte";
	import InputwithLabel from "../../lib/components/CntrElem/InputwithLabel.svelte";
    import Tabs from "$lib/components/Tabs/Tabs.svelte";
    import DropDown from "../../lib/components/CntrElem/DropDown.svelte";
    import { nodeOptions, compareOptions } from "$lib/scripts/stores";
	import AddButton from "../../lib/components/CntrElem/AddButton.svelte";
    import Toggle from "$lib/components/nodeRedactor/Toggle.svelte";
	import Arrow from "../../lib/components/nodeRedactor/Arrow.svelte";
	import ContentRedactor from "../../lib/components/nodeRedactor/ContentRedactor.svelte";
    import Compare from "$lib/components/nodeRedactor/Compare.svelte";
	import NodeRedactor from "../../lib/components/nodeRedactor/NodeRedactor.svelte";
</script>

<main>
    <div class="wrapper">
        <div>
            <Input --border-color="var(--middle-blue)"
            --color="var(--deep-blue)"
            --background="var(--light-blue)"
            --border-width="3px"
            --font-size="1.125rem"/>
        </div>
    
        <div>
            <Button fnToRunOnClick={ () => console.log("ПРИВЕТ")} name={"Вход"}
                --bg="var(--middle-blue)" --color="var(--white-blue)"
                --bg-hover="var(--white-blue)"
                --color-hover="var(--middle-blue)"
                --border="3px solid var(--middle-blue)"
                --border-hover="3px solid var(--white-blue)"
                --padding=".6rem 1.125rem"/>

        </div>

        <div style="background-color: var(--middle-blue)">
            <SerachInput />
        </div>

        <div style="color: var(--light-blue); background-color: var(--middle-blue)">
            <InputwithLabel />
        </div>

        <div style="background-color: var(--middle-blue)">
            <DropDown options={nodeOptions} name="node_type_test"
            --padding=".4rem 1.8rem .4rem .875rem"/>
        </div>

        <div style="--width: 3.375rem; --height: 3.375rem;">
            <AddButton />
        </div>

        <div>
            <Toggle />
        </div>

        <div style="width: 3.375rem; height: 3.375rem;">
            <Arrow />
        </div>

        <div style="background-color: var(--middle-blue);">
            <ContentRedactor placeholder={"Введите содержание блока"}/>
        </div>

        <div style="background-color: var(--middle-blue)">
            <DropDown options={compareOptions} name="condition_test" isWithIcon={false}
            --padding=".4rem 1.8rem .4rem .875rem"/>
        </div>
    </div>

    <aside>
        <Form />
        <div style="max-width: 800px">
            <Tabs />
        </div>

        <div style="max-width: 400px; padding: 1rem 1.25rem; background-color: var(--middle-blue)">
            <Compare forId={"condition_test"}/>
        </div>

        <div style="width: 50vw">
            <NodeRedactor />
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