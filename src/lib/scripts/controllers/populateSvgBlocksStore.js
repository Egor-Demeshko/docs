import { connections } from "$lib/scripts/stores";


export default function populateSvgBlocksStore(graph){
    let arr = [];

    graph.forEach( (obj) => {
        let {id, x, y, name, width, height, parent} = obj;
        arr.push(
            {
                id,
                x,
                y,
                name,
                width,
                height,
                parent
            }
        );
    });
    
    connections.set(arr);
}