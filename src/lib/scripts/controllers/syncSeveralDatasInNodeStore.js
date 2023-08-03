import { nodes, storeForSimpleTexts } from "$lib/scripts/stores";


/** @description функция используется для обновления данных в nodes сторе. тоесть обновление
 * конкретного поля под именем, по айди блока. БЕРЕТ НЕСКОЛЬКО ДАННЫХ В ВИДЕ ОБЬЕКТА.
 * хорошо для работы со динамическими списками
 */
export default function syncSeveralDatasInNodeStore(id, options){
    console.log("[syncSeveralDatasInNodeStore]: arguments options: ",  options);
    /*
    /**обновляем nodes снача 
    nodes.update( (nodes) => {
        /** с использованием этого флага пытаемся предотвратить waterfall  
        let wasChanged = false;

        for(let i = 0; i < nodes.length; i++){
            const node = nodes[i];

            if(node["id"] !== id) continue; 
            
            for (let [key, value] of Object.entries(options)) {
                if(node[key] != value) {
                    node[key] = value;
                    wasChanged = true;
                };               
            }

            if(wasChanged) nodes[i] = node;
            break;
        }
        return nodes;
    });
    */
    /**обновляем обьекты simpletext для правильного отображения в редакторе документов */
    storeForSimpleTexts.update( (arr) => {
        
        for(let i = 0; i < arr.length; i++){
            if(arr[i]['id'] !== id) continue;

            if(options["content"]){
                arr[i].setTextData({content: options.content});
            }
            break;
        }

        return arr;
    });
}