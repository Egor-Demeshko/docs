import { parentConnection, childConnection } from "$lib/scripts/stores";

export default function connectCreationReset(){
    /**во время создания связи, можно кликнуть мимо блока
     * или куда угодно и создание связи прервется
     */
    parentConnection.set(false);
    childConnection.set(false);
}