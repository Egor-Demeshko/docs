<div>
    <svg>
        <use href="/assets/icons/all.svg#plus"></use>
    </svg>
</div>

<style>
    div{
        padding: .875rem;
        background-color: var(--gray-blue);
        width: var(--width);
        height: var(--height);
        border-radius: 25%;
        transition: box-shadow 600ms ease, background 600ms ease;
        position: absolute;
        top: 3.9rem;
        right: .825rem;
    }

    svg{
        fill: var(--white);
        width: 100%;
        height: 100%;
    }

    div:hover{
        box-shadow: 0 0 6px var(--gray-blue);
        background-color: var(--orange);
    }
</style>