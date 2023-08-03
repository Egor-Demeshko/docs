<script>
    export let id;
    export let data_type = "";

    $: isText = true;
    $: data_type = (isText) ? "string" : "integer";

    function clickHandle(){
        isText = !isText;
    }
</script>


<label>
    <input {id} type="checkbox" name="data_type" value={ (isText) ? "string" : "integer"} on:click={clickHandle}>
    <div class="toggle__element">

            <span>{(isText) ? "текст" : "число"}</span>

    </div>
</label>

<style>
    label{
        width: 100%;
        display: block;
        border-radius: 10px;
        border: 2px solid var(--middle-blue);
        position: relative;
        height: 1.125rem;
        background-color: var(--white-blue);
    }

    input{
        position: absolute;
        appearance: none;
        width: 0px;
        height: 0px;
        top: 0;
        left: 0;
    }


    .toggle__element{
        position: absolute;
        width: 81%;
        height: 100%;
        background-color: var(--middle-blue);
        border-radius: 10px;
        text-align: center;
        top: 0;
        left: 0;
        transform: translateX(-1px);
        transition: all 600ms ease;
    }


    input:checked ~ .toggle__element{
        transform: translateX(24%);
    }


    .toggle__element span{
        display: block;
        font-size: .875rem;
        line-height: .875rem;
    }

</style>