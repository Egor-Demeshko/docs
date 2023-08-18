<script>
    import { showTooltip } from "$lib/scripts/stores";
    
    export let name = "имя документа по умолчанию.docx";

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
</script>


<div class="doc_name" tabindex="0"
on:pointerenter={pointerEvent}
on:pointerleave={pointerLeave}>
    <svg class="icon">
        <use href="/assets/icons/all.svg#doc"></use>
    </svg>
    <span class="name">{name}</span>
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