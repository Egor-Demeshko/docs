<script>
	import DropDown from "../CntrElem/DropDown.svelte";
    import Input from "$lib/components/CntrElem/Input.svelte";
    import { compareOptions } from "$lib/scripts/stores"; 

    export let forId = "condition_rule";
    export let id;
    export let trigger;

</script>


<div class="wrapper">
    <label id="condition_label" for={forId}>Активен, если родительский блок ...</label>


    <div class="line">
        <DropDown {id} buildTypeid={forId} isWithIcon={false} name="condition" options={compareOptions}
        --padding=".125rem 1.8rem .125rem 1rem"
        --padding-options=".125rem 1rem"/>

        <!--<div style="width: 100%">-->

            <Input {id} placeholder={"значение"}
            bind:value={trigger} name={"trigger"}
            --border-color="var(--light-blue)"
            --padding=".1rem 1rem"
            --color="inherit"
            --background="transparent"
            --border-width="2px"
            --font-size=".875rem"
            />
        <!--</div>-->
    </div>
</div>


<style>
    .wrapper{
        background-color: transparent;
        width: 100%;
        transform: translateZ(0);
    }

    label{
        display: block;
        margin-bottom: .25rem;
        font-size: .875rem;
        cursor: pointer;
    }

    .line{
        display: flex;
        width: 100%;
        gap: .5rem;
    }
</style>