<script>
    import {scale} from "svelte/transition";
    export let quantity = 1;
</script>


<div in:scale
    out:scale>
    <span>{quantity}</span>
</div>

<style>
    div{
        position: var(--position);
        display: flex;
        justify-content: center;
        align-items: center;
        width: 1.3rem;
        height: 1.3rem;
        right: 0;
        top: 0;
        transform: translate(50%, -50%);
        background-color: var(--pumpkin);
        border-radius: 50%;
    }

    div>span{
        font-size: .875rem;
        color: var(--white-blue);
    }
</style>