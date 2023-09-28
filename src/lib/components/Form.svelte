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
    let disabled = false;


    async function logIn(e){
        e.preventDefault();
        disabled = true;
        const servise = new saveDeleteService("login");
        console.log("[LOGIN]: START LOGGINING");


        /**проверяем валидность полей ввода*/
        for(let key of Object.keys(validData)){
            if(!validData[key].validity) {
                disabled = false;
                return;
            };
        }

        {
            const dataToSend ={
                password: validData.password.value,
                login: validData.login.value
            }


            try{
                let {success, data, detail} = await servise.createInstance(dataToSend);

                if(success && data && $userStore){
                let result = $userStore.saveData(data);
                if(result) goto("/projects");
            }
            } catch (e){
                console.log("[LOGIN]: ", e.message);
                disabled = false;
            }

           console.log("[AFTER login]: data ", data);



            disabled = false;
        }         
    }


    function inputChange(e){

        const target = e.target;
        let id = target.name;

        if(id){
            validData[id]["value"] = target.value;
        }

        console.log("[validData]", validData);
    }


    function validHandle(e){
        const {id, validity} = e.detail;

        validData[id]["validity"] = validity;
    }
</script>

<form>
    <h1>Вход в личный кабинет</h1>
    <div class="controls">
        <InputLogIn id={"login"} name={"login"} placeholder={"Введите ваш логин"}
        type={'text'}
        pattern={"[a-zA-Z_0-9]{4,}"}
        required={true}
        on:valid={validHandle}
        --border-width="2px"
        --border-color="var(--middle-blue)"
        --font-size="1.125rem"
        --color="var(--deep-blue)"
        --background="var(--white-blue)"
        --placeholder="var(--gray-blue)"
        --border-color-hover="var(--pale-orange)"
        --background-hover="var(--white-blue)"
        on:input={inputChange}/>
        
        <InputWithEye id={"password"} name={"password"} placeholder={"Введите ваш пароль"}
        pattern={".{5,}"}
        required={true}
        on:valid={validHandle}
        --border-width="2px"
        --border-color="var(--middle-blue)"
        --font-size="1.125rem"
        --color="var(--deep-blue)"
        --background="var(--white-blue)"
        --placeholder="var(--gray-blue)"
        --border-color-hover="var(--pale-orange)"
        --background-hover="var(--white-blue)"
        type={"password"}
        on:input={inputChange}/>

        <Button name={"Войти"} 
        fnToRunOnClick={logIn}
        {disabled}
        --bg="var(--middle-blue)" 
        --color="var(--white-blue)"
        --bg-hover="var(--gray-blue)"
        --color-hover="var(--white-blue)"
        --border="2px solid var(--middle-blue)"
        --border-hover="2px solid var(--gray-blue)"
        --font-size="1.125rem"
        />
    </div>


    <Button name={"Зарегистрироваться"}
    --bg="var(--light-blue)" 
    --color="var(--middle-blue)"
    --bg-hover="var(--light-gray-blue)"
    --color-hover="var(--middle-blue)"
    --border="2px solid var(--light-blue)"
    --border-hover="2px solid var(--light-gray-blue)"
    --font-size="1.125rem"
    fnToRunOnClick={ () => dispatch("switch_to_registration")}
    on:switch_to_registration/>

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