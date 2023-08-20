<script>

    let text = 'Нежилое помещение';
    export let name = "";
</script>

<label>
    <input type="radio" {name} >
    <div class="custom_input">
        <div class="custom_input__inner">

        </div>
    </div>
    <span>{text}</span>
</label>

<style>
    label{
        display: flex;
        gap: 1.125rem;
        position: relative;
    }

    label input{
        appearance: none;
        position: absolute;
        width: 1px;
        height: 1px;
    }

    .custom_input{
        border-radius: 50%;
        padding: 3px;
        width: 1rem;
        height: 1rem;
        border: 1px solid var(--gray-blue);
        background-color: var(--white-blue);
        text-align: center;
        transition: background 400ms ease;
    }

    label:hover .custom_input{
        background-color: var(--light-blue);
    }

    .custom_input__inner{
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: var(--gray-blue);
        transform: scale(0);
        transition: transform 400ms ease;
    }

    input:checked~.custom_input .custom_input__inner{
        transform: scale(100%);
    }

    span{
        color: var(--middle-blue);
    }
</style>