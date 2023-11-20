import HTTPBaseServise from "$lib/scripts/utils/dataSendReceive/HTTP/HTTPBaseServise.js";
import { PUBLIC_BACK_HOST } from "$env/static/public";
import { goto } from "$app/navigation";


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
        console.log('[HTTPrefresher]: refreshing token', {token});
        const end = "/auth/refresh/";

        try{
            let result = await this.postRefresh(JSON.stringify(token), end);
            
            let {success, data, details} = result;

            console.log("[HTTPREFRESHER]: after request: ", {result});
            if(success){

                return  {jwt: data.jwt, refresh: data.refresh}; 
            } else {
                let errors = '';
                details.forEach( (err) => errors += `${err.message} \n`);
                console.error(errors);
            }

        } catch(e) {
            console.log("[HTTPREFRESHER]: CATCH BLOCK ", e.message);
            document.dispatchEvent( new CustomEvent("error", {detail: {
                err_data: [
                    {
                        blockId: 0,
                        message: "Не удалось обновить сессию",
                        err_id: 910,
                        err_type: "emergency"
                    }
                ]
            }}));
            goto('/projects');
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
            console.error('[Ошибка получения данных]: нет ответа от сервера.', e.message);
            return result;
        }
    }
}