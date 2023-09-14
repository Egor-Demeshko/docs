import { nodes } from "$lib/scripts/stores";

export default function radioContentAndValuesChecker(deletedValue, id){
    
    nodes.update( (arr) => {
        
        for (let i = 0; i < arr.length; i++) {
            const dataObj = arr[i];
            if(dataObj["id"] !== id) continue;

            if(dataObj.content === deletedValue){
                dataObj.content = dataObj.options[0];
                
                //console.log("[radioContentAndValuesChecker] dataObj: ", dataObj);
                return arr;
            }
        
            
        }

        return arr;
    });
}