import { nodes } from "$lib/scripts/stores";
import validateSiblingsWithoutMessage from "$lib/scripts/utils/validation/validateSiblingsWithoutMessage";


/** @description функция представляет общий конвеер валидации
 * @param {Object} data - Объект, который содержит данн. Обязательное
 * @param {Object} options? - опции
 */
export default async function validation(data, options){
    const reqFieldsList = ["name", "data_type", "node_type"]; 
   //TODO const dataToWorkWith = {...data};
    /**err_type используется для последующей стилизации сообщений смотрим message.svelte messagesContainer.svelte */
    if(data?.validity || !data.validity){
        data.validity = {
            status: "valid",
            err_data: [],
            blockId: null,
            err_type: "emergency"
        }
    }
    

    //делать очистку строки на name, content, description, trigger
    //само поле validity имеет status и errors [{[data.field.name], [message]}]


    /* запускаем валидацию дочерних узлов без сообщений */
    if(!options?.nopropogate){
        validateSiblingsWithoutMessage(data.id);
    }
    


    //проверять обязательные поля
    for(let i = 0; i < reqFieldsList.length; i++){
        let key = reqFieldsList[i];
        let value = data[key];

        if(typeof value === 'string' && !value.length ){
            data.validity = {
                status: "invalid",
                err_data: [ ...data.validity.err_data, {
                    field_name: key,
                    message: "Поле обязательно для заполнения!",
                    err_id: 800,
                    err_type: "emergency"
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
                    blockId: data.id,
                    err_id: 801,
                    err_type: "emergency"
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
        //console.log("[validation]: {trigger} start");
        if(!data.trigger && !data.parent_id) break trigger;
        

        if(data.trigger && data.condition && !data.parent_id){
           // console.log("[validation]: {trigger} NO PARENT BLOCK");

            data.validity = {
                status: "invalid",
                err_data: [...data.validity.err_data, {
                    field: "trigger",
                    message: "Не указан родительский блок, нет связи",
                    blockId: data.id,
                    err_id: 802,
                    err_type: "emergency"
                }
                ],
            }
        }

        //if(data.id === "2eb0d071-726f-46ad-8905-1f1528eda152")
        if(data.trigger && data.condition){
            let condition = data.condition;
            //;

            //console.log("[validation]: {trigger} wrong type for CONDITION");

            if(condition === "gt" || condition === "lt" || condition === "gte" || condition === "lte"){
                
                if(isNaN(+data.trigger)) data.validity = {
                                            status: "invalid",
                                            err_data: [...data.validity.err_data, {
                                                field: "trigger",
                                                message: "Логические условия больше/меньше работают только с числами",
                                                blockId: data.id,
                                                err_id: 803,
                                                err_type: "emergency"
                                            }
                                            ],
                                        }
            }
        }


        if(data.parent_id){
            /**ищем родительский блок */
            //TODO подумать может тут поставить subscribe
            nodes.update( (nodes) => {
                for(let i = 0; i < nodes.length; i++){
                    let node = nodes[i];
                    if(node["id"] !== data.parent_id) continue;
                        /**после того как нашли дату по родительскому блоку. 
                         * проверить чтобы тип данных по родительскому блоку, совпадал с дочерним
                        */

                        let parentData = node;

                        if(typeof data.trigger === "boolean" 
                        && (typeof parentData.content !== "boolean" )){
                            
                            data.validity = {
                                status: "invalid",
                                err_data: [...data.validity.err_data, {
                                    field: "trigger",
                                    message: "Родительский блок должен иметь запись вида <true> (активно) или <false> (пассивно)",
                                    blockId: data.id,
                                    err_id: 805,
                                    err_type: "emergency"
                                }
                                ],
                            }
                            break;
                        }

                        if(isNaN(+parentData.content) !== isNaN(+data.trigger) ){
                            //console.log("[validation]: {trigger} wrong type for PARENT AND CHILD");

                            data.validity = {
                                status: "invalid",
                                err_data: [...data.validity.err_data, {
                                    field: "trigger",
                                    message: "Значение родительского блока и значение условия сравнения дочернего блока должны быть одновременно или строкой (с числами) или только числами",
                                    blockId: data.id,
                                    err_id: 804,
                                    err_type: "emergency"
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

    //console.log('[VALIDATION.js FUNCTION]: custing event: ', data.validity);
    if(!options?.nomessages){
        if(data.validity.status === "invalid") document.dispatchEvent(new CustomEvent("error", {
            detail: data.validity
        }));
    }

    return  /**возращаем data с измененным поле validity, а может даже не возращаем. */;
}