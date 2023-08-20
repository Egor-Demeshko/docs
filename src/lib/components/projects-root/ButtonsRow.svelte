<script>
    import Button from "$lib/components/CntrElem/Button.svelte";
    import { fade } from "svelte/transition";
    import { cubicInOut } from "svelte/easing";


    export let directionOfanimation = false;
    let show = false;


    $: if(directionOfanimation){
        setTimeout( () => show = true, 600);
    } else {
        show = false;
    }


    function whoosh(node, params) {
        //const existingTransform = getComputedStyle(node).height.replace('none', '0');

        return {
            delay: 200,
            duration: 400,
            easing: params.easing || cubicInOut,
            css: (t, u) => `height: ${t * 28}px; margin-top: ${t * 10}px;`
        };
  }
</script>


<div class="buttons_row" transition:whoosh>
    {#if show}
        <div class="buttons_row__left" 
        in:fade={{duration: 200}}
        out:fade={{duration: 200, delay: 100}}>
            <Button 
            name={"Редактировать"}
            no_wrap={true}
            --bg="var(--light-blue)"
            --color="var(--middle-blue)"
            --color-hover="var(--middle-blue)"
            --border="2px solid var(--middle-blue)"
            --border-hover="2px solid var(--middle-blue)"
            --font-size=".875rem"
            --padding=".3rem 1rem"
            --bg-hover="var(--light-gray-blue)"/>
            <Button 
            name={"Заполнить анкеты"}
            no_wrap={true}
            --bg="var(--light-blue)"
            --color="var(--middle-blue)"
            --color-hover="var(--middle-blue)"
            --border="2px solid var(--middle-blue)"
            --border-hover="2px solid var(--middle-blue)"
            --font-size=".875rem"
            --padding=".3rem 1rem"
            --bg-hover="var(--light-gray-blue)"
            fnToRunOnClick={ () => window.location = window.location.origin + "/anketa"}/>        
        </div>
        <div class="buttons_row__right">
            <Button 
            name={"Заполнить анкеты"}
            no_wrap={true}
            --bg="var(--light-blue)"
            --color="var(--middle-blue)"
            --color-hover="var(--middle-blue)"
            --border="2px solid var(--middle-blue)"
            --border-hover="2px solid var(--middle-blue)"
            --font-size=".875rem"
            --padding=".3rem 1rem"
            --bg-hover="var(--light-gray-blue)"/>
        </div>
    {/if}
</div>

<style>
    .buttons_row{
        display: flex;
        justify-content: space-between;
        margin-top: .5rem;
        height: 29px;
    }

    .buttons_row__left{
        display: flex;
        justify-content: space-evenly;
        gap: .5rem;
    }

    .buttons_row__right{
        display: flex;
        justify-content: end;
        gap: .5rem;
    }
</style>