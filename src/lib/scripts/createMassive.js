export default function createMassive(graph){
    let arr = [];

    for(let [id, obj] of Object.entries(graph)){
        obj["id"] = +id;
        arr.push(obj);
    } 
    
    return arr;
}