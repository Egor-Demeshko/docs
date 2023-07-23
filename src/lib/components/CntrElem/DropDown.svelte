<script>
    import { fly } from "svelte/transition";
    export let options;    
    export let name;

    $: isOpened = false;
    $: rotate = (isOpened) ? true : false;


    function handleClick(e){
        //console.log("[DropDown] click event target: ", e.target);
        isOpened = !isOpened;
    }

</script>




<div class="dropdown">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <div class="main_view" on:click={handleClick} role="button" tabindex="0">

        {#each $options as {text, value, selected}}
            {#if selected}
            <div class="main_label">
                <input class="main_input" type="radio" {value} {name} checked={selected}/>
                <svg class="icon">
                    <use href="/assets/icons/all.svg#{value}"></use>
                </svg>
                <span class="main_name">
                    {text}
                </span>
            </div>
            {/if}
        {/each}

        <svg class="arrow" class:rotate>
            <use href="/assets/icons/all.svg#arrow"></use>
        </svg>
    </div>

    {#if isOpened}
        <div class="options"
        transition:fly={{ y: 8 }}>
            {#each $options as {text, value, selected}}
                {#if selected}
                
                {:else}
                <label class="main_label option-in-drop"
                transition:blur
                >
                    <input class="main_input" type="radio" {value} {name} checked={selected}/>
                    <svg class="icon">
                        <use href="/assets/icons/all.svg#{value}"></use>
                    </svg>
                    <span class="main_name">
                        {text}
                    </span>
                </label>
                {/if}
            {/each}
        </div>
    {/if}   
</div>




<style>
    :root{
        --border: 2px solid var(--light-blue);
        --padding: .4rem 1.8rem .4rem .875rem;
    }


    .dropdown{
        font-size: 0.875rem;
        position: relative;
        width: 100%;
    }


    .main_view{
        display: flex;
        border: var(--border);
        border-radius: 30px;
        align-items: center;
        position: relative;
        z-index: 5;
    }


    .main_label{
        display: flex;
        justify-content: start;
        align-items: center;
        gap: .4rem;
        padding: var(--padding);
        cursor: pointer;
    }


    .main_input{
        appearance: none;
        position: absolute;
        top: 0;
        left: 0;
        width: 0;
        height: 0;
    }

    .main_name{
        font-size: .875rem;
    }


    .icon{
        width: 0.8rem;
        height: 0.8rem;
    }


    .arrow{
        width: 0.5rem;
        height: 0.25rem;
        position: absolute;
        right: 0.75rem;
        animation-duration: 400ms;
        animation-name: rotate-back;
        animation-timing-function: ease-in-out;
        animation-fill-mode: forwards;
        animation-direction: normal;
    }


    .arrow.rotate{
        animation-duration: 400ms;
        animation-name: rotate;
        animation-timing-function: ease-in-out;
        animation-fill-mode: forwards;
        animation-direction: normal;
    }


    .options{
        position: absolute;
        display: flex;
        flex-direction: column;
        top: 50%;
        left: 0;
        background-color: var(--middle-blue);
        padding-top: 1.3rem;
        padding-bottom: .5rem;
        width: 100%;
        border: var(--border);
        border-top: none;
        z-index: 0;
        border-radius: 0 0 12px 12px;
    }


    .options .main_label{
        padding: .2rem 1.5rem .2rem .875rem
    }

    .option-in-drop{
        transition: background 400ms ease;
    }

    .option-in-drop:hover{
        background-color: var(--light-slate-gray);
    }

    @keyframes rotate{
        0%{
            transform: rotateZ(0);
        }

        50%{
            transform: rotateZ(90deg);
        }

        100%{
            transform: rotateZ(180deg);
        }
    }

    @keyframes rotate-back{
        0%{
            transform: rotateZ(180deg);
        }

        50%{
            transform: rotateZ(90deg);
        }

        100%{
            transform: rotateZ(0);
        }
    }
</style>