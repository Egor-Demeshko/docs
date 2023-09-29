<script>
    import { showTooltip, docxController } from "$lib/scripts/stores";
    import { downloadState } from "$lib/components/Download.svelte";
    
    /**
    * @description массив документов, полученных от сервера
    *   {
            "id": {Number},
            "project_id": {Number},
            "name": <{String}>,
            "created_at": <{Date}>
        }
     */
    export let documentObj;


    function pointerEvent(e){
        let {x, y} = e;

        let targetCoors = e.target.getBoundingClientRect();
        let top = Math.round(targetCoors.top);

        

        if(top + 2 >= y && top - 2 <= y){

            showTooltip.set( {
                show: true,
                coors: {
                    x,
                    y: y + 10
                },
                text: "Перейти к документу",
                place: "above" 
            } );
           
        } else {
            
            showTooltip.set( {
                show: true,
                coors: {
                    x,
                    y: y - 10
                },
                text: "Перейти к документу",
                place: "under" 
            } );

        }



    }


    function pointerLeave(){
        showTooltip.set(false);
    }


    function clickWithLock(){

        let lock = false;

        return goDownload;
        async function goDownload(){
            if(lock) return;
            
            lock = true;
            
            const {project_id, id: document_id, name} = documentObj;
            try {
                let url = await $docxController.downloadDocument(project_id, document_id);

                downloadState.set({url, name: name});
                lock = false; 
                
            } catch(e) {
                console.log("[DOCNAME]: error on download: ", e.message);
                lock = false;

                document.dispatchEvent( new CustomEvent( "error", {detail: {
                    err_data: [
                        {
                            blockId: 0,
                            message: "Ошибка! Не удалось загрузить документ! Попробуйте еще раз",
                            err_id: 1000,
                            err_type: "emergency"
                        }
                    ]
                }} ) );
            }
        }
    }

    const click = clickWithLock();


</script>


<div class="doc_name" tabindex="0"
on:pointerenter={pointerEvent}
on:pointerleave={pointerLeave}
on:click={click}>
    <svg class="icon">
        <use href="/assets/icons/all.svg#doc"></use>
    </svg>
    <span class="name">{documentObj.name}</span>
</div>

<style>
    .doc_name{
        padding: .5rem 1.125rem;
        display: flex;
        gap: .5rem;
        justify-content: start;
        align-items: center;
        background-color: var(--light-blue);
        color: var(--middle-blue);
        border-radius: 20px;
        transition: background 600ms ease-in-out;
        cursor: pointer;
    }

    .doc_name:hover{
        background-color: var(--light-gray-blue);
    }

    .doc_name:focus{
        outline: 2px solid var(--orange);
    }

    .name{
        color: var(--middle-blue);
    }

    .icon{
        height: 1.5rem;
        width: 1.5rem;
        fill: var(--middle-blue);
    }
</style>