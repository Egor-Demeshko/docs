export default class HTTPBaseServise{
    #origin = "http://constructor.crabdance.com/";
    constructor(){

    }


    async post(data, endroute){        
        let url = new URL(this.#origin + this.path + this.secondPath + endroute);
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
            console.log("[HTTPBaseService]: POST result", result);
            return result;

        } catch(e){
            console.log('[Ошибка получения данных]: нет ответа от сервера.', e.message);
        }
        
        console.log("[HTTPBaseServise]  POST DATA: ", result);
    }


    async postFile(token, data, endroute, cors = "cors"){
        let url = new URL(this.#origin + this.path + this.secondPath + endroute);
        let result;
        const boundary = 'boundary=--------------------------' + Math.random().toString(36).slice(2);
        debugger;

        const headers = { 
            "Content-type": "multipart/form-data; " + boundary,
        }

        if(token) headers.jwt = token;

        try{
            let response = await fetch(url, {
                method: "POST",
                mode: cors,
                headers,
                body: data
            });
            result = await response.text();
            console.log("[HTTPBaseService]: POST result", result);
            debugger;
            return result;

        } catch(e){
            console.log('[Ошибка отправки файла]: ошибка запроса: ', e.message);
        }
    }

    async delete(token, data, route){
        const url = new URL(this.#origin + this.path + this.secondPath + route);
        console.log("[HTTP basic]: {DELETE} data to be send", data);

        const headers = { 
            "Content-type": "application/json"
        }

        if(token) headers.jwt = token;

        let response = await fetch(url, {
            method: "DELETE",
            cors: "cors",
            headers,
            body: data
        });
        return await response.json();
    }

    async patch(token = null, data, route){
        const url = new URL(this.#origin + this.path + this.secondPath + route );

        const headers = {
            "Content-type": "application/json"
        };
        if(token) headers.jwt = token; 
        

        let response = await fetch(url, {
            method: "PATCH",
            cors: "cors",
            headers,
            body: data
        });
        
        return await response.json();
    }


    async getWithTokenInHeader({token, route}){
        const url = new URL(this.#origin + this.path + route); 

        let response = await fetch(url, {
            method: "GET",
            mode: "cors",
            headers: {
                "jwt": token,
            }
        });

        return response.json();
    }

    async postWithHeader(token = null, data, route, cors="cors"){
        const url = new URL(this.#origin + this.path + this.secondPath + route );
        console.log('[http basic]: url: ', url.href);
        console.log('[HTTP BASIC: ], data to send: ', data);
        const headers = {
            "Content-type": "application/json"
        };
        if(token) headers.jwt = token; 

        let response = await fetch(url, {
            method: "POST",
            mode: cors,
            headers,
            body: data
        });
        return await response.json();
    }

    async put(token = null, data, route){
        const url = new URL(this.#origin + this.path + this.secondPath + route );
        console.log("[HTTP basic]: {patch} data to be send", URL);

        const headers = {
            "Content-type": "application/json"
        };
        if(token) headers.jwt = token; 
        

        let response = await fetch(url, {
            method: "PUT",
            cors: "cors",
            headers,
            body: data
        });
        
        return await response.json();
    }
}