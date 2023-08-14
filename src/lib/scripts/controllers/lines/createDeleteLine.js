import { linesStore } from "$lib/scripts/stores";

export function deleteLines(id){
    linesStore.update( (lines) => {
        return lines.filter( (line) => {

            if(line.endId === id || line.startId === id) return false;
            return true;
        });
    });
}