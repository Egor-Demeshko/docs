export default function generateName(arr){
    console.log("{GENERATEname}: arr: ", arr);

    let i = 1;
    let name;

    while(true){
        name = ( i === 1 ) ? "Новый документ" : `Новый документ ${i}`;

        for (let j = 0; j < arr.length; j++){
            const docObj = arr[j];

            if(docObj.name === name){
                i++;
                break;
            } 
            if(j === arr.length - 1) return name;
        }

    }
}