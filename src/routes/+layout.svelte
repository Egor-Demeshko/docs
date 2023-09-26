<script>
    import Spinner from "$lib/components/Spinner.svelte";
    import { userStore } from "$lib/scripts/stores";
	import User from "$lib/scripts/controllers/instances/User";
	import { onMount } from "svelte";
    import { beforeNavigate, goto } from "$app/navigation";
    import { shouldRedirected } from "$lib/scripts/utils/navigation/navigation.js";

    let loaded = false;
    userStore.set( new User({save: "local"}) );


    onMount( async() => {
        let {redirect, path} = await shouldRedirected($userStore);
        /**если аксесс токен есть, проверить сессию, если надо обновить ее*/
       if(redirect){
            switch(path){
                case ("projects"):
                    goto("/projects")
                    break;
                case ("/"):
                    goto("/");
                    break;
            }
       }

       loaded = true;

        
        if(!$userStore){
            console.log("[layout.svelte]: userstore: ", $userStore);

            userStore.set( new User({save: "local"}) );
            window.location = window.location.origin;
        }
        console.log('[layout.svelte]: userstore', $userStore);
   });


    

</script>

<main>
    {#if !loaded}
        <div class="spinner_wrapper">
            <Spinner/>
        </div>
    {:else}
        <slot></slot>
    {/if}
</main>

<style>
    main{
        background-color: var(--main-bg);
        position: relative;
        top: 0;
        left: 0;
        background: url('/assets/images/background.svg');        
        height: 100vh;
        width: 100vw;
    }

    .spinner_wrapper{
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--spinner-back);
        z-index: 100;
    }

    @media print{
        main{
            padding: 0;
            margin: 0;
        }

        .spinner_wrapper{
            display: none;
        }
    }
    
</style>