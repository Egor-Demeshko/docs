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
                    
    let disabled = false;
    let bothPasswordValid = {status: "valid"};
    /**инпут для показа сообщени об ошибки в случае если поля не равны*/
    let firstPassword;
    let secondPassword;


    async function registrate(e){
        e.preventDefault();
        disabled = true;
        // надо проверить сначала два поля регистрации, одинаковые ли они
        // надо проверить валидность всех полей
        if(validData.reg_password.value !== validData.reg_password_repeat.value){
            bothPasswordValid = {status: "invalid"};
            let coors = firstPassword.getBoundingClientRect();

            showTooltip.set({show: true, 
                            coors: {x: coors.x + firstPassword.offsetWidth /2, y: coors.y}, 
                            text: "Пароли не совпадают", 
                            place: "above"});
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
            console.log("[STARTING REG]");
            let {success} = await new Promise( (resolve) => setTimeout( () => resolve({
                "success": true,
                "data": {
                    "user_id": 2,
                    "name": "new_user2",
                    "email": "new_user2@google.com",
                    "login": "user_login2"
                },
                "details": null
            }), 1000));
            //await $userStore.registrate(dataToSend, true);
            if(success){
                dispatch("switch_to_login");
            }
        }

        showTooltip.set({show: false});
        bothPasswordValid = {status: "valid"};
        disabled = false;
    }


    function validHandle(e){
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
            
            let coors = secondPassword.getBoundingClientRect();
            let first = validData["reg_password"].value;
            let second = validData["reg_password_repeat"].value;

            if(first !== second){
                showTooltip.set({show: true, 
                            coors: {x: coors.x + firstPassword.offsetWidth /2, y: coors.y}, 
                            text: "Пароли не совпадают", 
                            place: "above"});
            } else {
                showTooltip.set({show: false});
            }
        }

        console.log("[validData]", validData);
    }


    

</script>

<form>
    <h1>Регистрация</h1>
    <div class="controls">
        <InputLogIn id={"reg_login"} placeholder={"Введите ваш логин"}
        name={"reg_login"}
        type={'text'}
        pattern={"[a-zA-Z_0-9]{4,}"}
        --border-width="2px"
        --border-color="var(--middle-blue)"
        --font-size="1.125rem"
        --color="var(--deep-blue)"
        --background="var(--white-blue)"
        --placeholder="var(--gray-blue)"
        --border-color-hover="var(--pale-orange)"
        --background-hover="var(--white-blue)"
        on:valid={validHandle}
        on:input={inputChange}/>

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
        --border-color-hover="var(--pale-orange)"
        --background-hover="var(--white-blue)"
        on:valid={validHandle}
        on:input={inputChange}/>

        <InputLogIn id={"reg_mail"} placeholder={"Введите вашу почту"}
        name={"reg_mail"}
        type={'text'}
        pattern={"^[0-9A-Za-z._-]+@[0-9A-Za-z._-]+\\.[a-z]+$"}
        --border-width="2px"
        --border-color="var(--middle-blue)"
        --font-size="1.125rem"
        --color="var(--deep-blue)"
        --background="var(--white-blue)"
        --placeholder="var(--gray-blue)"
        --border-color-hover="var(--pale-orange)"
        --background-hover="var(--white-blue)"
        on:valid={validHandle}
        on:input={inputChange}/>
        
        <InputWithEye id={"reg_password"} placeholder={"Введите ваш пароль"}
        name={"reg_password"}
        pattern={".{5,}"}
        required={true}
        --border-width="2px"
        --border-color="var(--middle-blue)"
        --font-size="1.125rem"
        --color="var(--deep-blue)"
        --background="var(--white-blue)"
        --placeholder="var(--gray-blue)"
        --border-color-hover="var(--pale-orange)"
        --background-hover="var(--white-blue)"
        type={"password"}
        on:valid={validHandle}
        on:input={inputChange}
        bind:input={firstPassword}/>

        <InputWithEye id={"reg_password_repeat"} placeholder={"Повторите ваш пароль"}
        name={"reg_password_repeat"}
        pattern={".{5,}"}
        required={true}
        --border-width="2px"
        --border-color="var(--middle-blue)"
        --font-size="1.125rem"
        --color="var(--deep-blue)"
        --background="var(--white-blue)"
        --placeholder="var(--gray-blue)"
        --border-color-hover="var(--pale-orange)"
        --background-hover="var(--white-blue)"
        type={"password"}
        on:valid={validHandle}
        on:input={inputChange}
        bind:input={secondPassword}/>

        <Button name={"Зарегистрироваться"} 
        {disabled}
        --bg="var(--middle-blue)" 
        --color="var(--white-blue)"
        --bg-hover="var(--gray-blue)"
        --color-hover="var(--white-blue)"
        --border="2px solid var(--middle-blue)"
        --border-hover="2px solid var(--gray-blue)"
        --font-size="1.125rem"
        fnToRunOnClick={registrate}/>
    </div>


    <Button name={"Есть аккаунт? Залогиниться"}
    --bg="var(--light-blue)" 
    --color="var(--middle-blue)"
    --bg-hover="var(--light-gray-blue)"
    --color-hover="var(--middle-blue)"
    --border="2px solid var(--light-blue)"
    --border-hover="2px solid var(--light-gray-blue)"
    --font-size="1.125rem"
    fnToRunOnClick={ () => dispatch("switch_to_login")}
    on:switch_to_login/>

</form>

<style>
    form{
        padding: 5rem 2.5rem;
        background-color: var(--white);
        width: 30rem;
        border-radius: 20px;
    }

    h1{
        font-weight: 500;
        font-size: 1.5rem;
        text-align: center;
        color: var(--middle-blue);
        margin: 0;
        margin-bottom: 1.5rem; 
    }

    .controls{
        display: flex;
        flex-flow: column;
        gap: 1rem;
        margin-bottom: 2rem;
    }
</style>