<script>
    import { fly } from 'svelte/transition';
    import { modalFieldsStore } from "$lib/scripts/stores";

    var active = false;
    $: active = ($modalFieldsStore.show) ? true : false;

</script>


{#if active}
    <div class="wrapper" aria-live="assertive">
        <div class="elements" in:fly={{y: 200, duration: 600}}
        out:fly={{y: 200, duration: 600}}>
            <h4>{$modalFieldsStore.name}</h4>
            <p>{$modalFieldsStore.description}</p>
            <!-- <inpu></input>-->
            <input bind:value={$modalFieldsStore.inputValue} placeholder={$modalFieldsStore.placeholder}/>
            <button on:click={ () => modalFieldsStore.update( (obj) => {
                                    obj.show = false
                                    return obj;
                             })}
            >Сохранить</button>
        </div>    
    </div>
{/if}


<style>
    .wrapper{
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        height: 100vh;
        background-color: var(--transparent-bg);
        z-index: 10;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .elements{
        padding: 2rem 3rem;
        background-color: darkgrey;
    }
</style>