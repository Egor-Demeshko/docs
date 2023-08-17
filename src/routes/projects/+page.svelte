<script>
	import TopControll from "$lib/components/projects-root/TopControll.svelte";
    import ProjectName from "$lib/components/projects-root/ProjectName.svelte";


    /**получаем список проектов этого пользователя*/
    let projects 
</script>


<div class="wrapper">
        
        <TopControll />
    
        <div class="projects">
            <div class="projects__left">
                <ul class="project__list">
                    <ProjectName />
                </ul>
    
            </div>
    
            <div class="projects__right">
    
            </div>
    
        </div>
</div>


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
    }

    .projects__right{
        flex: 2;
        position: relative;
        border-radius: 20px 0 0 0;
        padding: 3rem 1.5rem 0;
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



</style>