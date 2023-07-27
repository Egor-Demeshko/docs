export default function createMassive(graph){
    let arr = [];

    for(let [id, obj] of Object.entries(graph)){
        obj["id"] = +id;
        
        if(!obj.width) obj.width = 204;
        if(!obj.height) obj.height = 40;

        arr.push(obj);
    } 
    
    return arr;
}