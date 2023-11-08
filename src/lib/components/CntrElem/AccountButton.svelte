<script>
    import {PUBLIC_REFRESH, PUBLIC_CHAIN, PUBLIC_DEMO, PUBLIC_TIMETOEND} from "$env/static/public";
    import { cubicInOut } from 'svelte/easing';
    import { fade } from "svelte/transition";
    import { goto } from "$app/navigation";
    import { userStore } from "$lib/scripts/stores";


    let dropDown_show = false;

    function click(){
        const localStorage = window.localStorage;
        
        if(dropDown_show) {
            dropDown_show = false;
            return;
        }
           

        if(localStorage.getItem(PUBLIC_REFRESH)){
            dropDown_show = true;
            setTimeout( () => {
                document.addEventListener("click", () => dropDown_show = false, {once: true});
            }, 30);
        }
    }


    function easeOpen(node, {duration}){
        let {width, height} = node.getBoundingClientRect();

        return {
            duration,
            css: (t) => { 
                        let eased = cubicInOut(t);

                        return `width: ${width * eased}px; 
                        height: ${height * eased}px;
                        opacity: ${eased}`;
                    }
        }
    }


    async function logout(){
        try {
            let result = await $userStore.logout();

            if(result.success){
                const localStorage = window.localStorage;
                localStorage.removeItem(PUBLIC_REFRESH);
                localStorage.removeItem(PUBLIC_CHAIN);
                localStorage.removeItem(PUBLIC_DEMO);
                localStorage.removeItem(PUBLIC_TIMETOEND);
                goto("/");
            }
        } catch (error) {

            console.log("[Logout error]: ", error);
        }

    }

</script>

<div class="wrapper" on:click={click}>
    <svg viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M26.6667 13.3333C26.6667 5.98667 20.68 0 13.3333 0C5.98667 0 0 5.98667 0 13.3333C0 17.2 1.66667 20.68 4.30667 23.12C4.30667 23.1333 4.30667 23.1333 4.29333 23.1467C4.42667 23.28 4.58667 23.3867 4.72 23.5067C4.8 23.5733 4.86667 23.64 4.94667 23.6933C5.18667 23.8933 5.45333 24.08 5.70667 24.2667C5.8 24.3333 5.88 24.3867 5.97333 24.4533C6.22667 24.6267 6.49333 24.7867 6.77333 24.9333C6.86667 24.9867 6.97333 25.0533 7.06667 25.1067C7.33333 25.2533 7.61333 25.3867 7.90667 25.5067C8.01333 25.56 8.12 25.6133 8.22667 25.6533C8.52 25.7733 8.81333 25.88 9.10667 25.9733C9.21333 26.0133 9.32 26.0533 9.42667 26.08C9.74667 26.1733 10.0667 26.2533 10.3867 26.3333C10.48 26.36 10.5733 26.3867 10.68 26.4C11.0533 26.48 11.4267 26.5333 11.8133 26.5733C11.8667 26.5733 11.92 26.5867 11.9733 26.6C12.4267 26.64 12.88 26.6667 13.3333 26.6667C13.7867 26.6667 14.24 26.64 14.68 26.6C14.7333 26.6 14.7867 26.5867 14.84 26.5733C15.2267 26.5333 15.6 26.48 15.9733 26.4C16.0667 26.3867 16.16 26.3467 16.2667 26.3333C16.5867 26.2533 16.92 26.1867 17.2267 26.08C17.3333 26.04 17.44 26 17.5467 25.9733C17.84 25.8667 18.1467 25.7733 18.4267 25.6533C18.5333 25.6133 18.64 25.56 18.7467 25.5067C19.0267 25.3867 19.3067 25.2533 19.5867 25.1067C19.6933 25.0533 19.7867 24.9867 19.88 24.9333C20.1467 24.7733 20.4133 24.6267 20.68 24.4533C20.7733 24.4 20.8533 24.3333 20.9467 24.2667C21.2133 24.08 21.4667 23.8933 21.7067 23.6933C21.7867 23.6267 21.8533 23.56 21.9333 23.5067C22.08 23.3867 22.2267 23.2667 22.36 23.1467C22.36 23.1333 22.36 23.1333 22.3467 23.12C25 20.68 26.6667 17.2 26.6667 13.3333ZM19.92 19.96C16.3067 17.5333 10.3867 17.5333 6.74667 19.96C6.16 20.3467 5.68 20.8 5.28 21.2933C3.25333 19.24 2 16.4267 2 13.3333C2 7.08 7.08 2 13.3333 2C19.5867 2 24.6667 7.08 24.6667 13.3333C24.6667 16.4267 23.4133 19.24 21.3867 21.2933C21 20.8 20.5067 20.3467 19.92 19.96Z"/>
        <path d="M13.333 6.57324C10.573 6.57324 8.33301 8.81324 8.33301 11.5732C8.33301 14.2799 10.453 16.4799 13.2663 16.5599C13.3063 16.5599 13.3597 16.5599 13.3863 16.5599C13.413 16.5599 13.453 16.5599 13.4797 16.5599C13.493 16.5599 13.5063 16.5599 13.5063 16.5599C16.1997 16.4666 18.3197 14.2799 18.333 11.5732C18.333 8.81324 16.093 6.57324 13.333 6.57324Z"/>
    </svg>

    {#if dropDown_show}
        <div class="dropdown" 
        in:easeOpen={{duration: 400}}
        on:click={logout}>
            <span in:fade={{duration: 200, delay: 400}}>Выйти</span>
        </div>
    {/if}
</div>

<style>
    .wrapper{        
        position: relative;
        width: 1.7rem;
        height: 1.7rem;
    }

    svg{
        width: 100%;
        height: 100%;
        fill: var(--white-blue);
        transition: fill 400ms ease;
        cursor: pointer;
    }

    svg:hover{
        fill: var(--gray-blue);
    }

    .dropdown{
        position: absolute;
        top: 125%;
        left: 0;
        /*transform: translateX(50%);*/
        border-radius: 10px;
        background-color: var(--light-slate-gray);
        border: 2px solid var(--middle-blue);
        padding: .5rem 1rem;
        z-index: 2;
        transition: background 400ms ease;
        transform: translate(-33%);
        cursor: pointer;
    }

    .dropdown:hover{
        background-color: var(--gray-blue);
    }

    .dropdown span{
        cursor: default;
        font-weight: 600;
    }
</style>