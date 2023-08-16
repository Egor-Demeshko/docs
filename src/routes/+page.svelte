<script>
    import Button from "$lib/components/CntrElem/Button.svelte";
    import {fade} from "svelte/transition";
    import Form from "$lib/components/Form.svelte";
    /*import AccountRegistration from "$lib/components/CntrElem/AccountRegistration.svelte";*/

    /**goto("/r");*/
    let logIn_open = false;

    function logIn(){
        logIn_open = true;
    }

</script>


<main>

    <section class:logIn_open>
        <div class="heading">
            <svg>
                <use href="/assets/icons/all.svg#logo"></use>
            </svg>
            <h1>Contract Constructor</h1>
        </div>

        {#if !logIn_open}
        <div out:fade={{duration: 300}}
        class="buttons">
            <Button name={"Войти в личный кабинет"}
            --bg="var(--light-blue)"
            --color="var(--middle-blue)"
            --font-size="1.125rem"
            --border="2px solid var(--light-blue)"
            --padding=".75rem"
            --bg-hover="var(--light-gray-blue)"
            --border-hover="2px solid var(--light-gray-blue)"
            --color-hover="var(--middle-blue)"
            fnToRunOnClick={logIn}/>
            <Button name={"Зарегистрироваться"}
            --bg="var(--light-blue)"
            --color="var(--middle-blue)"
            --font-size="1.125rem"
            --border="2px solid var(--light-blue)"
            --padding=".75rem"
            --bg-hover="var(--light-gray-blue)"
            --border-hover="2px solid var(--light-gray-blue)"
            --color-hover="var(--middle-blue)"/>
        </div>
        {/if}

        {#if logIn_open}
            <div in:fade={{duration: 400, delay: 800}}
                out:fade={{duration: 400, delay: 400}}>
                <Form />
            </div>      
        {/if}
<!--
        {#if logIn_open}
        <div in:fade={{duration: 400, delay: 800}}
            out:fade={{duration: 400, delay: 400}}>
            <AccountRegistration />
        </div>      
        {/if}
-->
    </section>

</main>

<style>
    main{
        width: 100vw;
        height: 100vh;
        background: url('/assets/images/background.svg');  
        position: fixed;
    }


    section{
        position: absolute;
        top: 37%;
        left: 50%;
        display: flex;
        flex-direction: column;
        max-width: 30rem;
        transform: translate(-50%);
        gap: 6.25rem;
    }

    section.logIn_open{
        animation-name: moveup;
        animation-timing-function: ease-in-out;
        animation-duration: 600ms;
        animation-fill-mode: forwards;
        animation-delay: 300ms;
    }


    .heading{
        display: flex;
        gap: 2.5rem;
        align-items: center;
    }


    .buttons{
        display: flex;
        flex-flow: column;
        gap: 1rem;
    }


    h1{
        font-size: 3.75rem;
        line-height: 97%;
        font-weight: 500;
        margin: 0;
        color: var(--white-blue);
    }


    svg{
        height: 100%;
        fill: var(--white-blue);
    }


    @keyframes moveup{
        0% {
            top: 37%;
        }

        100%{
            top: 19%;
        }
    }


</style>