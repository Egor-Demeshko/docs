import {textElementsData} from "$lib/scripts/stores";

export default function populateTextDataStore(graph){
    let arr = [];
    graph.forEach( (obj) => {
        let {id, name, content} = obj;
        arr.push({
            id,
            name,
            content
        });
    });

    textElementsData.set(arr);
}