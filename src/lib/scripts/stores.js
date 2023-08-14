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
    text: "текст модалки",
    description: "описание",
    result: false,
    errorCallback: null,
    okCallback: null
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
        value: "select",
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
        text: "равно",
        value: "equal",
        selected: false
    },
    {
        text: "не равно",
        value: "not_equal",
        selected: false
    },
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
    }
]);


/***сторы используются для поддержания процесса создания связей между блоками.
 * в рабочем состоянии имеют вид объекта
 * {
    start: id,
    end: id  
  } 
  первый айди заполняется после клика по кнопки добавить связь(+)
  второй заполняется после клика по второму блоку, с которым мы хотим создать связь
  реактивная природа стора помогает делать отображение состояний в переключении false или что-то есть.
  например, обьект. 
  а также другим вспомогательным функциям дает айди стартового или конечно блока.
 */
export const parentConnection = writable(false);


/**смысл этого стора такой же как у верхнего, есть одно отличие. Добавляется свойство
 * chainTopBlock.
 * {
    start: id,
    end: id,
    chainTopBlock 
  } 
  он будет использован для метки блока самого верхнее в цепочке, для того чтобы сделав проверку в 
  дальнейшем исключить подключение цепочки замой к себе
 */
export const childConnection = writable(false);


/** отвечает за передачу данных и контроль линии, которая отрисовывается в момент создания связи
 * {
 *      x, y - блока
 * }
 */
export const mouseLine = writable(false);


/**контролирует показ кнопки удаления линии */
export const showDeleteStore = writable(false);


/**тут хранится динамически, ссылка на функцию, которая контролирует удаление линии */
export const deleteLineFunction = writable(null);


/**показывать tooltip {show: true, coors: {x: 0, y: 0}, text: "", place: "buttom"} */
export const showTooltip = writable({show: false});