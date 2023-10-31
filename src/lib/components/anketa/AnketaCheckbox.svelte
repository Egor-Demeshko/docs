<script>
    import { setElementHoverLike, removeElementHoverLike} from "$lib/scripts/docElements/controllers/ElementsSideFocusBlurProcess.js";
    import { getContext } from "svelte";
    import { showTooltip } from "$lib/scripts/stores";
    import { get } from "svelte/store";

    export let data;

    let {content, name, id, parent_id, description} = data;
    const controller = getContext("controller");
    /**@description управляет изменением цвета, когда курсор заходит на элемент.
     * иметирует ховер
    */
    let hoverBackground = false;

    
    
    /*описывает hover сосотояние на элементе в текстовом редакторе.*/
    function setHoverLike(e){
        hoverBackground = true;
        const target = e.target;
        let {x: targetX, y: targetY} = target.getBoundingClientRect();
        targetY += 50;
        let {clientX, clientY} = e;
        let x, y;
        setElementHoverLike(id);
        if(!description) return;
        y = clientY;
        x = clientX;
        console.log({targetY, clientY});
        if(targetY  > clientY){ 
            showTooltip.set({show: true, coors: {x, y: y + 20}, text: description, place: "above"});
        } else {
            showTooltip.set({show: true, coors: {x, y: y - 40}, text: description, place: "above"});
        }

        
    }
    
    /*описывает removehover сосотояние на элементе в текстовом редакторе.*/
    function removeHoverLike(){
        hoverBackground = false;
        removeElementHoverLike(id);
        showTooltip.set({show: false});
    }
    
    
    async function handleChanged(){
        if(typeof content !== "boolean" ) return;
        
        content = !content;
        await $controller.saveData({node_id: id, content});

        decideWhatBlockToShow();
    }


    function decideWhatBlockToShow(){
       // const simpleTexts = get(storeForSimpleTexts);
       // const nodesCollection = get(nodes);

    }
    
    
    $: isChecked = content;
    $: console.log("[isChecked]: ", isChecked);
</script>


<div class="wrapper" 
on:pointerenter={setHoverLike}
on:pointerleave={removeHoverLike}
class:hoverBackground>
    
    <label class="name" for={id}>{name}</label>
    
    <div class="checkbox" on:click={handleChanged}>
        <input {id} class="checkbox__input"
            type="checkbox"
            {name}
            checked={content}
            on:change={handleChanged}
            />
        
            {#if isChecked}
                <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.338 3.794L5.638 9.494C5.434 9.698 5.17 9.794 4.894 9.794C4.63 9.794 4.366 9.698 4.162 9.494L1.306 6.65C0.898 6.23 0.898 5.57 1.306 5.162C1.714 4.754 2.386 4.754 2.794 5.162L4.894 7.262L9.85 2.306C10.258 1.898 10.93 1.898 11.338 2.306C11.746 2.726 11.746 3.386 11.338 3.794" fill="currentColor"/>
                </svg>
            {/if}
        
    </div>
</div>


<style>
    .wrapper{
        display: flex;
        gap: 1.5rem;
        padding: .5rem;
        align-items: center;
        transition: background 400ms ease;
        border-radius: 8px;
    }

    .wrapper.hoverBackground{
        background-color: var(--faded-light-blue);
    }

    .name{
        flex-basis: 6.8rem;
        flex-grow: 0;
        flex-shrink: 0;
        color: var(--middle-blue);
        display: block;
    }

    .checkbox{
        border: 2px solid var(--gray-blue);  
        width: 1.6rem;
        height: 1.6rem;
        position: relative;
        border-radius: 8px;
        padding: .2rem;
    }

    .checkbox__input{
        position: absolute;
        appearance: none;
        width: 0px;
        height: 0px;
        visibility: hidden;
    }

    svg{
        height: 100%;
        width: 100%;
        animation-name: scaleUp;
        animation-duration: 400ms;
        animation-fill-mode: forwards;
        animation-timing-function: ease-out;
    }

    svg path{
        color: var(--gray-blue);
    }

    @keyframes scaleUp{
        0%{
            transform: scale(0);
        }

        100%{
            transform: scale(100%);
        }
    }
</style>