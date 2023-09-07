export default class HTTPBaseServise{
    #origin = "http://constructor.crabdance.com/";
    constructor(){

    }


    async post(data, endroute){
        debugger;
        
        let url = new URL(this.#origin + this.path + endroute);
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
            console.log("[HTTPBaseService]: result", result);
            return result;

        } catch(e){
            console.log('[Ошибка получения данных]: нет ответа от сервера.', e.message);
        }
        
        console.log("[HTTPBaseServise]  POST DATA: ", result);
    }

    async delete(token, data, route){
        const url = new URL(this.#origin + this.path + this.secondPath + route);

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

    async postWithHeader({token = null, data, route}){
        const url = new URL(this.#origin + this.path + this.secondPath + route );
        console.log('[http basic]: url: ', url.href);
        const headers = {
            "Content-type": "application/json"
        };
        if(token) headers.jwt = token; 

        let response = await fetch(url, {
            method: "POST",
            cors: "cors",
            headers,
            body: data
        });
        return await response.json();
    }
}