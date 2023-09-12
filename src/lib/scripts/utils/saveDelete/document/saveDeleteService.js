import HTTPtemplate from "$lib/scripts/utils/dataSendReceive/HTTP/HTTPtemplate.js";
import HTTPlogin from "$lib/scripts/utils/dataSendReceive/HTTP/HTTPlogin.js";
import Storage from "$lib/scripts/controllers/instances/Storage.js";
import JWT from "$lib/scripts/controllers/instances/JWT.js";

export default function saveDeleteService(type, storageType="local"){
    let service;
    let localSaver;
    let jwtService;
    
    if(storageType === "local" || !storageType){
        localSaver = new Storage();
    }
    
    type = type.toLowerCase();
    if(type === "template"){
        service = new HTTPtemplate();
    }
    if(type === "login"){
        service = new HTTPlogin();
    }

    jwtService = new JWT({saveService: localSaver, http: service});

    return {
        createInstance,
        deleteInstance,
        changeInstance,
        createRequestWithToken,
        changeInstanceWithToken,
        sendFile
    };


    async function createInstance(data){
        return await service.post(data);
    }

    async function deleteInstance(data){
        const token = await jwtService.getToken();

        return await service.delete(token, data);
    }

    async function changeInstance(data){
        return await service.patch(data);
    }

    async function createRequestWithToken(data){
        const token = await jwtService.getToken();

        return await service.postWithToken(token, data);
    }

    async function changeInstanceWithToken(data){
        const token = await jwtService.getToken();

        return await service.updateWithToken(token, data);
    }

    async function sendFile(formData){
        const token = await jwtService.getToken();

        return await service.sendFile(token, formData);
    }
}