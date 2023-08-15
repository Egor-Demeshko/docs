import { writable } from "svelte/store";

export const addExcitingNodeToRedator = writable({
    /* статус определяем на каком шаге сейчас находится процесс добавления узла
    null, start, selecting, finished */
    status: null 
});