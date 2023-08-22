<script>
    import {nodeOptions} from "$lib/scripts/stores";
    import TooltipWithOptions from "$lib/components/CntrElem/TooltipWithOptions.svelte";
    import { fly } from "svelte/transition";

    let open = false;

    function clickHandle(e){
        const target = e.target;

        if(target.tagName === "svg" || target.tagName === "use" || target.classList.contains("icon")){
            open = !open;

            if(open){
                setTimeout( () => document.addEventListener("click", () => open = false, {once: true}), 0);
            }
        }
    }

    $: rotate = (open)? true : false;
</script>

<div class="wrapper" class:rotate on:click={clickHandle}>
    <div class="icon">
        <svg >
            <use href="/assets/icons/all.svg#plus"></use>
        </svg>
    </div>

    {#if open}
        <div class="dropdown" 
        in:fly={{y: 10}}
        out:fly={{y: 10}}>
            <TooltipWithOptions />  
        </div>
    {/if}
</div>

<style>
    .wrapper{
        
        width: var(--width);
        height: var(--height);
        border-radius: 25%;
        transition: box-shadow 600ms ease, background 600ms ease;
        position: absolute;
        top: 3.9rem;
        right: .825rem;
        cursor: pointer;
    }

    .icon{
        background-color: var(--gray-blue);
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        transition: background 600ms ease;
        border-radius: 25%;
    }

    .dropdown{
        position: absolute;
        top: calc(100% + .5rem);
        left: 100%;
        transform: translateX(-100%);
        z-index: 10;
    }

    svg{
        fill: var(--light-blue);
        width: 1.7rem;
        height: 1.7rem;
        transition: transform 400ms ease-out, fill 400ms ease;
    }

    .rotate svg{
        transform: rotateZ(45deg);
    }

    .wrapper:hover{
        box-shadow: 0 0 4px var(--gray-blue);
    }

    .icon:hover{
        background-color: var(--orange);
    }

    .icon:hover svg{
        fill: var(--white-blue);
    }

    .rotate .icon{
        background-color: var(--light-slate-gray);
    }

    .rotate svg{
        fill: var(--light-blue);
    }


    @media print{
        .wrapper{
            display: none;
        }
    }
</style>