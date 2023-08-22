import { PUBLIC_BLOCKWIDTH, PUBLIC_BLOCKHEIGHT } from '$env/static/public';

export default function createMassive(graph){
    let arr = [];

    for(let [id, obj] of Object.entries(graph)){
        obj["id"] = +id;
        
        if(!obj.width) obj.width = +PUBLIC_BLOCKWIDTH;
        if(!obj.height) obj.height = +PUBLIC_BLOCKHEIGHT;

        arr.push(obj);
    } 
    
    return arr;
}