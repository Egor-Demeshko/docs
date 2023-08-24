<div class="spinner">

</div>

<style>
    .spinner{
        width: 2rem;
        height: 2rem;
        background-color: var(--middle-blue);
        border-radius: 6px;
        animation-name: rotate;
        animation-fill-mode: forwards;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
        animation-duration: 1s;
    }

    @keyframes rotate{
        0%{
            transform: rotateZ(0);
        }

        50%{
            transform: rotateZ(180deg);
        }

        100%{
            transform: rotateZ(360deg);
        }
    }
</style>