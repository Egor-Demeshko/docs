<script>
    import Button from "$lib/components/CntrElem/Button.svelte";
    import {fade, blur} from "svelte/transition";
    import Form from "$lib/components/Form.svelte";
    import AccountRegistration from "$lib/components/CntrElem/AccountRegistration.svelte";

    /**goto("/r");*/
    let logIn_open = false;
    let registration_open = false;

    function logIn(){
        console.log("login");
        registration_open = false;
        logIn_open = true;
        
    }

    function goToRegistration(){
        console.log("registration")
        logIn_open = false;
        registration_open = true;
    }

</script>


<main>

    <section class:registration_open class:logIn_open>
        <div class="heading">
            <svg>
                <use href="/assets/icons/all.svg#logo"></use>
            </svg>
            <h1>Contract Constructor</h1>
        </div>

        {#if !logIn_open && !registration_open}
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
            --color-hover="var(--middle-blue)"
            fnToRunOnClick={goToRegistration}/>
        </div>
        {/if}

        <div class="forms">
            {#if logIn_open}
                <div class="forms__form" in:fade={{duration: 400, delay: 800}}
                    out:fade={{duration: 400}}>
                    <Form on:switch_to_registration={goToRegistration}/>
                </div>      
            {/if}

            {#if registration_open}
                <div class="forms__form" in:fade={{duration: 400, delay: 800}}
                    out:fade={{duration: 400}}>
                    <AccountRegistration on:switch_to_login={logIn}/>
                </div>      
            {/if}
        <div>

    </section>

</main>

<style>



    section{
        position: absolute;
        top: 37%;
        left: 50%;
        display: flex;
        flex-direction: column;
        width: 30rem;
        transform: translate(-50%);
        gap: 5rem;
    }

    section.logIn_open,
    section.registration_open{
        animation-name: moveup;
        animation-timing-function: ease-in-out;
        animation-duration: 600ms;
        animation-fill-mode: forwards;
        animation-delay: 300ms;
    }

    .forms{
        position: relative;
    }


    .forms__form{
        position: absolute;
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