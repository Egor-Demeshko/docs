import {textElementsData} from "$lib/scripts/stores";

export default function populateTextDataStore(graph){
    let arr = [];
    graph.forEach( (obj) => {
        arr.push(obj);
    });

    textElementsData.set(arr);
}