import { nodes } from "$lib/scripts/stores";

export default function validation(data){
    const reqFieldsList = ["name", "data_type", "node_type"];
    data.validity = {
        status: "valid",
        err_data: [],
        blockId: null
    }
    //проверять обязательные поля
    //тип данных на узлах
    //делать очистку строки на name, content, description, trigger
    //само поле validity имеет status и errors [{[data.field.name], [message]}]

    /*  - `data_type`: (см. Разрешенные значения), (**обязательное поле!**)  
        - `node_type`: (см. Разрешенные значения), (**обязательное поле!**)
        - `name`: str (**обязательное поле!**)*/


    
    for(let i = 0; i < reqFieldsList.length; i++){
        let key = reqFieldsList[i];
        let value = data[key];

        if(typeof value === 'string' && !value.length ){
            data.validity = {
                status: "invalid",
                err_data: [ ...data.validity.err_data, {
                    field_name: key,
                    message: "Поле обязательно для заполнения!"
                }]
            }
        }
    }
    
    //проверяем соотвествие поля content типу данных data_type для блоков ввода текста
    if(data.node_type === "text" || data.node_type === "entry"){
        
        //определить что ввели,  
        let whatIn = +data.content;

        if(isNaN(whatIn) && data.data_type === "integer"){
            data.validity = {
                status: "invalid",
                err_data: [...data.validity.err_data, {
                    field: "content",
                    message: "Выбран тип данных число, а введены буквенные символы.",
                    blockId: data.id
                }
                ],
            }
        }
    }


   /* - установление связи: если заполнены 3 компонета (condition, trigger и родительский content), стоит проверить,
чтобы trigger текущего узла и content родительского были одного типа. Также стоит проверить соответствует ли тип данных оператору 
в текущем узле (подробнее в "Разрешенные типы данных для операторов сравнения")*/
//для операторов сначала 

    /**GПРОВЕРКА CONDITION TRIGGER CONTENT */
    trigger: {
        //проверить присутствуют ли свой content trigger
        //проверить есть ли родительский блок
        //найти родительский блок
        //проверить соотвествие данных в trigger и в родительском content
        //проверить чтобы было число-число или строка строка
        // определенному опоератору могут соотвествовать только строка-строка
        console.log("[validation]: {trigger} start");
        if(!data.trigger && !data.parent_id) break trigger;
        

        if(data.trigger && data.condition && !data.parent_id){
            console.log("[validation]: {trigger} NO PARENT BLOCK");

            data.validity = {
                status: "invalid",
                err_data: [...data.validity.err_data, {
                    field: "",
                    message: "Не указан родительский блок, нет связи",
                    blockId: data.id
                }
                ],
            }
        }


        if(data.trigger && data.condition){
            let condition = data.condition;

            console.log("[validation]: {trigger} wrong type for CONDITION");

            if(condition === "gt" || condition === "lt" || condition === "gte" || condition === "lte"){
                if(isNaN(+data.trigger)) data.validity = {
                                            status: "invalid",
                                            err_data: [...data.validity.err_data, {
                                                field: "trigger",
                                                message: "Логические условия больше/меньше работают только с числами",
                                                blockId: data.id
                                            }
                                            ],
                                        }
            }
        }


        if(data.parent_id){
            /**ищем родительский блок */

            nodes.update( (nodes) => {

                for(let i = 0; i < nodes.length; i++){
                    let node = nodes[i];
                    if(node["id"] !== data.parent_id) continue;
                        /**после того как нашли дату по родительскому блоку. 
                         * проверить чтобы тип данных по родительскому блоку, совпадал с дочерним
                        */

                        let parentData = node;

                        if(isNaN(+parentData.content) !== isNaN(+data.trigger) ){
                            console.log("[validation]: {trigger} wrong type for PARENT AND CHILD");

                            data.validity = {
                                status: "invalid",
                                err_data: [...data.validity.err_data, {
                                    field: "trigger",
                                    message: "Значение родительского блока и значение условия сравнения дочернего блока должны быть одновременно или строкой (с числами) или только числами",
                                    blockId: data.id
                                }
                                ],
                            }
                        }   
                        
                    break;
                }

                return nodes;
            });
            
        }

        

    }

    console.log('[VALIDATION.js FUNCTION]: custing event: ', data.validity);

    
    if(data.validity.status === "invalid") document.dispatchEvent(new CustomEvent("error", {
        detail: data.validity
    }));

    return  /**возращаем data с измененным поле validity, а может даже не возращаем. */;
}