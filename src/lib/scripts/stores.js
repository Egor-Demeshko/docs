import { writable, readable } from "svelte/store";
import { Projects } from "$lib/scripts/controllers/instances/Projects.js";
import DocHandler from "$lib/scripts/controllers/instances/DocHandler.js";



export const nodes = writable([]);


/**стор для хранения экземпляра класса.CLASS DOCUMENTS with fields {id: string uuid, string:htmlstring, name:string, active:bool, project_id, ?not_initialized} 
 * id - уникальный индентификатора документа, как текстового файла
 * string - это html одного документа
 * name - имя
 * active - добавляется уже во время работы приложение, не приходит с сервера, указывает на активный в данный момент документ в редакторе.
 * project-id - айди проекта к которому относится документ
 * ?not_initialized - флаг, который указывает что документ создан, кнопкой, но опция будет ли это чистый документ 
 *                      или документ загруженный сервера не выбрана. 
 * 
*/
export const documents = writable(null);

/** стор для передачи переменными/блоками переменных
 * структура айди блока: значение
 * транспорт данных из блока переменных в блок размещенный на документе
*/
export const textElementsData = writable([]);


/**
 * стор простых элементов(js class), которые управляют элементами в разметке документа в редакторе
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
    {
        text: "---",
        value: null,
        selected: true,
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
    },
    {
        text: "больше чем",
        value: "gt",
        selected: false
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


/**показывать tooltip {show: true, coors: {x: 0, y: 0}, text: "", place: "above || under"} */
export const showTooltip = writable({show: false});


/**показывает модалку в поле редактирования документа  */
export const showModalDocumentCreator = writable(false);


/**хранит экземпляр User */
export const userStore = writable();

/**хранит экземпляр контроллер Projects */
export const projectsStore = readable( new Projects() );

/**флаг отображения строки сохранения */
export const saving = writable(false);


/**контроллер графа на странице анкеты, своя логика обработки, так как приходят в ответах только активные узлы
 * создается на странице анкеты и уничтожается при onDestroy
 */
export const anketaGraphController = writable();


/**
 * контроллер графа на странице редактора, отдельная логика от графа anketaGraphController
 */
export const nodeController = writable();

/**устанавливает имя проекта которое отображается в layout 
 * {id, name}*/
export const projectName = writable();

/** для хранения ссылки на фукнцию callback модуля печати */
export const printCallback = writable();

export const docxController = readable( new DocHandler() );