import { writable } from "svelte/store";


/** стор для передачи переменными/блоками переменных
 * структура айди блока: значение
 * транспорт данных из блока переменных в блок размещенный на документе
*/
export const textElementsData = writable([]);

/**
 * стор простых элементов
 */
export const storeForSimpleTexts = writable([]);


/**document root element */
export const docRoot = writable();


/**Interective left field, overlap show control */
export const interectiveOverlapShow = writable(false);


/** modal visual conrol, when show=true, modal is visible*/
export const modalFieldsStore = writable({
    show: false,
    name: "имя",
    description: "описание",
    placeholder: 'плейсхолдер',
    inputValue: "",
    nameInput: ""
});