<section>
    <div class="element_wrapper">
        <div class="icon">
            <svg>
                <use href="/assets/icons/all.svg#doc"></use>
            </svg>
        </div>
        <div>
            <span class="text">Не создано ни одного шаблона, шаблоны создаются в редакторе</span>
        </div>
        <a href="/projects" title="Перейти назад к проектам">К списку проектов</a>
    </div>
</section>

<style>
    section{
        background-color: var(--light-blue);
        border-radius: 20px 0 0 0;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .element_wrapper{
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        padding: 1.5rem;
        justify-content: center;
        align-items: center;
    }

    .icon{
        display: flex;
        justify-content: center;
        align-items: center;
    }

    svg{
        fill: var(--faded-light-blue);
    }

    .text{
        color: var(--faded-gray-blue);
        font-size: 1.125rem;
        font-weight: 500;
    }

    a{
        appearance: none;
        text-decoration: none;
        background-color: var(--middle-blue);
        padding: .5rem 1.5rem;
        cursor: pointer;
        max-width: 300px;
        border-radius: 15px;
        transition: background 400ms ease;
    }

    a:hover{
        background-color: var(--gray-blue);
    }

    a:active{
        background-color: var(--light-slate-gray);
    }

    a:target{
        background-color: var(--middle-blue);
    }   

</style>