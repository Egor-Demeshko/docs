<script>
    import { fly } from 'svelte/transition';

    let value = '';

    export let active = false;
    export let text = '';


    function closeModal(){
        active = false;
    }

</script>


{#if active}
    <div class="wrapper" aria-live="assertive" on:click={ (e) => {
        if(e.target.classList.contains("wrapper")){
            active = false;
        }
    }}>
        <div class="elements" in:fly={{y: 100, duration: 600}}
        out:fly={{y: 100, duration: 600}}>
            <span>{text}</span>
            <div class="buttons">
                <slot name="inner" {value}></slot>
            </div>
            <svg class="icon" on:click={closeModal}>
                <use href="/assets/icons/all.svg#plus"></use>
            </svg>
        </div>    
    </div>
{/if}


<style>
    .wrapper{
        position: fixed;
        top: 0;
        right: 0;
        width: 100vw;
        height: 100vh;
        background-color: transparent;
        z-index: 10;
        transform: translate(0);
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: .875rem;
    }

    .elements{
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: .875rem 1rem 1.5rem 1rem;
        background-color: var(--white-blue);
        pointer-events: all;
        min-width: 400px;
        border: 2px solid var(--middle-blue);
        border-radius: 15px;
        position: relative;
    }

    .elements>span{
        color: var(--middle-blue);
        padding: 0 .5rem 0 0;
        pointer-events: none;
        font-size: 1rem;
        text-align: center;
    } 

    .buttons{
        width: 100%;
    }

    .icon{
        width: .8rem;
        height: .8rem;
        transform: rotateZ(45deg);
        fill: var(--middle-blue);
        transition: fill 400ms ease-in-out;
        position: absolute;
        top: .75rem;
        right: .675rem;
        cursor: pointer;
    }

    .icon:hover{
        fill: var(--orange);
    }
</style>