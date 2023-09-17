<script>
    import { createEventDispatcher } from "svelte";

    export let id;
    export let view_type;
    const dispatch = createEventDispatcher();

    $: {
        let displayChangedObj = {};
        displayChangedObj["view_type"] = view_type;
        displayChangedObj["id"] = id;
        dispatch("data-changed", displayChangedObj);
        displayChangedObj = null;
    }
    


    function clickHandle(){
        view_type = (view_type === "radiobutton") ? "drop_list" : "radiobutton";
    }

    function keypress(e){
        e.stopPropagation();
        if(e.key === "Enter" || e.key === " "){
            let input = e.target.querySelector("input");
            input.checked = !input.checked;
            view_type = (view_type === "radiobutton") ? "drop_list" : "radiobutton";
        };
    }  
</script>


<label tabindex="0" role="button" on:keypress={keypress}>
    <span>Отображать элементы в анкете...</span>
    <input {id} type="checkbox" name="view_type" 
    value={ (view_type === "radiobutton") ? false : true}
    checked={ (view_type === "radiobutton") ? false : true}
        on:click={clickHandle}
        tabindex="-1">
    <div class="toggle__tray">
        <div class="toggle__element">
    
                <span class="toggle__text">{(view_type === "radiobutton") ? "группой опций" : "выпадающим списком"}</span>
    
        </div>      
    </div>
</label>

<style>
    label{
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: .875rem;
        gap: .25rem;
        border-radius: 10px;
        position: relative;
        background-color: var(--middle-blue);
        outline: 2px solid transparent;
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
        line-height: .875rem;
    }

</style>