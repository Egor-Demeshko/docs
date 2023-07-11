<script>
	import { onMount } from "svelte";
    import { storeForSimpleTexts, docRoot } from "$lib/scripts/stores";
    import Modal from "$lib/components/Modal.svelte";
	import TroumboneRedactor from "./TroumboneRedactor.svelte";

    /** @description разметка документа */
    export let html = '';


    /** @description корневой элемент документа*/
    let root;


    onMount( async () => {
        /**objects of text elements should be connected with there representing elements*/
        

        console.log("[DOC WRITER]: HTML: ", html);
        /*console.log("$storeForSimpleTexts: ", $storeForSimpleTexts);*/
        /***
         * CODE FOR QUILL 
         * var options = {
            debug: 'warn',
            modules: {
                toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                        ['blockquote', 'code-block'],

                        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
                        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
                        [{ 'direction': 'rtl' }],                         // text direction

                        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

                        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                        [{ 'font': [] }],
                        [{ 'align': [] }],

                        ['clean']                                         // remove formatting button
                    ]
                
            },
            placeholder: 'Compose an epic...',
            theme: 'snow'
        };
        

        var editor = new Quill(".document", options);

        var delta = editor.clipboard.convert(html);
        console.log("delta: ", delta);
        //editor.insertEmbed(0, 'text', delta);*/
           

    });



</script>


<svelte:head>

</svelte:head>


<section bind:this={root} >
    <TroumboneRedactor {html}/>

    <Modal />
</section>


<style>
    section{
        padding:2rem 2rem;
        height: 100%;
        width: 100%;
        min-width: 600px;
        border-left: 2px solid var(--black);
        position: relative;
    }


    #toolbar{
        background-color: var(--white);
    }


    .document{
        background-color: var(--white);
        box-shadow: 0 0 4px var(--black);
        height: 100%;
        border-radius: 4px;
        padding: 1rem;
        overflow-y: scroll;
    }

    :global(.doc_elements){
        position: relative;
        display: inline-block;
        background-color: aqua;
    }

    :global(.doc_elements:before){
        content: " ";
        position: absolute;
        display: block;
        top: 0;
        left: -.4rem;
        transform: scaleY(130%);
        width: 6px;
        height: 100%;
        border-radius: 6px;
        border-left: 4px solid aqua;
    }

    :global(.doc_elements:after){
        content: " ";
        position: absolute;
        display: block;
        top: 0;
        right: -.4rem;
        transform: scaleY(130%);
        width: 6px;
        height: 100%;
        border-radius: 6px;
        border-right: 3px solid aqua;
    }


    /**doc redactor*/
    :global(.ql-snow){
        background-color: var(--white);
        margin-bottom: 1rem;
    }
</style>