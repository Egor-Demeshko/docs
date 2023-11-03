<script>
    import Button from "$lib/components/CntrElem/Button.svelte";
    import {fade, blur} from "svelte/transition";
    import Form from "$lib/components/Form.svelte";
    import AccountRegistration from "$lib/components/CntrElem/AccountRegistration.svelte";
    import Tooltip from "$lib/components/CntrElem/Tooltip.svelte";

    export let data;
    let {registrate} = data; 

    let logIn_open = false;
    let registration_open = false;
    let keep_open = false;

    if(registrate === true){
        keep_open = true;
        setTimeout( () => {registration_open = true; keep_open = false}, 500);
    }

    function logIn(){
        keep_open = true;
        registration_open = false;
        setTimeout( () => {logIn_open = true; keep_open = false}, 500);
    }

    function goToRegistration(){
        keep_open = true;
        logIn_open = false;
        setTimeout( () => {registration_open = true; keep_open = false}, 500);
    }

</script>




    <section class:registration_open class:logIn_open class:keep_open>
        <div class="heading">
            <svg>
                <use href="/assets/icons/all.svg#logo"></use>
            </svg>
            <h1>Contract Constructor</h1>
        </div>

        {#if !logIn_open && !registration_open && !keep_open}
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

    </section>

    <div class="forms">
        {#if logIn_open}
            <div class="forms__form" in:fade={{duration: 400}}
                out:fade={{duration: 400}}>
                <Form on:switch_to_registration={goToRegistration}/>
            </div>      
        {/if}

        {#if registration_open}
            <div class="forms__form" in:fade={{duration: 400}}
                out:fade={{duration: 400}}>
                <AccountRegistration on:switch_to_login={logIn}/>
            </div>      
        {/if}
    </div>



    <Tooltip --bg="var(--faded-gray-blue)"
    --color="var(--white-blue)"/>





<style>

    section{
        position: fixed;
        top: 37%;
        left: 50%;
        display: flex;
        flex-direction: column;
        width: clamp(26rem, 26vw , 32rem);
        transform: translate(-50%);
        gap: 5rem;
    }

    section.logIn_open,
    section.registration_open,
    section.keep_open{
        animation-name: moveleft;
        animation-timing-function: ease-in-out;
        animation-duration: 600ms;
        animation-fill-mode: forwards;
        animation-delay: 300ms;
    }

    .forms{
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translateY(-55%);
    }


    .forms__form{
        position: relative;
    }


    .heading{
        display: flex;
        gap: 1.8rem;
        align-items: center;
    }


    .buttons{
        display: flex;
        flex-flow: column;
        gap: 1rem;
    }


    h1{
        font-size: clamp(2.75rem, 3.5vw, 3.75rem);
        line-height: 97%;
        font-weight: 500;
        margin: 0;
        color: var(--white-blue);
    }


    svg{
        height: clamp(5.5rem, 5.4vw, 7.7rem);;
        fill: var(--white-blue);
    }


    @keyframes moveleft{
        0% {
            transform: translate(-50%);
        }

        100%{
            transform: translateX(-130%);
        }
    }


</style>