import { projectsStore } from "$lib/scripts/stores";
import { get } from "svelte/store";

let timer;

/**устанавливает таймер для автоматического обновления токена */
export function setUpdate(){
    const controller = get( projectsStore );
    let timestamp = controller.getTokenTimeStamp();


    //document.visibilityHidden;
    
    if(timestamp && controller){
        setTimeout( () => {
            timer = setInterval( async () => { 
                await controller.getToken();
            }, 594000);
        }, Date.now()/1000 - timestamp)
    }
}

export function destroyUpdate(){
    timer = null;
}