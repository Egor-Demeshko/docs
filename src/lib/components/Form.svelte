<script>
    import InputLogIn from "$lib/components/CntrElem/InputLogIn.svelte";
    import InputWithEye from "./CntrElem/InputWithEye.svelte";
    import Button from "./CntrElem/Button.svelte";
    import { createEventDispatcher } from "svelte";
    import saveDeleteService from "$lib/scripts/utils/saveDelete/document/saveDeleteService.js";
    import { userStore } from "$lib/scripts/stores";
    import { goto } from "$app/navigation";


    let dispatch = createEventDispatcher();
    let validData = {login: {value: "", validity: false}, password: {value: "", validity: false}};
    let disabled = true;
    let generealText = '';
    let generalInvalid = false;
    let error_password = '';
    let error_log = '';
    $: console.log(error_log);



    async function logIn(e){
        e.preventDefault();

        if(disabled) return;

        disabled = true;
        const servise = new saveDeleteService("login");
        console.log("[LOGIN]: START LOGGINING");

        {
            const dataToSend ={
                password: validData.password.value,
                login: validData.login.value
            }


            try{
                let {success, data, detail} = await servise.createInstance(dataToSend);
                disabled=false;

                if(success && data && $userStore){
                    generealText = "";
                    let result = $userStore.saveData(data);
                    if(result) goto("/projects");
                }

                if(!success){
                    generealText = "Неверный логин или пароль";
                    generalInvalid = true;
                    disabled = false;
                }
            } catch (e){
                generealText = "Ошибка сети, попробуйте еще раз";
                disabled = false;
            }
            disabled = false;
        }         
    }


    function inputChange(e){
        generealText = "";
        const target = e.target;
        let id = target.name;

        if(id){
            validData[id]["value"] = target.value;
        }
    }


    function invalidHandle(){
        disabled = true;
    }


    function validHandle(e){
        generalInvalid = false;
        generealText = "";
        const {id, validity} = e.detail;

        validData[id]["validity"] = validity;

                /**проверяем валидность полей ввода*/
        for(let key of Object.keys(validData)){
            if(!validData[key].validity) {
                disabled = true;
                return;
            };
        }

        disabled = false;
    }
</script>

<form on:submit|preventDefault>
    <h1>Вход в личный кабинет</h1>
    <div class="controls">

    <div class="controls__group">
        <InputLogIn id={"login"} name={"login"} placeholder={"Введите ваш логин"}
        type={'text'}
        pattern={"[a-zA-Z_0-9]{4,}"}
        required={true}
        bind:text={error_log}
        on:valid={validHandle}
        on:invalid={invalidHandle}
        --border-width="2px"
        --border-color="var(--middle-blue)"
        --font-size="1.125rem"
        --color="var(--deep-blue)"
        --background="var(--white-blue)"
        --placeholder="var(--gray-blue)"
        --border-color-hover="var(--light-slate-gray)"
        --border-color-focus="var(--faded-middle-blue)"
        --background-hover="var(--faded-light-blue)"
        --background-focus="var(--faded-light-blue)"
        --padding=".625rem 1.75rem"
        --error-background="var(--light-blue)"
        on:input={inputChange}
        invalid={generalInvalid}/>

        {#if error_log}
            <span class="error_text">{error_log}</span>
        {/if}
    </div>
        
    <div class="controls__group">
        <InputWithEye id={"password"} name={"password"} placeholder={"Введите ваш пароль"}
        pattern={".{5,}"}
        required={true}
        bind:text={error_password}
        on:valid={validHandle}
        --border-width="2px"
        --border-color="var(--middle-blue)"
        --font-size="1.125rem"
        --color="var(--deep-blue)"
        --background="var(--white-blue)"
        --placeholder="var(--gray-blue)"
        --border-color-hover="var(--light-slate-gray)"
        --border-color-focus="var(--faded-middle-blue)"
        --background-hover="var(--faded-light-blue)"
        --background-focus="var(--faded-light-blue)"
        --padding=".625rem 1.75rem"
        --error-background="var(--light-blue)"
        type={"password"}
        on:input={inputChange}
        invalid={generalInvalid}/>

        {#if error_password}
            <span class="error_text">{error_password}</span>
        {/if}
    </div>

        <span class="genereal-text">{generealText}</span>
    </div>

    <div class="buttons">
        <Button name={"Войти"} 
        fnToRunOnClick={logIn}
        {disabled}
        --bg="var(--middle-blue)" 
        --bg-active="var(--light-slate-gray)"
        --color="var(--white-blue)"
        --bg-hover="var(--gray-blue)"
        --color-hover="var(--white-blue)"
        --border="2px solid var(--middle-blue)"
        --border-hover="2px solid var(--gray-blue)"
        --font-size="1.125rem"
        />

        <Button name={"Зарегистрироваться"}
        --bg="var(--light-blue)" 
        --bg-active="var(--light-blue)"
        --color="var(--middle-blue)"
        --bg-hover="var(--light-gray-blue)"
        --color-hover="var(--middle-blue)"
        --color-active="var(--light-slate-gray)"
        --border="2px solid var(--light-blue)"
        --border-hover="2px solid var(--light-gray-blue)"
        --font-size="1.125rem"
        fnToRunOnClick={ () => dispatch("switch_to_registration")}
        on:switch_to_registration/>
    </div>
</form>

<style>
    form{
        padding: 5rem 2.5rem;
        background-color: var(--white-blue);
        width: 37rem;
        width: clamp(32rem, 32vw , 39rem);
        border-radius: 20px;
    }

    h1{
        font-weight: 500;
        font-size: 1.5rem;
        text-align: center;
        color: var(--middle-blue);
        margin: 0;
        margin-bottom: 3rem; 
        margin-bottom: clamp(1.8rem, 2.62vw, 3rem); 
    }

    .controls{
        display: flex;
        flex-flow: column;
        gap: 2.7rem;
        gap: clamp(2rem, 2.62vw, 2.7rem);
        margin-bottom: 3.25rem;
        margin-bottom: clamp(1.9rem, 2.81vw, 3.25rem);
    }

    .controls__group{
        position: relative;
    }

    .genereal-text{
        color: var(--pumpkin);
        transform: translateY(-8px);
        height: 1rem;
        font-size: 1rem;
    }

    .buttons{
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .error_text{
        color: var(--middle-blue);
        font-size: 1rem;
        position: absolute;
        bottom: -0.5rem;
        transform: translateY(100%);
        left: 0;
    }
</style>