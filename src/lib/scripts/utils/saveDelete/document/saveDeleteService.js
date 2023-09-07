import HTTPtemplate from "$lib/scripts/utils/dataSendReceive/HTTP/HTTPtemplate.js";
import HTTPlogin from "$lib/scripts/utils/dataSendReceive/HTTP/HTTPlogin.js";

export default function saveDeleteService(type){
    let service;
    type = type.toLowerCase();
    if(type === "template"){
        service = new HTTPtemplate();
    }
    if(type === "login"){
        service = new HTTPlogin();
    }

    return {
        createInstance,
        deleteInstance,
        changeInstance
    }


    async function createInstance(data){
        return await service.post(data);
    }

    async function deleteInstance(data){
        return await service.delete(data);
    }

    async function changeInstance(data){
        return await service.patch(data);
    }
}