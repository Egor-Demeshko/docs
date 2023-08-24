import HTTPtemplate from "$lib/scripts/utils/dataSendReceive/HTTP/HTTPtemplate.js";

export default function saveDeleteService(type){
    let service;
    type = type.toLowerCase();
    if(type === "template"){
        service = new HTTPtemplate();
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

    async function changeInstance(){
        return await service.patch(data);
    }
}