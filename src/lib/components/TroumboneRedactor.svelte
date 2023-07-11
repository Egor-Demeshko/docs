<script>
    import jQuery from 'jquery'; 
    import { onMount } from 'svelte';
    import {storeForSimpleTexts, docRoot} from '$lib/scripts/stores';

    export let html = '';
    let editor;
    let container;
    let root;

    onMount( async () => {
        if (!window.jQuery) window.jQuery = jQuery;
        await import('trumbowyg');

        window.jQuery.trumbowyg.svgPath = '/assets/icons/troumbone.svg';
        window.jQuery(container).trumbowyg({
            tagsToKeep: ['span']
        });

        editor = window.jQuery(container).trumbowyg('html', html);
        docRoot.set(root);
        $storeForSimpleTexts.forEach( (element) => element.connect(root));
    });

 
</script>

<svelte:head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Trumbowyg/2.27.3/ui/trumbowyg.min.css">
</svelte:head>

<div class="editor" bind:this={root}>
    <div bind:this={container}>
        
    </div>
</div>

<style>
    .editor{
        background-color: var(--white);
        box-shadow: 0 0 4px var(--black);
        height: 100%;
        border-radius: 4px;
        overflow-y: scroll;
    }
</style>