import { nodes, storeForSimpleTexts } from "$lib/scripts/stores";


/** @description функция используется для обновления данных в nodes сторе. тоесть обновление
 * конкретного поля под именем, по айди блока. БЕРЕТ НЕСКОЛЬКО ДАННЫХ В ВИДЕ ОБЬЕКТА.
 * хорошо для работы со динамическими списками
 */
export default function syncSeveralDatasInNodeStore(id, data){
    console.log("[syncSeveralDatasInNodeStore]: arguments options: ",  data);
    /*
    nodes.update( (nodes) => {
        for (let i = 0; i < nodes.length; i++) {
            const element = nodes[i];
            
            if(element["id"] !== id) continue;

            element.options = data.options;
            nodes[i]["content"] = data.content;
            break;
        }
        return nodes;
    });*/
    
    /**обновляем обьекты simpletext для правильного отображения в редакторе документов */
    storeForSimpleTexts.update( (arr) => {
        
        for(let i = 0; i < arr.length; i++){
            if(arr[i]['id'] !== id) continue;

            debugger;
            if(data["content"]){
                arr[i].setTextData({content: data.content});
            }
            break;
        }

        return arr;
    });
}