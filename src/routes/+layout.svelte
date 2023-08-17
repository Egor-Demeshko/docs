<script>
    import LogoAndName from "$lib/components/LogoAndName.svelte";
</script>

<main>
    <div class="background">
    </div>     
        <div class="logo_position">
            <LogoAndName/>
        </div>
    <slot></slot>
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

    .background{
        background: url('/assets/images/noise.svg');
        mix-blend-mode: soft-light;  
        position: absolute;
        top:0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 0;
    }

    .logo_position{
        padding: 1.5rem;
        background-color: transparent;
        position: relative;

    }
    
</style>