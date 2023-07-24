<!-- seems like we don't need that block -->
<!-- Warning possible unnecessary block -->

<script>
    export let isActive = true;
</script>

<label>
    Значение блока по умолчанию
    <input checked={ (isActive) ? true : false}>
    <div>
        <svg>
            <use href="$lib/script/icons/all.svg#checkbox"></use>
        </svg>
    </div>
</label>

<style>
    label{
        display: flex;
    }
</style>