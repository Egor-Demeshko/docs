<script>
    /**ELEMENT TO SHOW VARIBLES PRESENTATION*/
    export let name;
    export let content;
    
</script>


<label>
    <input name={name} value="{content}" placeholder="Укажите значение"/>
    <span>Введите значение переменной</span>
</label>


<style>
    label{
        display: block;
        padding: 1rem;
        position: relative;
        inline-size: 100%;
        border-bottom: 2px solid grey;
    }

    span{
        position: absolute;
        left: 1.5rem;
        top: 0;
        transform: translateY(-50%);
        font-size: 0.8rem;
        font-weight: bold;
        color: grey;
    }

    input{
        padding: .5rem 1rem;
        border: none;
        border-radius: 10px;
        font-size: 1.5rem;
        inline-size: 100%;
    }
</style>