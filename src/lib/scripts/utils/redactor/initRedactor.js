import jQuery from "jquery";
import print from "$lib/scripts/utils/redactor/printFlow.js";
import {printCallback, docxController} from "$lib/scripts/stores";
import { get } from "svelte/store";

export default async function initRedactor(container){
    if (!window.jQuery) window.jQuery = jQuery;
    await import('trumbowyg').then((result) => {console.log('TRUMBO INIT IN PROMISE', result)});

    window.jQuery.trumbowyg.svgPath = '/assets/icons/troumbone.svg';
    //console.log(window.jQuery.trumbowyg);
    window.jQuery(container).trumbowyg({
        tagsToKeep: ['span'],
        btnsDef: {
            print: {
                fn: () => { 
                    const callback = get( printCallback );
                    callback();
                 },
                title: 'Напечатать',
                text: 'Print',
                class: '',
                hasIcon: true,
                ico: "print"
            },
        },
        btns: [
            ['undo', 'redo'], 
            ['formatting'],
            ['strong', 'em', 'del'],
            ['superscript', 'subscript'],
            ['link'],
            ['insertImage'],
            ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
            ['unorderedList', 'orderedList'],
            ['horizontalRule'],
            ['removeformat'],
            ['print'],
            ['fullscreen']
        ]
    });
}