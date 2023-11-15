
/**
 * Сортирует заданный граф по времени.
 *
 * @param {Array<Object>} graph - Массив обьектов, который нужно отсортировать.
 * @return {undefined} - Эта функция не возвращает значения.
 */
export default function sortByTime(graph){
    return graph.sort( (first, second) => {
        let firstDate = new Date(first.created_at);
        let secondDate = new Date(second.created_at);

        return firstDate.getTime() - secondDate.getTime();
    });
}