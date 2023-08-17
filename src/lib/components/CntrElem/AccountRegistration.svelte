<script>
    import Input from "$lib/components/CntrElem/Input.svelte";
    import InputWithEye from "$lib/components/CntrElem//InputWithEye.svelte";
    import Button from "$lib/components/CntrElem/Button.svelte";
    import { createEventDispatcher } from "svelte";

    let dispatch = createEventDispatcher();

</script>

<form>
    <h1>Регистрация</h1>
    <div class="controls">
        <Input id={"reg_login"} placeholder={"Введите ваше имя"}
        type={'text'}
        --border-width="2px"
        --border-color="var(--middle-blue)"
        --font-size="1.125rem"
        --color="var(--deep-blue)"
        --background="var(--white-blue)"
        --placeholder="var(--gray-blue)"
        --border-color-hover="var(--pale-orange)"
        --background-hover="var(--white-blue)"/>
        
        <InputWithEye id={"reg_password"} placeholder={"Введите ваш пароль"}
        --border-width="2px"
        --border-color="var(--middle-blue)"
        --font-size="1.125rem"
        --color="var(--deep-blue)"
        --background="var(--white-blue)"
        --placeholder="var(--gray-blue)"
        --border-color-hover="var(--pale-orange)"
        --background-hover="var(--white-blue)"
        type={"password"}/>

        <InputWithEye id={"reg_password_repeat"} placeholder={"Повторите ваш пароль"}
        --border-width="2px"
        --border-color="var(--middle-blue)"
        --font-size="1.125rem"
        --color="var(--deep-blue)"
        --background="var(--white-blue)"
        --placeholder="var(--gray-blue)"
        --border-color-hover="var(--pale-orange)"
        --background-hover="var(--white-blue)"
        type={"password"}/>

        <Button name={"Зарегистрироваться"} 
        --bg="var(--middle-blue)" 
        --color="var(--white-blue)"
        --bg-hover="var(--gray-blue)"
        --color-hover="var(--white-blue)"
        --border="2px solid var(--middle-blue)"
        --border-hover="2px solid var(--gray-blue)"
        --font-size="1.125rem"/>
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