<script>
    import Input from "./CntrElem/Input.svelte";
    import InputWithEye from "./CntrElem/InputWithEye.svelte";
    import Button from "./CntrElem/Button.svelte";
    import { goto } from "$app/navigation";

    function logIn(){
        window.location = window.location.origin + "/r";
    }
</script>

<form>
    <h1>Вход в личный кабинет</h1>
    <div class="controls">
        <Input id={"login"} placeholder={"Введите ваш логин"}
        type={'text'}
        --border-width="2px"
        --border-color="var(--middle-blue)"
        --font-size="1.125rem"
        --color="var(--deep-blue)"
        --background="var(--white-blue)"
        --placeholder="var(--gray-blue)"
        --border-color-hover="var(--pale-orange)"
        --background-hover="var(--white-blue)"/>
        
        <InputWithEye id={"password"} placeholder={"Введите ваш пароль"}
        --border-width="2px"
        --border-color="var(--middle-blue)"
        --font-size="1.125rem"
        --color="var(--deep-blue)"
        --background="var(--white-blue)"
        --placeholder="var(--gray-blue)"
        --border-color-hover="var(--pale-orange)"
        --background-hover="var(--white-blue)"
        type={"password"}/>

        <Button name={"Войти"} 
        fnToRunOnClick={logIn}
        --bg="var(--middle-blue)" 
        --color="var(--white-blue)"
        --bg-hover="var(--gray-blue)"
        --color-hover="var(--white-blue)"
        --border="2px solid var(--middle-blue)"
        --border-hover="2px solid var(--gray-blue)"
        --font-size="1.125rem"/>
    </div>


    <Button name={"Зарегистрироваться"}
    --bg="var(--light-blue)" 
    --color="var(--middle-blue)"
    --bg-hover="var(--light-gray-blue)"
    --color-hover="var(--middle-blue)"
    --border="2px solid var(--light-blue)"
    --border-hover="2px solid var(--light-gray-blue)"
    --font-size="1.125rem"/>

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