import { nodes, storeForSimpleTexts } from "$lib/scripts/stores";


/** @description функция используется для обновления данных в nodes сторе. тоесть обновление
 * конкретного поля под именем, по айди блока. БЕРЕТ НЕСКОЛЬКО ДАННЫХ В ВИДЕ ОБЬЕКТА.
 * хорошо для работы со динамическими списками
 */
export default function syncSeveralDatasInNodeStore(id, data){
    
   /* nodes.subscribe( (nodes) => {
        for (let i = 0; i < nodes.length; i++) {
            const element = nodes[i];
            
            if(element["id"] !== id) continue;
            debugger;
            element.options = data.options;
            if(nodes[i]["content"] !== data.content){
                nodes[i]["content"] = data.content;
            }
            break;
        }

        
       // console.log("[syncSeveralDatasInNodeStore]: arguments options: ",  outernode);
        return nodes;
    });*/
    
    /**обновляем обьекты simpletext для правильного отображения в редакторе документов */
    storeForSimpleTexts.update( (arr) => {
        
        for(let i = 0; i < arr.length; i++){
            if(arr[i]['id'] !== id) continue;

            //d
            if(data["content"]){
                arr[i].setTextData({content: data.content});
            }
            break;
        }

        return arr;
    });
}