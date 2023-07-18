<script>
    import { activeBlocks, storeForSimpleTexts } from "$lib/scripts/stores";
    import gainBlocksData from "$lib/scripts/controllers/gainBlocksData";

    /**@type {Array}*/
    $: blockToShowData = gainBlocksData( $activeBlocks );
    $: populateVars(blockToShowData);

    let id = '';
    let bName = '';
    let bContent = '';
    let showFullBlock = false;
    let focusActive = '';
    

    function populateVars(blockToShowData){
        if(blockToShowData.length === 0 || !blockToShowData) {
            showFullBlock = false;
            return;
        };
        let obj = blockToShowData[0];

        id = obj.id;
        bName = obj.name;
        bContent = obj.content;

        showFullBlock = true;
    }


    function focusIn(){
        focusActive = "active";
        activeBlocks.update( (set) => {
            set.add(id);
            return set;
        })

        $storeForSimpleTexts.forEach( (elObj) => {
            elObj.setActive(id);
        });
    }


    function focusOut(){
        focusActive = "";
        activeBlocks.update( (set) => {
            set.delete(id);
            return set;
        });
        
        
        

        $storeForSimpleTexts.forEach( (elObj) => {
            elObj.setInactive(id);
        });
    }

</script>


<section>
    {#if showFullBlock}
        <div class="text-contol">
            <h3>{bName}</h3>
            <textarea on:focusin={focusIn}
            on:focusout={focusOut}
            >{bContent}</textarea>
        </div>
        <div>
            <p>Окошко справа</p>
        </div>
    {:else}
        <p class="choose_message">
            Для редактирования, выбирите блок сверху
        </p>
    {/if}
</section>


<style>
    section{
        flex: 1;
        padding: 2rem;
        display: flex;
        align-items: center;
    }

    .text-contol{
        text-align: left;
    }

    textarea{
        height: 100%;
    }
</style>