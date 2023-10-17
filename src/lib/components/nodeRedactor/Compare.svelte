<script>
	import DropDown from "../CntrElem/DropDown.svelte";
    import Input from "$lib/components/CntrElem/Input.svelte";
    import { compareOptions } from "$lib/scripts/stores";
    import { createEventDispatcher } from "svelte";

    export let forId = "condition_rule";
    export let id;
    export let trigger = "";
    export let validity;

    const dispatch = createEventDispatcher();


    function dataChanged({detail}){
        /**
         * проверить какой блока выбран через compareOptions
         * если блок один из 
         * condition === "gt" || condition === "lt" 
         * || condition === "gte" || condition === "lte"
         * 
         * то пробовать преобразовать в int, то что в data-changed
         * пробросить событие data-changed
        */
        let josenOption= '';
        const intOptions = ["gt", "lt", "gte", "lte"];

        $compareOptions.forEach( (obj) => {
            if(obj.selected){
                josenOption = obj.value;
            }
        });


        if(intOptions.includes(josenOption)){
            detail.trigger = (isNaN(+detail.trigger)) ? detail.trigger : +detail.trigger;
        }
        
        if(detail.trigger === "true") detail.trigger = true;
        if(detail.trigger === "false") detail.trigger = false;
        dispatch("data-changed", detail);
    }

</script>


<div class="wrapper">
    <label id="condition_label" for={forId}>Активен, если родительский блок ...</label>


    <div class="line">
        <DropDown {id} buildTypeid={forId} isWithIcon={false} name="condition" options={compareOptions}
        --padding=".125rem 1.8rem .125rem 1rem"
        --padding-options=".125rem 1rem"
        --border="2px solid var(--light-blue)"
        --flex="1.5 0"/>

        <!--<div style="width: 100%">-->

            <Input {id} placeholder={"значение"}
            value={trigger} name={"trigger"}
            {validity}
            on:data-changed={dataChanged} 
            --border-color="var(--light-blue)"
            --border-color-hover="var(--light-gray-blue)"
            --padding=".1rem .1rem .1rem .4rem"
            --color="var(--deep-blue)"
            --background="var(--light-blue)"
            --background-hover="var(--light-gray-blue)"
            --border-width="2px"
            --font-size=".875rem"
            --placeholder="var(--faded-gray-blue)"
            --flex="1 0"
            />
        <!--</div>-->
    </div>
</div>


<style>
    .wrapper{
        background-color: transparent;
        width: 100%;
        transform: translateZ(0);
        z-index: 1;
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