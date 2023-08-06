export default function validation(data){
    const reqFieldsList = ["name", "data_type", "node_type"];
    data.validaty = {
        status: "valid",
        err_data: [],
        elementsIdWithError
    }
    //проверять обязательный поля
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
    
    //проверяем соотвествие поля content типу данных data_type для блоков
    if(data.node_type === "text" || data.node_type === "entry"){
        
        //определить что ввели,  
        let whatIn = +data.content;

        if(isNaN(whatIn) && data.data_type === "number"){
            data.validity = {
                status: "invalid",
                err_data: [...data.validity.err_data, {
                    /*field_name: "content",*/
                    message: "Выбран тип данных число, а введены текстовые символы.",
                    blockId: data.id
                }
                ],
            }
        }

    }
    
    /*if(data.status === "invalid") document.dispatchEvent(new CustomEvent("invalid"));*/

    return  /**возращаем data с измененным поле validity, а может даже не возращаем. */;
}