<script>
	import TopControll from "$lib/components/projects-root/TopControll.svelte";
    import ProjectName from "$lib/components/projects-root/ProjectName.svelte";
    import Button from "$lib/components/CntrElem/Button.svelte";
	import DocName from "$lib/components/CntrElem/DocName.svelte";
    import Tooltip from "$lib/components/CntrElem/Tooltip.svelte"


    /*TODO получаем список проектов этого пользователя*/
    let projects;

    /*TODO и получить список документов из проекта*/
</script>


<div class="wrapper">
        
        <TopControll />
    
        <div class="projects">
            <div class="projects__left">
                <ul class="project__list">
                    <ProjectName />
                    <ProjectName />
                    <ProjectName />
                    <ProjectName />
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
    
            <div class="projects__right">
                <DocName/>
                <DocName/>
                <DocName/>
            </div>
    
        </div>
</div>

<Tooltip />


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
        gap: 1.5rem;
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

    .projects__right{
        flex: 2;
        border-radius: 20px 0 0 0;
        padding: 3rem 1.5rem 0;
        display: flex;
        flex-direction: column;
        gap: 1rem;
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