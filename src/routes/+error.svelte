<script>    
    import LogoAndName from "$lib/components/LogoAndName.svelte";
    import Button2 from "$lib/components/CntrElem/Button2.svelte";
</script>


<main>
    <div class="background">
    </div>  

    <div class="logo_position">
        <LogoAndName/>
        <div class="header_right">
            <Button2
            on:click={() => {
                let url = new URL(window.location.origin + "/contact");
                window.open(url, "_blank")
            }}
            --bg="transparent"
            --color="var(--white-blue)"
            --border="3px solid var(--white-blue)"
            --font-size="1rem"
            --padding=".5rem 1.25rem"
            --bg-hover="var(--gray-blue)"
            --color-hover="var(--white-blue)"
            --border-hover="3px solid var(--white-blue)"
            --focus-border="3px solid var(--orange)"
            --focus-outline="none"
            name={"Поддержка"}
            />
        </div>          
    </div>

    <div class="message">
        <div class="message__anouncement">
            <span>404</span>
        </div>
        <div class="buttons">
            <h2 class="buttons__title">Страница не найдена</h2>
            <a class="button" href="/" data="sveltekit-preload-data">На главную</a>
            <a class="button" href="/projects" data="sveltekit-preload-data">На проекты</a>
        </div>
    </div>


</main>


<style>
    .background{
        background: url('/assets/images/noise.svg');
        mix-blend-mode: soft-light;  
        position: absolute;
        top:0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 0;
        view-transition-name: background;
    }

    .logo_position{
        padding: 1.5rem;
        background-color: transparent;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        display: flex;
        justify-content: space-between;
        view-transition-name: background;
    }

    main{
        background-color: var(--main-bg);
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 0;
        left: 0;
        background: url('/assets/images/background.svg') 25% 25%;        
        height: 100vh;
        width: 100vw;
        z-index: 0;
    }


    /**message*/
    .message{
        display: flex;
        width: 912px;
        gap: 5.2rem;
        align-items: center;
        justify-content: center;
        transform: translate(0);
        z-index: 1
    }


    .message__anouncement span{
        font-size: 12rem;
        font-weight: 600;
        cursor: default;
    }

    /**message buttons*/
    .buttons{
        display: flex;
        flex-direction: column;
        gap:.5rem;
        width: 100%;
    }


    .button{
        text-decoration: none;
        padding: .5rem;
        text-align: center;
        color: var(--middle-blue);
        background: var(--light-blue);
        border-radius: 16px;
        font-size: 1.125rem;
        transition: background 400ms ease, color 400ms ease;
    }


    .button:hover{
        background: var(--light-gray-blue);
    }

    .button:active{
        color: var(--light-slate-gray);
    }


    .buttons__title{
        margin: 0;
        margin-bottom: 1rem;
        font-size: 1.5rem;
        font-weight: 500;
        text-align: center;
        cursor: default;
    }


    @media print{
        main{
            padding: 0;
            margin: 0;
        }
    }
    
</style>