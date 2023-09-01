import observer from "$lib/scripts/docElements/utils/observer.js";
import { getHtml } from "$lib/scripts/docWriter/redactor.js";

export default function stack(root){
    const ROOT_ELEMENT = root;
    const saved = [];
    let active = false;
    let observerInstance;

    return {
        setActive,
        createObserver,
        isActive,
        saveString,
        getString,
        disableFlag
    }


    function isActive(){
        return (active) ? true : false;
    }


    function setActive(){
        active = true;
    }


    function saveString(){
        let text = getHtml();
        saved.push(text);
    }


    function getString(){
        let el = saved[saved.length - 1];
        saved.pop();

        return el;
    }

    function disableFlag(){
        active = false;
    }




    function createObserver(callback, config){
        observerInstance = observer(ROOT_ELEMENT);
        observerInstance.create(callback, config);
    }   


}


