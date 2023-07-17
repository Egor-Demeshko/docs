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

/* ____  DRAWERS STORES _____  */
/**saves data about all block's chain and it's data */
export const connections = writable();

/**Drawer root */
export const drawRoot = writable('');

/**
 * created lines, obj with two ids.start and end block
 */
export const linesStore = writable([]);


/**
 * store saves info/controll to show active blocks
*/
export const activeBlocks = writable(new Map());

/**
 * айди блоков из поля редактирования, которые были кликнуты
 */
export const blockClickedId = writable();
/* ___ END DRAWERS ____ */