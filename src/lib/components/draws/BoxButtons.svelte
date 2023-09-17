<script>
    import { fade } from "svelte/transition";
    import { showTooltip, modalFieldsStore } from "$lib/scripts/stores";
    import { deleteNode } from "$lib/scripts/controllers/nodes/createDeleteNode";
    import { addExcitingNodeToRedator } from "$lib/scripts/controllers/nodes/processStores/addNodesStore";
	import { getContext } from "svelte";

    export let id = '';
    export let node_type = "text";

    const controller = getContext('controller');

    /**POINTER EVENTS HANDLER*/
/**/function pointerEnter(e){
        /* console.log('[BoxButton]: pointerenter: ', {
            x: e.clientX,
            y: e.clientY
        });*/
        
        showTooltip.update( () => {
                return {
                    show: true,
                    place: "under",
                    coors: {
                        x: e.clientX,
                        y: e.clientY
                    },
                    text: "Создать переменную в тексте документа"
                }
        });
    }

    function pointerLeave(e){
        showTooltip.update( () => {
            return {show: false,
                    place: '',
                    coors: {}};
        });
    }

    function pointerEnterDelete(e){   
        //console.log('[BoxButton]: pointerenter node create: ', e.target);

        showTooltip.update( () => {
            return {
                show: true,
                place: "above",
                coors: {
                    x: e.clientX,
                    y: e.clientY
                },
                text: "Удалить узел"
            }
        });
    }
    /* --------- END OF POINTER EVENTS -------- */


    /**ОБЩИЕ ФУНКЦИИ, по алфавиту*/
    /**стартует процесс добавление узла в текст, тут работаем уже со созданным узлом*/
    function addNode(){
        hideTooltip();
        document.dispatchEvent(new CustomEvent("error", {
            detail: {
                err_data: [
                    {
                        message: "Выделите область в документе, чтобы добавить блок в текст",
                        err_type: "simple",
                        blockId: id,
                        err_id: 900
                    }
                ]
            }
        }));


        addExcitingNodeToRedator.set( {
            status: "start",
            id 
        } );
    }
    
    
    /**показывает модалку и передает коллбек*/
    function deleteFlow(){
        
        hideTooltip();
        
        
        modalFieldsStore.update( () => {
            return {
                show: true,
                text: "Вы действительно хотите безвозвратно удалить блок?",
                okCallback: deleteNodeStart
            }
        });    
    }
    

    function deleteNodeStart(e){
        console.log("[BoxButton]: deleteNode");

        deleteNode(id, controller);
        pointerLeave();
        modalFieldsStore.update( () => {
            return {
                show: false,
                coors: null,
                okCallback: null
            }
        });
    }

    /** cкрывает tooltip*/
    function hideTooltip(){
        showTooltip.update( () => {
            return {
                show: false,
                place: "",
                coors: null,
                text: ""
            }
        });
    }
    
    
    
</script>


<div in:fade={{duration: 200}}
    out:fade={{duration: 200}} class="buttons"
    role="tooltip">
    <svg class="buttons__icons delete"
    on:pointerenter={pointerEnterDelete}
    on:pointerleave={pointerLeave}
    on:click={ deleteFlow } >
        <use href="/assets/icons/all.svg#box_cancel"></use>
    </svg>
    
    {#if node_type !== "checkbox"}
        <svg class="buttons__icons"
        on:pointerleave={pointerLeave}
        on:pointerenter={pointerEnter}
        on:click={addNode}>
            <use href="/assets/icons/all.svg#create_node"></use>
        </svg>
    {/if}
</div>


<style>
    .buttons{
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
    }

    .buttons__icons{
        fill: var(--light-slate-gray);
        width: 100%;
        height: 100%;
        transition: fill 400ms ease-in-out;
    }

    .buttons__icons:hover{
        fill: var(--orange);
    }

    .buttons__icons.delete:hover{
        fill: var(--pumpkin);
    }
</style>
