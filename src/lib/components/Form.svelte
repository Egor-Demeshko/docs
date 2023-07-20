<script>
    import Input from "./CntrElem/Input.svelte";
    import Button from "./CntrElem/Button.svelte";
</script>

<form>
    <h1>Вход в личный кабинет</h1>
    <div class="controls">
        <Input id={"login"} placeholder={"Введите ваш логин"}/>
        <Input id={"password"} placeholder={"Введите ваш пароль"}/>
        <Button name={"Тест"} --bg="var(--middle-blue)" --color="var(--white-blue)"
        --bg-hover="var(--white-blue)"
        --color-hover="var(--middle-blue)"
        --border="3px solid var(--middle-blue)"
        --border-hover="3px solid var(--white-blue)"/>
    </div>

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
        margin-bottom: 2.5rem; 
    }

    .controls{
        display: flex;
        flex-flow: column;
        gap: 1rem;
    }
</style>