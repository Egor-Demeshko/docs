<script>
    export let data_type = null;

    $: isText = (data_type === "string") ? true : false;
   

    function clickHandle(){
        data_type = (data_type === "string") ? "integer" : "string";
    }

    function keypress(e){
        e.stopPropagation();
        if(e.key === "Enter" || e.key === " "){
            let input = e.target.querySelector("input");
            input.checked = !input.checked;
            data_type = (data_type === "string") ? "integer" : "string";
        };
    }   
</script>


<label tabindex="0" role="button" on:keypress={keypress}>
    <input type="checkbox" name="data_type" value={ (isText) ? "string" : "integer"} checked={ (isText) ? false : true}
    on:click={clickHandle}
    tabindex="-1">
    <div class="toggle__element" tabindex="-1">

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
        background-color: transparent;
        transition: outline 400ms ease;
        cursor: pointer;
    }

    label:focus{
        outline: 2px solid var(--orange);
    }

    input{
        position: absolute;
        appearance: none;
        width: 0px;
        height: 0px;
        top: 0;
        left: 0;
    }


    input:hover{
        outline: none;
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