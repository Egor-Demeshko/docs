<script>
    import Message from "$lib/components/Message.svelte";
    import { onMount, tick } from "svelte";

    /**СООБЩЕНИЯ появляется при срабатывании события я error на document*/

    /**reveived error messages*/
    let messages = [];
    let nodeRedactor;
    let nodeCordinates = '';
    let bottomCor;

    onMount( () => {
        nodeRedactor = document.querySelector("form[data-elements='node_redactor']") || document.getElementById("messages_anchor");
        updateCors();
        document.addEventListener("redactor-сhanged", updateCors);
    });


    function updateCors(){
        nodeCordinates = nodeRedactor.getBoundingClientRect();
        bottomCor = nodeCordinates.height + 8;
    }


    function errorHandle({ detail }){
        let data = detail.err_data;
        
        //console.log("[MessagesContainer]: errorHandel before push: ", data);
        for(let i = 0; i < data.length; i++){
            
            let {blockId, message, err_id, err_type} = data[i];

            //проблема. при первой валидации, если две ошибки сразу, то вторая не добавляется
            for(let i = 0; i < messages.length; i++){
                if(messages[i]["err_id"] === err_id && messages[i]["blockId"] === blockId) return;
            }


            messages.push( {
                blockId,
                message,
                err_id,
                err_type
            } );
            
            messages = messages;
        }
        //console.log("[MessagesContainer]: {errorHandle}: all error messages: ", messages);

    }


    async function deleteMessageFromList(id, err_id){
        
        messages = messages.filter( (errObj) => {

            if(errObj.err_id === err_id && errObj.blockId === id)return false;
            return true;
        });
        await tick();
        //console.log("[MessagesContainer]: delete elements from messages: ", messages);
    }
</script>


<svelte:document on:error={errorHandle}></svelte:document>


<div class="messages" style="bottom: {bottomCor}px">
    {#each messages as {blockId, message, err_type, err_id}}
        <Message {blockId} {message} {err_type} {err_id} closeMessageCallback={ deleteMessageFromList }/>
    {/each}
</div>

<style>
    .messages{
        position: absolute;
        right: 8px;
        z-index: 1;    
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        align-items: end;
    }

    @media print{
        .messages{
            display: none;
        }
    }
</style>