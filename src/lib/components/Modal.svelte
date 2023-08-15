<script>
    import { fly } from 'svelte/transition';
    import { modalFieldsStore } from "$lib/scripts/stores";
    import Button from "$lib/components/CntrElem/Button.svelte";

    var active = false;
    $: active = ($modalFieldsStore.show) ? true : false;


    function closeModal(){
        modalFieldsStore.update( () => {
            return {
                show: false,
                text: '',
                errorCallback: null,
                okCallback: null,
                result: false
            }
        });
    }


    function activateClickHandle(){
        setTimeout( () => {
            document.addEventListener( "click", (e) => {
                if(e.target.tagName === "DIV" && e.target.classList.contains("elements")) return;
                closeModal();
            }, {once:true});
        });
    }

</script>


{#if active}
    <div class="wrapper" aria-live="assertive" use:activateClickHandle>
        <div class="elements" in:fly={{y: 100, duration: 600}}
        out:fly={{y: 100, duration: 600}}>
            <span>{$modalFieldsStore.text}</span>
            <div class="buttons">
                <Button name={"Удалить"} fnToRunOnClick={$modalFieldsStore.okCallback}
                --color="var(--middle-blue)"
                --border="2px solid var(--middle-blue)"
                --padding=".5rem"
                --bg="var(--white-blue)"
                --bg-hover="var(--light-gray-blue)"
                --color-hover="var(--middle-blue)"
                --border-hover="2px solid var(--middle-blue)"
                --font-size=".875rem"/>
                <Button name={"Отмена"} fnToRunOnClick={($modalFieldsStore.errorCallback || closeModal)}
                --color="var(--white-blue)"
                --bg="var(--middle-blue)"
                --padding=".5rem"
                --border="2px solid var(--middle-blue)"
                --bg-hover="var(--gray-blue)"
                --border-hover="2px solid var(--gray-blue)"
                --font-size=".875rem"
                setFocus={true}/>
            </div>
            <svg class="icon" on:click={closeModal}>
                <use href="/assets/icons/all.svg#plus"></use>
            </svg>
        </div>    
    </div>
{/if}


<style>
    .wrapper{
        position: fixed;
        top: 0;
        right: 0;
        width: 100vw;
        height: 100vh;
        background-color: transparent;
        z-index: 100;
        display: flex;
        justify-content: center;
        align-items: center;
        pointer-events: none;
        font-size: .875rem;
    }

    .elements{
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: .625rem 1rem 1.25rem 1rem;
        background-color: var(--white-blue);
        pointer-events: all;
        min-width: 280px;
        border: 2px solid var(--middle-blue);
        border-radius: 15px;
        position: relative;
    }

    .elements>span{
        color: var(--middle-blue);
        padding: 0 .5rem 0 0;
        pointer-events: none;
    } 

    .buttons{
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
    }

    .icon{
        width: .8rem;
        height: .8rem;
        transform: rotateZ(45deg);
        fill: var(--middle-blue);
        transition: fill 400ms ease-in-out;
        position: absolute;
        top: .75rem;
        right: .675rem;
        cursor: pointer;
    }

    .icon:hover{
        fill: var(--orange);
    }
</style>