import { textElementsData } from "../stores";

export default function gainBlocksData(arrayOfIds){
  //импортируем стор данных.
  //находим нужные обьекты.
  //если будет один. то вернуть только обьект 
  console.log("[gainBlocksData]: arrayOfIds: ", arrayOfIds);

  let arrayToReturn = [];
  
  arrayOfIds.forEach( (id) => {
    if(!id) return;

    textElementsData.update( (array) => {
        let i = +(( array.length / 2 )).toFixed(0);
        console.log("let i", i);

        //TODO глюк с числами 3
        while(true){
            if(array[i].id < id){
                i = i + Math.floor((array.length - i) / 2);
            } else if (array[i].id > id){ 
                i = Math.floor(i / 2);
                
            } else if(array[i].id === id){
                arrayToReturn.push(array[i]);
                break;
            }
        }

        return array;
    });
  });

  //console.log("[gainBlocksData]: arrayToReturn: ", arrayToReturn);
  return arrayToReturn;
}