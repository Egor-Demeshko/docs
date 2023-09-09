import HTTPrefresher from "$lib/scripts/utils/dataSendReceive/HTTP/HTTPrefresher.js";

export default class HTTPprojects extends HTTPrefresher{
    path = "api/v1";
    secondPath = "/project";

    constructor(){
        super();
    }

    async getList(token){
        try{
            return await super.getWithTokenInHeader({token, route: '/projects'});
        } catch (e){
            console.log(e.message);
        }
    }

    async changeName(token, data){
        const route ="/update";
        try{
            return await super.patch(token, JSON.stringify(data), route);
        } catch (e){
            console.log("[http client]: error changing name: ", e.message);
        }
    }


    async create(token, data){
        const route = "/create";

        try{
            return await super.postWithHeader({token, data: JSON.stringify(data), route});
        } catch (e){
            console.log("[http client]: ошибка при создании проекта ", e.message);
        }
    }


    async delete(token, data){
        const route = "/delete";

        try{
            let json = await super.delete(token, JSON.stringify(data), route);
            console.log('[DELETE result]: json: ', json);
            return json;
        } catch(e){
            console.log("[http client]: не удалось удалить проекть ", e.message);
        }
    }

    async getFullInfo(token, data, cors){
        const route = "/detail";

        try{
            return await super.postWithHeader(token, JSON.stringify(data), route, cors);
        } catch (e){
            console.log("[http client]: ошибка при получении полного списка ", e.message);
        }

    }


    async getOnlyActive(token, data, cors){
        const route = "/form";

        try {
            return await super.postWithHeader(token, JSON.stringify(data), route, cors);
        } catch (error) {
            console.log("[http client]: ошибка при получении активных узлов", e.message);
        }
    }
}