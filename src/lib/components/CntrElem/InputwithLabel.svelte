<script>
    export let id = "id";
    export let placeholder = "Введите данные";
    export let required = false;
    export let pattern = '.*';
    export let type = "text";
    export let label ="Название блока";

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

<label>
    <span>{label}</span>
    <input {placeholder} {id} name={id} {type} {required} {pattern}>
</label>

<style>
    label{
        display: flex;
        flex-flow: column;
        align-items: start;
        gap: 0.5rem;
        font-weight: 400;
    }

    span{
        font-size: 0.8rem;
    }

    input{
        border: none;
        background-color: var(--light-blue);
        border-radius: 15px;
        color: var(--deep-blue);
        padding: 0.5rem 1rem;
    }

    input::placeholder{
        color: var(--faded-gray-blue);
    }
</style>