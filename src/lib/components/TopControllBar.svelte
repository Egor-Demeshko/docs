<script>
	import SearchInput from "$lib/components/CntrElem/SearchInput.svelte";
    import {onMount} from "svelte";


    let whereToSearch;
    let MarkOfElementsToSearchFor = ".box_wrapper";
    let sideElementsToBeHidden = ["[data-line]"];

    onMount( () => {
        whereToSearch = document.querySelector(".svg_wrapper");
    });
</script>

<div class="controll">
    <SearchInput {whereToSearch} {MarkOfElementsToSearchFor} {sideElementsToBeHidden}/>
</div>

<style>

    .controll{
        padding: .75rem 1.5rem;
        background-color: var(--middle-blue);
        border-radius: 0 20px 0 0;
        position: relative;
    }

</style>