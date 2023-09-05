<script>
    import Spinner from "$lib/components/Spinner.svelte";
    import { userStore } from "$lib/scripts/stores";
	import User from "$lib/scripts/controllers/instances/User";
	import { onMount } from "svelte";
    import DataService from "$lib/scripts/controllers/instances/DataServise.js";
    import { beforeNavigate } from "$app/navigation";

    let loaded = false;
    userStore.set( new User({save: "local"}) );


    onMount( async() => {
       
        /**если токен есть, нужно рефрешнуть сессию.*/
        if(DataService.isToken()){
        /**
         * проверяем токен, просто в памяти. есть ли он.
         * если его нет, разблокируем логин
         * 
         * если токен есть, то проверяем его свежесть
         * 
         * если он свежий, то грузим дальше
         * если нет, то пытаемся его обновить

         * если обновился, то грузим дальше
         * если нет то редирект на логин, старый токен необходимо удалить.
        */
            //если он свежий, то грузим дальше
            if($userStore.isTokenFresh()){
                loaded = true;
            } else {
                //если нет, то пытаемся его обновить
                try{
                    let isRefreshed = await $userStore.refreshSession();
                    if(isRefreshed) loaded = true;

                } catch(e) {
                    console.log("[main]: не удалось обновить сессию");
                    window.location = window.location.origin;
                }
            }

        } else {
            if(window.location.pathname === '/'){
                loaded = true;
            } else {
                window.location = window.location.origin;
            }
        }

        
        if(!$userStore){
            console.log("[layout.svelte]: userstore: ", $userStore);

            userStore.set( new User() );
            window.location = window.location.origin;
        }
        console.log('[layout.svelte]: userstore', $userStore);

    });


    beforeNavigate( () => {
        loaded = false;
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
    
</style>