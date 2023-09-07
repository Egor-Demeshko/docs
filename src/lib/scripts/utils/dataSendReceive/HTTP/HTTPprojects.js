import HTTPBaseServise from "./HTTPBaseServise";

export default class HTTPprojects extends HTTPBaseServise{
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
}