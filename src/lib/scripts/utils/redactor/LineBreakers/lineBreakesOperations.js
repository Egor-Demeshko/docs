let lastPagesNumber = 0;
let localContainer = null;

//высота одной строницы  в инчах, с учетом отступа сверху
const innerPageHeight = 11.7;

export function createLineBreaks(container){
    if(container && localContainer !== container) localContainer = container;
    //смотрим чтобы у элемент был el.offsetTop + el.offsetHeight < 1132px, а если след. элемент больше
    const elements = localContainer.children;
    
    const pixelRate = Math.floor(innerPageHeight * 96 / window.devicePixelRatio);
    const redactorBox = document.querySelector('.trumbowyg-editor-box');

    //выччисляем количество страниц. чтобы точно понимать сколько разрывов надо создать
    const pages = Math.ceil(localContainer.offsetHeight / pixelRate);
    if( lastPagesNumber !== pages ) lastPagesNumber = pages;
    let i = 0;
    /**когда найдем элемент который будет около 1132 болтаться, то создаем разрыв */
    for ( let j = 1; j < pages; j++){

        for( i; i < elements.length; i++){
            /**
             * если элемент больше 1132, а прошлый элемент меньше, то
             * после прошлого элемента создаем разрыв
             */
    
            const element = elements[i];
            let previousElement = (i > 0) ? elements[i - 1] : undefined;
            
            if(element.offsetTop + element.offsetHeight >= pixelRate * j &&
                previousElement &&
                previousElement.offsetTop + previousElement.offsetHeight < pixelRate * j){
                    let iElement = document.createElement('i');
                    iElement.classList.add('line_break');
                    iElement.style.top = localContainer.offsetTop + previousElement.offsetTop + "px";
                    redactorBox.append(iElement);
                break;
            } 
        }
    
    }
}


function calculatePages(){
    //выччисляем количество страниц. чтобы точно понимать сколько разрывов надо создать
    return Math.ceil(localContainer.offsetHeight / innerPageHeight);
}


function deleteLines(){
    const lines = document.querySelectorAll('i.line_break');

    for (let i = 0; i < lines.length; i++) {
        lines[i].remove();
    }
}


export function updateLineBreaks(){
    if(!localContainer) return;
    //определить надо ли обновлять линии
    //пересчитать если надо
    const pages = calculatePages();

    if(pages === lastPagesNumber) return;
    lastPagesNumber = pages;
    deleteLines();

    createLineBreaks();
}