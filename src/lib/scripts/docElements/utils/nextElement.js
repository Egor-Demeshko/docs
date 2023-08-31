export function nextElementForward(element){
    while(true){
        if(element.nextSibling ){
            return element.nextSibling;
        } else {
            element = element.parentNode;
        }
        if(element.tagName === "DIV") throw new Error("Text node not found");
    }
}


export function previousNode(element){
    while(true){
        if(element.previousSibling){
            return element.previousSibling;
        } else {
            element = element.parentNode; 
        }
        if(element.tagName === "DIV") throw new Error("Text node not found");
    }
}