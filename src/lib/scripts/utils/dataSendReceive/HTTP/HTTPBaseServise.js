export default class HTTPBaseServise{
    #origin = "https://reqres.in/api/";
    constructor(){

    }


    async post(data, path){
        let url = new URL(this.#origin + "users");
        let result = await fetch(url, {
            method: "POST"
        });
        
        console.log("[HTTPBaseServise]  POST DATA: ", result);
        return await result.json();
    }

    async delete(data, path){
        console.log("[HTTPBaseServise]  DELETE DATA: ", data);
    }

    async patch(data, path){
        console.log("[HTTPBaseServise]  PATCH DATA: ", data);
    }
}