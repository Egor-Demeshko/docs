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
