<script>

    let isOpen = false;


    function clickHandle(){
        isOpen = !isOpen;
    }

</script>


<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click={clickHandle} role="button" tabindex="0">
    <svg viewBox="0 0 14 7" class={(isOpen) ? "open" : ""} aria-disabled="true">
        <path d="M1 6L7 1L13 6" stroke="#526d82" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </svg>

</div>


<style>
    div{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 2rem;
        height: 2rem;
        border: 6px solid var(--middle-blue);
        border-radius: 50%;
        background-color: var(--light-blue);
    }

    svg{
        animation-name: rotate-back;
        animation-timing-function: ease-out;
        animation-duration: 400ms;
        animation-fill-mode: backwards;
    }

    .open{
        animation-name: rotate;
        animation-timing-function: ease-out;
        animation-duration: 400ms;
        animation-fill-mode: forwards;
    }

    svg{
        width: .8rem;
        height: .6rem;
        /*fill: none;*/
        stroke: var(--middle-blue);
    }


    @keyframes rotate{
        0%{
            transform: rotateZ(0deg);
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
            transform: rotateZ(0deg);
        }
    }
</style>