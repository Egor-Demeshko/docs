<script>
	import TopControll from "$lib/components/projects-root/TopControll.svelte";
    import ProjectName from "$lib/components/projects-root/ProjectName.svelte";
    import Button from "$lib/components/CntrElem/Button.svelte";
	import ProjectRight from "$lib/components/projects-root/ProjectRight.svelte";
    import Tooltip from "$lib/components/CntrElem/Tooltip.svelte";
    import { subscribeOnProjectListSet } from "$lib/components/projects-root/ProjectName.svelte";
    import { get } from "svelte/store";
	import { onMount } from "svelte";
    import { userStore, projectsStore, showTooltip } from "$lib/scripts/stores";
    import Modal from "$lib/components/Modal.svelte";
    import ModalWithInput from "$lib/components/ModalWithInput.svelte";


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
    let invalid = false;

    /**флаг для отображения модалки создания нового проекта*/
    let active = false;

    /**
     * @type <Array>
     * @description когда открыт список документов, тут содержится документы активного проекта.
     * документы которые необходимо показать
     */
    let documentsToShow;

    /*TODO и получить список документов из проекта*/


    subscribeOnProjectListSet(shouldBeOpened);
    subscribeOnProjectListSet(openedProject);


    /**создание проекта*/
    async function createProject(e){
        const input = e.target.previousElementSibling;
        let name = input.value;
        

        let valid = input.checkValidity();

        if(!valid) {
            let coors = input.getBoundingClientRect();
            showTooltip.set({show: true, 
                            coors: {x: coors.x + input.offsetWidth / 2, y: coors.y + 10}, 
                            text: "Обязательное поле", 
                            place: "above"});

            setTimeout( () => showTooltip.set({show: false}), 6000);
            return;
        };

        showTooltip.set({show: false});
        active = false;
        console.log("create object");

        let result = await $projectsStore.create(name);
        debugger;
    }


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

<svelte:document on:project_delete={ async () => projects = await $projectsStore.getList()}></svelte:document>


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
                        fnToRunOnClick={() => active = true}
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

<Modal />
<ModalWithInput
    
    bind:active={active}
    text={"Введите название нового проекта"}
    >
    
    <div slot="inner" class="modal_controls">
        <input type="text" class="modal_input" required 
        class:invalid
        on:invalid={ () => invalid = true}/>
        <button on:click={createProject} class="modal_button">Создать</button>
    </div>
    
</ModalWithInput>


<style>
    .modal_input{
        border: 2px solid var(--middle-blue);
        border-radius: 15px;
        background-color: var(--white-blue);
        padding: .5rem 1rem;
        color: var(--deep-blue);
        transition: background 400ms ease, border 400ms ease;
    }

    .modal_input:hover{
        background-color: var(--light-blue);
    }

    .modal_input:focus{
        border: 2px solid var(--orange);
        outline: none;
    }

    .modal_input.invalid{
        border: 2px solid var(--pumpkin);
    }

    .modal_controls{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: stretch;
        gap: 1rem;
    }

    .modal_button{
        appearance: none;
        padding: .5rem 1rem;
        border: 2px solid var(--middle-blue);
        background-color: var(--middle-blue);
        color: var(--white-blue);
        border-radius: 15px;
        cursor: pointer;
        transition: background 400ms ease, border 400ms ease;
    }

    .modal_button:hover{
        background-color: var(--gray-blue);
        border: 2px solid var(--gray-blue);
    }

    .modal_button:focus{
        border: 2px solid var(--orange);
        outline: none;
    }




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