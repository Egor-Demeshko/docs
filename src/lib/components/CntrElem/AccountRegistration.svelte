<script>
    import InputLogIn from "$lib/components/CntrElem/InputLogIn.svelte";
    import InputWithEye from "$lib/components/CntrElem//InputWithEye.svelte";
    import Button from "$lib/components/CntrElem/Button.svelte";
    import { createEventDispatcher } from "svelte";
    import { showTooltip, userStore } from "$lib/scripts/stores";

    let dispatch = createEventDispatcher();
    let validData = {reg_login: {value: "", validity: false},
                    reg_mail: {value: "", validity: false}, 
                    reg_name: {value: "", validity: false},
                    reg_password: {value: "", validity: false}, 
                    reg_password_repeat: {value: "", validity: false}};
                    
    let disabled = true;
    let bothPasswordValid = {status: "valid"};
    /**инпут для показа сообщени об ошибки в случае если поля не равны*/
    let firstPassword;
    let secondPassword;
    let err_name = '';
    let err_login = '';
    let err_mail = '';
    let err_password = '';
    let err_both_passwords = '';


    async function registrate(e){
        e.preventDefault();
        disabled = true;
        
        // надо проверить сначала два поля регистрации, одинаковые ли они
        // надо проверить валидность всех полей
        if(validData.reg_password.value !== validData.reg_password_repeat.value){
            bothPasswordValid = {status: "invalid"};

            err_both_passwords = "Пароли не совпадают";
            disabled = false;
            return;
        }


        /**валидируем все поля формы*/
        for(let obj of Object.values(validData)){
            if(!obj.validity) {
                disabled = false;
                return;
            };
        }

        /**отправляем данные на регистрацию*/
        if($userStore){
            /**подготовить данные
             * надо {
            "email": "new_user2@google.com",
            "password": "{{AUTH_PASSWORD}}",
            "name": "new_user2",
            "login": "user_login2"
                }
            */
            const dataToSend = {
                "email": validData.reg_mail.value,
                "password": validData.reg_password.value,
                "name": validData.reg_name.value,
                "login": validData.reg_login.value
            }

            err_mail = "";

            try{
                let {success, details} = await $userStore.registrate(dataToSend, true);
                if(success){
                    dispatch("switch_to_login");
                }

                if(!success){
                    for(let i = 0; i < details.length; i++){
                        const {message} = details[i];

                        if(message === "Email is already exist"){
                            
                            err_mail = "Пользователь с таким email уже существует";    
                        } else if(message === "Login is already exist") {
                            err_login = "Пользователь с таким логин уже существует";
                        }
                    }
                }
            } catch (e){
                console.log("ACCOUNT ERROR", e);
            }
        }

        bothPasswordValid = {status: "valid"};
        disabled = false;
    }


    function validHandle(e){
        const {id, validity} = e.detail;

        validData[id]["validity"] = validity;
    }


    function invalidHandle(e){
        const {id, validity} = e.detail;

        validData[id]["validity"] = validity;
    }


    function inputChange(e){

        const target = e.target;
        let id = target.name;

        if(id){
            validData[id]["value"] = target.value;
        }

        /**валидация соотвествия паролей*/
        if(validData["reg_password"].value.length > 0 && validData["reg_password_repeat"].value.length > 0){
            
            let first = validData["reg_password"].value;
            let second = validData["reg_password_repeat"].value;

            if(first !== second){
                err_both_passwords = "Пароли не совпадают";
                disabled = true;
                return;
            } else {
                err_both_passwords = "";
            }
        }
        
        isAllValid();
        console.log("[validData]", validData);
    }


    function isAllValid(){
        for( let key of Object.keys(validData)){
            if(!validData[key].validity) {
                disabled = true;
                return;
            }
        }

        disabled = false;
    }


    

</script>

<form on:submit|preventDefault>
    <h1>Регистрация</h1>
    <div class="controls">
        <div class="controls__group">
            <InputLogIn id={"reg_name"} placeholder={"Введите ваше Имя"}
            name={"reg_name"}
            type={'text'}
            pattern={"[a-zA-Z_0-9а-яА-Я]{4,}"}
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
            --error-background="var(--white-blue)"
            on:valid={validHandle}
            on:input={inputChange}
            on:invalid={invalidHandle}
            bind:text={err_name}/>

            <InputLogIn id={"reg_login"} placeholder={"Введите ваш логин"}
            name={"reg_login"}
            type={'text'}
            pattern={"[a-zA-Z_0-9]{4,}"}
            invalid={ (() => {if(err_login) return true})() }
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
            --error-background="var(--white-blue)"
            on:valid={validHandle}
            on:input={inputChange}
            on:invalid={invalidHandle}
            bind:text={err_login}/>

            {#if err_login || err_name}
                <span class="warning_text">{ (err_login) ? err_login : err_name }</span>
            {/if}
        </div>

        <div class="controls__group">
            <InputLogIn id={"reg_mail"} placeholder={"Введите вашу почту"}
            name={"reg_mail"}
            type={'text'}
            pattern={"^[0-9A-Za-z._-]+@[0-9A-Za-z._-]+\\.[a-z]+$"}
            invalid={ (() => {if(err_mail) return true})() }
            required={true}
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
            --error-background="var(--white-blue)"
            on:valid={validHandle}
            on:input={inputChange}
            on:invalid={invalidHandle}
            bind:text={err_mail}/>

            {#if err_mail}
                <span class="emergency_text">{ err_mail }</span>
            {/if}
        </div>

        <div class="controls__group">
            <InputWithEye id={"reg_password"} placeholder={"Введите ваш пароль"}
            name={"reg_password"}
            pattern={".{5,}"}
            required={true}
            invalid={ (err_both_passwords) ? true : false }
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
            --error-background="var(--white-blue)"
            type={"password"}
            on:valid={validHandle}
            on:input={inputChange}
            on:invalid={invalidHandle}
            bind:input={firstPassword} 
            bind:text={err_password}/>

            <InputWithEye id={"reg_password_repeat"} placeholder={"Повторите ваш пароль"}
            name={"reg_password_repeat"}
            pattern={".{5,}"}
            required={true}
            invalid={ (err_both_passwords) ? true : false }
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
            on:valid={validHandle}
            on:input={inputChange}
            on:invalid={invalidHandle}
            bind:input={secondPassword}
            bind:text={err_password}/>

            {#if err_password && !err_both_passwords}
                <span class="warning_text">{ err_password }</span>
            {/if}

            {#if err_both_passwords }
                <span class="emergency_text">{ err_both_passwords }</span>
            {/if}
        </div>
    </div>

    <div class="buttons">
        <Button name={"Зарегистрироваться"} 
        {disabled}
        --bg="var(--middle-blue)" 
        --bg-active="var(--light-slate-gray)"
        --color="var(--white-blue)"
        --bg-hover="var(--gray-blue)"
        --color-hover="var(--white-blue)"
        --border="2px solid var(--middle-blue)"
        --border-hover="2px solid var(--gray-blue)"
        --font-size="1.125rem"
        fnToRunOnClick={registrate}/>


        <Button name={"Есть аккаунт? Залогиниться"}
        --bg="var(--light-blue)" 
        --bg-active="var(--light-blue)"
        --color="var(--middle-blue)"
        --bg-hover="var(--light-gray-blue)"
        --color-hover="var(--middle-blue)"
        --color-active="var(--light-slate-gray)"
        --border="2px solid var(--light-blue)"
        --border-hover="2px solid var(--light-gray-blue)"
        --font-size="1.125rem"
        fnToRunOnClick={ () => dispatch("switch_to_login")}
        on:switch_to_login/>
    </div>

</form>

<style>
    form{
        padding: 5rem 2.5rem;
        padding: clamp(2.5rem, 4.34vw, 5rem) clamp(1.5rem, 2.17vw, 2.5rem);
        background-color: var(--white-blue);
        width: clamp(32rem, 32vw , 39rem);
        border-radius: 20px;
    }

    h1{
        font-weight: 500;
        font-size: 1.5rem;
        text-align: center;
        color: var(--middle-blue);
        margin: 0;
        margin-bottom: 2.69rem; 
        margin-bottom: clamp(1.7rem ,2.33vw ,2.69rem); 
    }

    .controls{
        display: flex;
        flex-flow: column;
        gap: 2.67rem;
        gap: clamp(1.8rem, 2.33vw, 2.67rem);
        margin-bottom: 5.2rem;
        margin-bottom: clamp(2.9rem, 4.5vw, 5.2rem);
    }

    .controls__group{
        display: flex;
        flex-direction: column;
        gap: 1rem;
        position: relative;
    }

    .buttons{
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .warning_text, 
    .emergency_text{    
        font-size: 1rem;
        position: absolute;
        bottom: -0.5rem;
        transform: translateY(100%);
        left: 0;
    }

    .warning_text{
        color: var(--middle-blue);
    }

    .emergency_text{
        color: var(--pumpkin);
    }
</style>