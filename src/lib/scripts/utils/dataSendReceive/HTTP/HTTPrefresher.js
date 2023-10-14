import HTTPBaseServise from "$lib/scripts/utils/dataSendReceive/HTTP/HTTPBaseServise.js";
import { PUBLIC_BACK_HOST } from "$env/static/public";


export default class HTTPrefresher extends HTTPBaseServise{

    constructor(){
        super();
    }

    /**запрашиваем енд поинт, перерабатываем ответ, чтобы только токены были 
    * @return {
    *  jwt {string}
    *  refresh {string}
    * }
    */
    async refresh(token){
        console.log('[HTTPlogin]: refreshing token');
        const end = "/auth/refresh/";

        try{
            let result = await this.postRefresh(JSON.stringify(token), end);
            
            let {success, data, details} = result;

            console.log("[HTTPLOGIN]: after request: ", {result});
            debugger;
            if(success){

                return  {jwt: data.jwt, refresh: data.refresh}; 
            } else {
                let errors = '';
                details.forEach( (err) => errors += `${err.message} \n`);
                throw new Error(errors);
            }

        } catch(e){
            console.log(e.message);
        }
    }

    async postRefresh(data, endroute){
        const origin = PUBLIC_BACK_HOST;
        
        let url = new URL(origin + this.path + endroute);
        console.log("{url}", url.href);
        let result;

        try{
            let response = await fetch(url, {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-type": "application/json"
                },
                body: data
            });

            result = await response.json();
            console.log("[HTTPRefresher]: result", result);
            return result;

        } catch(e){
            console.log('[Ошибка получения данных]: нет ответа от сервера.', e.message);
        }
        
        console.log("[HTTPRefresher]  POST DATA: ", result);
    }
}