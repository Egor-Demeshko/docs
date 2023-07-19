<script>
    export let id = "login";
    export let type = "text";
    export let placeholder = "Логин";
    export let required = false;
    export let pattern = '.*';

    let valid = '';
    let invalid = '';
    let input;


    function startValidation(){
        let reg = new RegExp(pattern);

        if(!input.value && !required) {
            setValid();
            return;
        };

        if(reg.test(input.value) && input.checkValidity()){
            setValid();
        } else {
            setInvalid();
        }
    }


    function setValid(){
        invalid = false;
        valid = true; 
    }


    function setInvalid(){
        valid = false;
        invalid = true;
    }


    function blurHandler(){
        startValidation();
    }
</script>    

<input {placeholder} {id} name={id} {required} {pattern} {type} />

<style>
    input{
        border: 3px solid var(--middle-blue);
        padding: var(--padding);
        border-radius: 30px;
        font-size: 1.125rem;
        width: 100%;
        color: var(--middle-blue);
    }


    input::placeholder{
        color: var(--faded-middle-blue);
        font-style: italic;
    }


</style>
