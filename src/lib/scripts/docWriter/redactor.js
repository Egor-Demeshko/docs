export function setNewHtml(html){
    window.jQuery("#container").trumbowyg('html', html);
}

export async function getHtml(){
    updateState();
    await new Promise( (resolve) => setTimeout(resolve, 20));
   return window.jQuery("#container").trumbowyg('html');
}


function updateState(){
    /**при редактировании nodes, особенно из из меню редактора узла, 
     * редактор не обновляет свое внутреннее состояние, для того чтобы он обновил запускаем 
     * событие клавиатуры */
    const element = document.getElementById("container");
    element.dispatchEvent(new ClipboardEvent("cut"));
}

