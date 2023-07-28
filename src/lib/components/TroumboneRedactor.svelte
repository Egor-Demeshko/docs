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
        console.log(window.jQuery.trumbowyg);
        window.jQuery(container).trumbowyg({
            tagsToKeep: ['span']
        });

        editor = window.jQuery(container).trumbowyg('html', html);
        docRoot.set(root);
        $storeForSimpleTexts.forEach( (element) => element.connect(root));
    });

 
</script>

<svelte:head>
    <link rel="stylesheet" href="/assets/css/trumbowyg.css">
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
        border-radius: 18px 0 0 0;
        overflow-y: scroll;
    }

    .editor *{
        color: var(--deep-blue);
    }
</style>