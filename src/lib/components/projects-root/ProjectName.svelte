<script>
	import { fade } from "svelte/transition";
    import ButtonsRow from "$lib/components/projects-root/ButtonsRow.svelte";

    export let name = "Название стандартное";

    let open = false;
    let rotate = false;
    let directionOfanimation = false;
    let rotateBack = false;
    let icon;

    /**обе эти переменные исопльзуются для анимации повтора стрелки, через классы*/
    $: rotate = (open) ? true : false;



    function clickHandle(e){
        const target = e.target;

        if(target.tagName === "BUTTON") return;

        directionOfanimation = !directionOfanimation;
        setTimeout( () => {
            open = !open;
            rotateBack = (!open) ? true : false;
        });
    }
</script>


<li class:open on:click={clickHandle}>
    
    <div class="name__wrapper">
        <span class="name" contenteditable="true" on:click={(e) => e.stopPropagation()}>{name}</span>
        <svg class="icon" viewBox="0 0 12 13">
            <path d="M10.5 11.5H1.5C1.295 11.5 1.125 11.33 1.125 11.125C1.125 10.92 1.295 10.75 1.5 10.75H10.5C10.705 10.75 10.875 10.92 10.875 11.125C10.875 11.33 10.705 11.5 10.5 11.5Z"/>
            <path d="M9.50979 2.24C8.53979 1.27 7.58979 1.245 6.59479 2.24L5.98979 2.845C5.93979 2.895 5.91979 2.975 5.93979 3.045C6.31979 4.37 7.37979 5.43 8.70479 5.81C8.72479 5.815 8.74479 5.82 8.76479 5.82C8.81979 5.82 8.86979 5.8 8.90979 5.76L9.50979 5.155C10.0048 4.665 10.2448 4.19 10.2448 3.71C10.2498 3.215 10.0098 2.735 9.50979 2.24Z" />
            <path d="M7.80516 6.265C7.66016 6.195 7.52016 6.125 7.38516 6.045C7.27516 5.98 7.17016 5.91 7.06516 5.835C6.98016 5.78 6.88016 5.7 6.78516 5.62C6.77516 5.615 6.74016 5.585 6.70016 5.545C6.53516 5.405 6.35016 5.225 6.18516 5.025C6.17016 5.015 6.14516 4.98 6.11016 4.935C6.06016 4.875 5.97516 4.775 5.90016 4.66C5.84016 4.585 5.77016 4.475 5.70516 4.365C5.62516 4.23 5.55516 4.095 5.48516 3.955C5.39338 3.75833 5.13525 3.69991 4.98179 3.85337L2.17016 6.665C2.10516 6.73 2.04516 6.855 2.03016 6.94L1.76016 8.855C1.71016 9.195 1.80516 9.515 2.01516 9.73C2.19516 9.905 2.44516 10 2.71516 10C2.77516 10 2.83516 9.995 2.89516 9.985L4.81516 9.715C4.90516 9.7 5.03016 9.64 5.09016 9.575L7.90643 6.75873C8.05682 6.60834 8.00032 6.34957 7.80516 6.265Z"/>
        </svg>
    </div>
    
    <!-- svelte-ignore empty-block -->
   {#if open}
        <ButtonsRow {directionOfanimation}/>
    {/if}

    
    <svg class="accordion_icon" class:rotate class:rotateBack
    bind:this={icon} 
    width="15" height="8" 
    viewBox="0 0 15 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.9197 0.179993H6.68975H1.07975C0.119748 0.179993 -0.360251 1.33999 0.319749 2.01999L5.49975 7.19999C6.32975 8.02999 7.67975 8.02999 8.50975 7.19999L10.4797 5.22999L13.6897 2.01999C14.3597 1.33999 13.8797 0.179993 12.9197 0.179993Z"/>
    </svg>

</li>


<style>
    li{
        appearance: none;
        padding: 1.5rem 1.5rem 1rem 1.5rem;
        background-color: var(--white-blue);
        position: relative;
        cursor: pointer;
        transition: background 400ms ease-in-out;
        display: block;
    }

    li:nth-child(1){
        border-radius: 0 20px 0 0;
    }

    li::after{
        content: "";
        position: absolute;
        display: block;
        bottom: 0;
        background-color: var(--light-gray-blue);
        height: 1px;
        width: 94%;
        left: 50%;
        transform: translateX(-50%);
    }

    li.open{
        background-color: var(--light-blue);
    }

    li.open::after{
        display: none;
    }

    li:hover{
        background-color: var(--light-blue);
    }



    .name__wrapper{
        display: flex;
        justify-content: start;
        align-items: center;
        gap: .5rem;
    }

    .name{
        font-size: 1.125rem;
        line-height: 100%;
        font-weight: 500;
        color: var(--middle-blue);
    }

    .icon{
        /*display: none;*/
        /*display: block;*/
        width: 1rem;
        height: 1rem;
        opacity: 0;
        transition: opacity 600ms ease-in-out;        
    }

    .accordion_icon{
        fill: var(--middle-blue);
        position: absolute;
        right: 1.8rem;
        top: 50%;
        transform: rotateZ(0);
    }

    .accordion_icon.rotate{
        animation-name: rotate;
        animation-timing-function: ease-in-out;
        animation-duration: 400ms;
        animation-fill-mode: forwards;
    }

    .accordion_icon.rotateBack{
        animation-name: rotateBack;
        animation-timing-function: ease-in-out;
        animation-duration: 600ms;
        animation-fill-mode: forwards;
    }

    .icon path{
        fill: var(--middle-blue);
    }

    .name:hover~.icon{
        opacity: 1;
    }

    .name:focus~.icon{
        opacity: 1;
    }


    @keyframes rotate{
        0%{
            transform: rotateZ(0);
            opacity: 1;
        }
        100%{
            transform: rotateZ(180deg);
            opacity: 0;
        }
    }


    @keyframes rotateBack{
        0%{
            transform: rotateZ(180deg);
            opacity: 0;
        }
        30%{
            transform: rotateZ(180deg);
            opacity: 0;
        }
        100%{
            transform: rotateZ(0);
            opacity: 1;
        }
    }
</style>