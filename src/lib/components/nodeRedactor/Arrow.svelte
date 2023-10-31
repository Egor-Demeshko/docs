<script>
    import { createEventDispatcher, getContext } from "svelte";

    export let open;
    const controller = getContext("controller");


    let dispatch = createEventDispatcher();

    /*
     * компонент определяет кнопку/стрелку для открытия закрытия интерфейса редактирования типа / содержания узла.
     *  
     */


    function clickHandle(){
        if(!open){
            dispatch("arrow_clicked");
            return;
        }
        if(controller.wasValidated){
            dispatch("arrow_clicked");
        } else {

            let result = controller.consistencyCheck();
            if(result){
                
                dispatch("arrow_clicked");
            } else {
                return;
            }
        }
        
    }

    function keypress(){

        dispatch("arrow_clicked"); 
    }

</script>


<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click={clickHandle} on:keypress={keypress} role="button" tabindex="0" title="закрыть редактор">
    
    <svg viewBox="0 0 9 6"  aria-disabled="true">
        <path class={(open) ? "open" : ""} d="M8.3375 4.8075C8.1875 4.9575 7.9975 5.0275 7.8075 5.0275C7.6175 5.0275 7.4275 4.9575 7.2775 4.8075L4.2775 1.8075L1.2775 4.8075C0.9875 5.0975 0.5075 5.0975 0.2175 4.8075C-0.0725 4.5175 -0.0725 4.0375 0.2175 3.7475L3.7475 0.2175C4.0375 -0.0725 4.5175 -0.0725 4.8075 0.2175L8.3375 3.7475C8.6275 4.0475 8.6275 4.5175 8.3375 4.8075Z" fill="currentColor"/>
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
        outline: 2px solid transparent;
        transition: background 400ms ease, outline 400ms ease;
    }

    div:hover,
    div:focus{
        background-color: var(--pale-orange);
    }


    svg{
        width: .85rem;
        height: .5rem;
    }

    path{
        transform-origin: 50% 50%;
        fill: var(--middle-blue);
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