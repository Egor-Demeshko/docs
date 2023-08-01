import { writable } from "svelte/store";



export const nodes = writable([]);


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

/**Drawer root */
export const drawRoot = writable('');

/**
 * created lines, obj with two ids.start and end block
 */
export const linesStore = writable([]);


/**
 * store saves info/controll to show active blocks
 * contains blocks IDS
*/
export const activeBlocks = writable(new Set());

/**
 * айди блока из поля редактирования, которое было кликнуто
 */
export const blockClickedId = writable(1);
/* ___ END DRAWERS ____ */


/* ____  doc redactor ____ */
/**current active tab id */
export const activeTabId = writable({});

/**tabs quantity, [array.lenght] */
export const tabsQuantity = writable({});

/**nodes options store */
export const nodeOptions = writable([
    {
        text: "поле ввода",
        value: "entry",
        selected: true
    }, {
        text: "текст/число",
        value: "text" ,
        selected: false
    }, {
        text: "чекбокс",
        value: "checkbox",
        selected: false
    }, {
        text: "радиокнопка",
        value: "radiobutton",
        selected: false
    }
]);

/**compare dropdown options */
export const compareOptions = writable([
    /*{
        text: "условия",
        value: null,
        selected: true,
    },*/
    {
        text: "больше чем",
        value: "gt",
        selected: true
    },
    {
        text: "меньше чем",
        value: "lt",
        selected: false
    },
    {
        text: "больше/равно",
        value: "gte",
        selected: false
    },
    {
        text: "меньше/равно",
        value: "lte",
        selected: false
    },
    {
        text: "равно",
        value: "equal",
        selected: false
    },
    {
        text: "не равно",
        value: "not_equal",
        selected: false
    }

]);