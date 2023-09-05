export default class HTTPBaseServise{
    #origin = "http://constructor.crabdance.com/";
    constructor(){

    }


    async post(data, path){
        let url = new URL(this.#origin + path);
        console.log("{url}", data);

        let result = await fetch(url, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-type": "application/json"
            },
            body: data
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