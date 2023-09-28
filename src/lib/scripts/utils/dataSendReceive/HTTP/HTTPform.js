import HTTPrefresher from "$lib/scripts/utils/dataSendReceive/HTTP/HTTPrefresher.js";

export default class HTTPform extends HTTPrefresher{
    path = "api/v1";
    secondPath = "/project";

    constructor(){
        super();
    }

    async update(token, data){
        const route = '/form/';

        return await super.patch(token, JSON.stringify(data), route);
    }
}