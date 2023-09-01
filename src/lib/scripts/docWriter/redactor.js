export function setNewHtml(html){
    window.jQuery(container).trumbowyg('html', html);
}

export function getHtml(){
   return window.jQuery(container).trumbowyg('html');
}