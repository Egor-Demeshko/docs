<script>
    export let id;

    $: isText = true;

    function clickHandle(){
        isText = !isText;
    }
</script>


<label>
    <span>Отображать элементы в анкете...</span>
    <input {id} type="checkbox" name="data_type" value={ (isText) ? "string" : "integer"} on:click={clickHandle}>
    <div class="toggle__tray">
        <div class="toggle__element">
    
                <span class="toggle__text">{(isText) ? "группой радиокнопок" : "выпадающим списком"}</span>
    
        </div>
    </div>
</label>

<style>
    label{
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: .25rem;
        border-radius: 10px;
        position: relative;
        background-color: var(--middle-blue);
    }

    input{
        position: absolute;
        appearance: none;
        width: 0px;
        height: 0px;
        top: 0;
        left: 0;
    }


    .toggle__tray{
        width: 100%;
        height: 1.5rem;
        position: relative;
        border: 2px solid var(--white-blue);
        border-radius: 10px;
    }


    .toggle__element{
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 81%;
        height: 100%;
        background-color: var(--white-blue);
        border-radius: 8px;
        top: 0;
        left: 0;
        transform: translateX(-1px);
        transition: all 600ms ease;
    }

    .toggle__text{
        color: var(--middle-blue);
    }


    input:checked ~ .toggle__tray > .toggle__element{
        transform: translateX(24%);
    }


    .toggle__element span{
        display: block;
        font-size: .875rem;
        line-height: .875rem;
    }

</style>