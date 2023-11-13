<script>
    import { createEventDispatcher } from "svelte";
    
    export let isChecked;
    export let id;

    $: console.log("[CHECKBOX]: id", id);

    const dispatch = createEventDispatcher();

    $: {
        let displayChangedObj = {};
        displayChangedObj["content"] = (isChecked) ? true : false;
        displayChangedObj["id"] = id;
        dispatch("data-changed", displayChangedObj);
        displayChangedObj = null;
    }

    function keypress(e){
        e.stopPropagation();
        if(e.key === "Enter" || e.key === " "){
            let input = e.target.querySelector("input");
            input.checked = !input.checked;
            isChecked = !isChecked;
        };
    }  
</script>

<label tabindex="0" role="button" on:keypress={keypress}>
    <span>Значение по умолчанию</span>
    <input name="checkbox" type="checkbox" bind:checked={isChecked} tabindex="-1">
    <div class="icon">
        {#if isChecked}
            <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.338 3.794L5.638 9.494C5.434 9.698 5.17 9.794 4.894 9.794C4.63 9.794 4.366 9.698 4.162 9.494L1.306 6.65C0.898 6.23 0.898 5.57 1.306 5.162C1.714 4.754 2.386 4.754 2.794 5.162L4.894 7.262L9.85 2.306C10.258 1.898 10.93 1.898 11.338 2.306C11.746 2.726 11.746 3.386 11.338 3.794" fill="currentColor"/>
            </svg>
        {/if}
    </div>
</label>

<style>
    label{
        display: flex;
        justify-content: space-between;
        position: relative;
        align-items: center;
        gap: .75rem;
        outline: 2px solid transparent;
        border-radius: 6px;
    }


    label:focus{
        outline: 2px solid var(--orange);
    }


    label span{
        font-size: .875rem;
    }

    input{
        position: absolute;
        top: 0;
        left: 0;
        appearance: none;
        width: 0;
        height: 0;
    }

    .icon{
        display: flex;
        justify-content: center;
        align-items: center;
        border: 2px solid var(--white-blue);
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 6px;
        padding: .25rem;
    }

    svg{
        width: 100%;
        height: 100%;
        animation-name: scaleUp;
        animation-duration: 400ms;
        animation-fill-mode: forwards;
        animation-timing-function: ease-out;
    }

    path{
        color: var(--white-blue);
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