<script>
	import TopControll from "$lib/components/projects-root/TopControll.svelte";
    import ProjectName from "$lib/components/projects-root/ProjectName.svelte";
    import Button from "$lib/components/CntrElem/Button.svelte";
	import ProjectRight from "$lib/components/projects-root/ProjectRight.svelte";
    import Tooltip from "$lib/components/CntrElem/Tooltip.svelte";
    import { subscribeOnProjectListSet } from "$lib/components/projects-root/ProjectName.svelte";
    import { get } from "svelte/store";
	import { onMount } from "svelte";
    import { userStore, projectsStore } from "$lib/scripts/stores";


    /*TODO получаем список проектов этого пользователя*/
    /**@description  [
            {
                "id": 1,
                "name": "new_project 1",
                "created_at": "2023-09-04T17:46:48.067289+00:00",
                "documents": [
                    {
                        "id": 1,
                        "project_id": 1,
                        "name": "first document 1",
                        "created_at": "2023-09-05T18:31:04.730164+00:00"
                    }
                ]
            }
        ]*/
    let projects = [];
    $: console.log("[projects PAGE]: projects[]: ", projects);
    let projectElement;
    let showRight = false;

    /**
     * @type <Array>
     * @description когда открыт список документов, тут содержится документы активного проекта.
     * документы которые необходимо показать
     */
    let documentsToShow;

    /*TODO и получить список документов из проекта*/


    subscribeOnProjectListSet(shouldBeOpened);
    subscribeOnProjectListSet(openedProject);

    function shouldBeOpened({set}){
        /*
            анимация правого окна, на открытие закрытие.
            мы получаем текущее состояние сет. 
            по нему пробегаемся, если все сторы false. 
            стартуем анимацию закрытия.
            если есть тру. 
            то если сейчас закрто, то открываем
            если уже открыто ничего не делаем.

            сама анимация, это комбинация изменений
            например, за 200мс надо чтобы исчезла внутрянка.
            и затем за оставшиеся сама анимация 400. 
            в течении 400 мы меняем flex basis
        */
        let deciding = false;

        
        set.forEach( (store, i) => {
            
            let bool = get(store);
            
            if(bool)  deciding = true;
        });

        if(deciding && !showRight) showRight = true;
        if(!deciding && showRight) showRight = false;
    }

    /**
     * 
     * @param data {Array}
     * @description функция  коллбек, передает список документов, активного проекта.
     */
    function openedProject({data}){
        documentsToShow = (data) ? data : null;
        
        console.log('[page.svelte]: ', data);
    }


    /*правильное добавление gap*/
    $: if(!showRight && projectElement){
        setTimeout(() => {
            projectElement.style.gap = "0";
        }, 350);
    } else if(showRight) {
        projectElement.style.gap = "1.5rem";
    }

    onMount( async () => {
        
        projects = await $projectsStore.getList();
    });
</script>


<div class="wrapper">
        
        <TopControll />
    
        <div class="projects" bind:this={projectElement}>
            <div class="projects__left">
                <ul class="project__list">
                    {#each projects as project}
                    <ProjectName {project}/>
                    {/each}
                </ul>
                
                <div class="projects__new_project">
                    <div>
                        <Button 
                        name={"Создать новый проект"}
                        --bg="var(--middle-blue)"
                        --bg-hover="var(--gray-blue)"
                        --color="var(--light-blue)"
                        --color-hover="var(--light-blue)"
                        --border="2px solid var(--middle-blue)"
                        --border-hover="2px solid var(--gray-blue)"
                        --font-size=".875rem"
                        --padding=".5rem 4.6rem"
                        />
                    </div>
                </div>
            </div>

            <div class="projects__right" class:showRight>
                {#if showRight}
                    <ProjectRight {documentsToShow}/>
                {/if}
            </div>
    
        </div>
</div>

<Tooltip --bg="var(--white)"
--color="var(--faded-gray-blue)"/>


<style>
    .wrapper{
        display: flex;
        flex-direction: column;
        justify-content: start;
        width: 79vw;
        min-width: 1000px;
        height: calc(100% - 5.5rem);
        margin: 0 auto;
        background-color: var(--middle-blue);
        border-radius: 20px 20px 0 0;
        transform: translate(0);
    }

    .projects{
        flex: 1 0;
        display: flex;
        gap: 0;
        width: 100%;
        height: 100%;
        align-items: stretch;
    }

    .projects__left{
        flex: 3;
        display: flex;
        flex-direction: column;
        border-radius: 0 20px 0 0;
        position: relative;
    }

    .projects__right.showRight{
        flex: 2;
        padding: 3rem 1.5rem 0;

        /*animation-name: close;
        animation-duration: 400ms;
        animation-fill-mode: forwards;
        animation-timing-function: ease-out;*/
    }

    .projects__right{
        flex: 0;
        border-radius: 20px 0 0 0;
        padding: 0;
        transition: all 400ms ease-out;
    }

    .projects__left,
    .projects__right{
        background-color: var(--white-blue);
    }


    .project__list{
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .projects__new_project{
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1rem;
        position: absolute;
        width: 100%;
        bottom: 0;
        left: 0;
        background-color: var(--light-blue);
    }
</style>