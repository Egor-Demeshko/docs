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
	import CheckBoxWithLabel from "../../lib/components/nodeRedactor/CheckBoxWithLabel.svelte";
    import ToggleWhite from "$lib/components/nodeRedactor/ToggleWhite.svelte";
	import List from "../../lib/components/nodeRedactor/List.svelte";
    import Box from "$lib/components/draws/Box.svelte";

    let node_type;

    $: node_type;
    $: console.log("[PAGE]: selected: ", node_type);

</script>

<main>
    <div class="wrapper">
        <!-- Блок простых компонентов -->
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

        <div style="background-color: var(--middle-blue)">
            <ToggleWhite />
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

        <div style="background-color: var(--middle-blue)">
            <CheckBoxWithLabel/>
        </div>

        <div style="background-color: var(--middle-blue)">
            <List />
        </div>

        <div style="width: 100%">
            <svg style="width: 100%;">
                    <Box x={10} y={10} />
                    <Box x={250} y={10} id={2} active = {false}/>

            </svg>
        </div>
    </div>

    <aside>
        <!-- Блок составных компонентов -->
        <Form />
        <div style="max-width: 800px">
            <Tabs />
        </div>

        <div style="max-width: 400px; padding: 1rem 1.25rem; background-color: var(--middle-blue)">
            <Compare forId={"condition_test"}/>
        </div>

        <div style="width: 50vw; position: relative">
            <select bind:value={node_type} class="node-type__selector">
                <option value="" selected>Выбрать тип блока</option>
                <option value="entry">entry</option>
                <option value="text">text</option>
                <option value="checkbox">checkbox</option>
                <option value="radiobutton">radiobutton</option>
            </select>
            <NodeRedactor />
        </div>
    </aside>
</main>



<style>

    .node-type__selector{
        color: var(--middle-blue);
        padding: .5rem;
        position: absolute;
        left: 0;
        top: 1rem;
        transform: translateX(-100%);
    }


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