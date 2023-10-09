<script>
    import Button from "$lib/components/CntrElem/Button.svelte";
    import { fade } from "svelte/transition";
    import { cubicInOut } from "svelte/easing";
    import { projectsStore, modalFieldsStore } from "$lib/scripts/stores";
    import { goto, preloadCode } from "$app/navigation";
    import Storage from "$lib/scripts/controllers/instances/Storage.js";


    export let directionOfanimation = false;
    export let id;

    let show = false;


    $: if(directionOfanimation){
        setTimeout( () => show = true, 600);
    } else {
        show = false;
    }


    function whoosh(node, params) {
        //const existingTransform = getComputedStyle(node).height.replace('none', '0');

        return {
            delay: 200,
            duration: 400,
            easing: params.easing || cubicInOut,
            css: (t, u) => `height: ${t * 28}px; margin-top: ${t * 10}px;`
        };
    }

    async function preloadRedactor(){
        console.log("~~~TEST ~~~");
        let token = await $projectsStore.getToken();

        document.cookie = `jwt=${token}; max-age=900; samesite=lax`;
        document.cookie = `project_id=${id}; max-age=900; samesite=lax`;

        preloadCode("/redactor");
    }

    /** отправляет в редактор по id из пропса, устанавливает куки */
    async function navigateToRedactor(){
        $projectsStore.setActiveProject(id);
        let token = await $projectsStore.getToken();

        if(token) {
            document.cookie = `jwt=${token}; max-age=900; samesite=lax`;
            document.cookie = `project_id=${id}; max-age=900; samesite=lax`;
            goto("/redactor");
        } 

    }

    async function navigateToAnkets(){
        $projectsStore.setActiveProject(id);
        let token = await $projectsStore.getToken();
        if(token) {
            document.cookie = `jwt=${token}; max-age=900; samesite=lax`;
            document.cookie = `project_id=${id}; max-age=900; samesite=lax`;
            goto("/anketa");
        } 
    }

    function deleteProject(){
        /**
         *  show: false,
                text: '',
                errorCallback: null,
                okCallback: null,
                result: false
        */
        modalFieldsStore.set(
            {
                show: true,
                text: 'Удалить проект навсегда? Отменить это действие нельзя!',
                errorCallback: () => modalFieldsStore.set({
                                                            show: false,
                                                            text: '',
                                                            errorCallback: null,
                                                            okCallback: null,
                                                            result: false
                                                        }),
                okCallback: processDelete
            }
        );
    }


    async function processDelete(){
        modalFieldsStore.set({
                                show: false,
                                text: '',
                                errorCallback: null,
                                okCallback: null,
                                result: false
                            });

        //необходимо удалить проект, и возможно обновить список проектов.
        //если удачно, послать событие listupdated
        //projects запросит новый списко
        let result = await $projectsStore.delete(id);

        if(result.success){
            document.dispatchEvent( new CustomEvent("project_delete"))
        }
    }
</script>


<div class="buttons_row" transition:whoosh>
    {#if show}
        <div class="buttons_row__left" 
        in:fade={{duration: 200}}
        out:fade={{duration: 200, delay: 100}}>
            <Button 
            name={"Редактировать"}
            no_wrap={true}
            fnToRunOnClick={navigateToRedactor}
            --bg="var(--light-blue)"
            --color="var(--middle-blue)"
            --color-hover="var(--middle-blue)"
            --border="2px solid var(--middle-blue)"
            --border-hover="2px solid var(--middle-blue)"
            --font-size=".875rem"
            --padding=".3rem 1rem"
            --bg-hover="var(--light-gray-blue)"
            on:pointerenter={ preloadRedactor }/>
            <Button 
            name={"Заполнить анкеты"}
            no_wrap={true}
            --bg="var(--light-blue)"
            --color="var(--middle-blue)"
            --color-hover="var(--middle-blue)"
            --border="2px solid var(--middle-blue)"
            --border-hover="2px solid var(--middle-blue)"
            --font-size=".875rem"
            --padding=".3rem 1rem"
            --bg-hover="var(--light-gray-blue)"
            fnToRunOnClick={ navigateToAnkets }/>        
        </div>
        <div class="buttons_row__right">
            <Button 
            name={"Удалить проект"}
            no_wrap={true}
            fnToRunOnClick={ deleteProject }
            --bg="var(--light-blue)"
            --color="var(--middle-blue)"
            --color-hover="var(--middle-blue)"
            --border="2px solid var(--middle-blue)"
            --border-hover="2px solid var(--middle-blue)"
            --font-size=".875rem"
            --padding=".3rem 1rem"
            --bg-hover="var(--light-gray-blue)"/>
        </div>
    {/if}
</div>

<style>
    .buttons_row{
        display: flex;
        justify-content: space-between;
        margin-top: .5rem;
        height: 29px;
    }

    .buttons_row__left{
        display: flex;
        justify-content: space-evenly;
        gap: .5rem;
    }

    .buttons_row__right{
        display: flex;
        justify-content: end;
        gap: .5rem;
    }
</style>