export default function createOnDocumentRedactorEvents(redactorRoot){
    redactorRoot.addEventListener("cut", cutHandle);
}


function cutHandle(e){
    //вариант когда вырезается узел целиком, или большие параграфы, где может быть несколько наших узлов
      /** 
       *  когда режем узел целиком, автоматически переносится в буфер разметка со <span>
       *  наша задача сделать посути реконнект 
       *  конечно, надо убедится что наш узел целиком попал в выделение.
       *  создавать решение для нескольких узлов сразу.
       * 
       *    записать в массив их nodes внутренние, те. #text 
       *    получить селекшен. 
       *    убедиться что anchornode и focusnode это не наши node 
       *    все так и оставляем, восстанавливаем соединение
       *    или
       *    если node наша, то меняем наш элемент, на просто текст, это в след блоке.
       *    тут просто запишем индекст с которого начинается 
       */

      //создать массив для хранения все наших узлов (html node, не element)
      const textNodes = [];
      const target = e.target;
      const elementsCollection = target.querySelectorAll(".doc_elements");
      const selection = window.getSelection();

      console.log("[GlobalRedactorEvents]: selection  ", selection);

      const selectionAnchor = selection.anchorNode;
      const selectionFocus = selection.focusNode;

      if(elementsCollection.length > 0){
        let htmlElements = Array.from(elementsCollection);

        for(let i = 0; i < htmlElements.length; i++){
            let element = htmlElements[i];

            let innerNodes = element.childNodes;
            console.log("[GlobalRedactorEvents]: all vars: ", {
                target,
                elementsCollection,
                selectionAnchor,
                selectionFocus
            });
            /**проверяем есть ли среди nodes  nodes которые указаны как anchor / focus из selection */
            for (let i = 0; i < innerNodes.length; i++) {
                const node = innerNodes[i];
                if(node === selectionAnchor || node === selectionFocus){
                    //если в selection по границе попала нода которая находится в нашем узел, необходимо сделать удаление
                    //этого элемент, с сохранением текста
                }
            }
        }
      } else {
        return;
      }



    //вариант когда узел вырезается частично
        /**
         *  у элемента вырезанного частично надо будет удалеть разметку нашего элемента.
         */
}