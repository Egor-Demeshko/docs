import { createLineBreaks, updateLineBreaks } from "./lineBreakesOperations";


let localContainer;

export function createBreakers(){
    createLineBreaks(localContainer);
}

export function createListeners(){
        // Add event listeners
        localContainer.addEventListener("cut", handleCut);
        localContainer.addEventListener("paste", handlePaste);
        localContainer.addEventListener("keydown", handleKeypress);
        
}

export function deleteBreakers(){
    localContainer.removeEventListener("cut", handleCut);
    localContainer.removeEventListener("paste", handlePaste);
    localContainer.removeEventListener("keydown", handleKeypress);
}

export function initBreakers(container){
    setContainer(container);
    createBreakers();
    createListeners();
}

function handleCut(event) {
    setTimeout(updateLineBreaks, 100);
    // Add your custom logic here  
}

function handlePaste(event) {
    // Handle the copy event
    console.log("Copy event triggered");
    // Add your custom logic here

    setTimeout(updateLineBreaks, 100);
}

function handleKeypress(event) {
    const key = event.key;
    if (key === "Enter" || key === "Backspace" || key === "Delete") {
        updateLineBreaks();
    }
}
      



export function setContainer(container){
    localContainer = container;
}