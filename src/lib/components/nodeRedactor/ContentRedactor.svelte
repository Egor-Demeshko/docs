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
    <textarea {placeholder} {id} name={id} {type} {required} {pattern} autocomplete="off" rows="3"></textarea>
</label>

<style>
    label{
        display: flex;
        flex-flow: column;
        align-items: start;
        gap: 0.25rem;
        font-weight: 400;
        width: 100%;
    }

    span{
        font-size: 0.8rem;
    }

    textarea{
        border: none;
        background-color: var(--light-blue);
        border-radius: 15px;
        color: var(--deep-blue);
        padding: 0.5rem 1rem;
        resize: vertical;
        scrollbar-width: 8px;
        scrollbar-color: var(--middle-blue) transparent;
        width: 100%;
    }

    textarea::-webkit-scrollbar{
       width: .5rem;
    }

    textarea::-webkit-scrollbar-track{
        display: none;
    }


    textarea::-webkit-scrollbar-thumb {
        background-color: var(--gray-blue); 
        border-radius: 10px;
        transition: background 400ms ease;
        cursor: pointer;

    }

    textarea::-webkit-scrollbar-thumb:hover{
        background-color: var(--middle-blue);
    }

    textarea::placeholder{
        color: var(--faded-gray-blue);
    }
</style>