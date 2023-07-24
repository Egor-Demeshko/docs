<script>
	import DropDown from "../CntrElem/DropDown.svelte";
    import Input from "$lib/components/CntrElem/Input.svelte";
    import { compareOptions } from "$lib/scripts/stores"; 

</script>


<div class="wrapper">
    <label id="condition_label" for="condition_rule">Активен, если родительский блок ...</label>


    <div class="line">
        <DropDown id={"condition_rule"} isWithIcon={false} name="condition" options={compareOptions}
        --padding=".125rem 1.8rem .125rem 1rem"/>

        <!--<div style="width: 100%">-->

            <Input id={"condition_value"} placeholder={"значение"}
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
    }

    label{
        display: block;
        margin-bottom: .25rem;
    }

    .line{
        display: flex;
        width: 100%;
        gap: .5rem;
    }
</style>