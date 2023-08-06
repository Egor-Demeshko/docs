<script>
	import { onMount } from "svelte";
    import { fly } from "svelte/transition";


    export let message = '';
    /**айди блока от которого идет ошибка*/
    export let blockId = "";
    export let closeMessageCallback;


    onMount( () => {
        if(closeMessageCallback){

          setTimeout( () => {
                closeMessageCallback(blockId, message);
            }, 10000);

        }
    });


    function closeClick(){
        closeMessageCallback(blockId, message);
    }

</script>



<div class="message"
in:fly={{y: 100}}
out:fly={{x: 50}}>
    <span>
        {message}
    </span>
    <svg on:click={closeClick} class="icon" width="8" height="11" viewBox="0 0 8 11" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.45757 8.30492C7.84748 8.80487 7.84748 9.6136 7.45757 10.1121C7.26261 10.362 7.01032 10.4958 6.74656 10.4958C6.49427 10.4958 6.24197 10.3782 6.04702 10.1121L4.00573 7.5109L1.96445 10.1121C1.7695 10.362 1.5172 10.4958 1.25344 10.4958C1.00115 10.4958 0.737385 10.362 0.542431 10.1121C0.152523 9.6136 0.152523 8.80487 0.542431 8.29022L2.58372 5.68758L0.542431 3.06876C0.152523 2.57029 0.152523 1.74685 0.542431 1.24691C0.932339 0.745496 1.56307 0.745496 1.96445 1.24691L4.00573 3.86279L6.03555 1.24691C6.43693 0.745496 7.06766 0.745496 7.45757 1.24691C7.84748 1.74685 7.84748 2.57029 7.45757 3.06876L5.41628 5.68758L7.45757 8.30492Z"/>
    </svg>
</div>


<style>
    .message{
        padding: 1rem 1.5rem 1rem 1rem;
        font-size: .875rem;
        border: 2px solid var(--middle-blue);
        border-radius: 15px;
        width: 280px;
        font-weight: 500;
        font-style: italic;
        background-color: var(--white-blue);
        position: relative;
    }

    .message span{
        color: var(--pumpkin);
    }

    .icon{
        position: absolute;
        top: 1rem;
        right: .625rem;
        cursor: pointer;
    }

    .icon path{
        fill: var(--middle-blue);
    }

    .icon:hover path{
        fill: var(--pale-orange);
    }

</style>