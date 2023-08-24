export default class HTTPBaseServise{
    #origin = "https://reqres.in/api/";
    constructor(){

    }


    async post(data, path){
        console.log("[HTTPBaseServise]  POST DATA: ", data);
        let URL = new URL(this.#origin + path);
        fetch(URL);
    }

    async delete(data, path){
        console.log("[HTTPBaseServise]  DELETE DATA: ", data);
    }

    async patch(data, path){
        console.log("[HTTPBaseServise]  PATCH DATA: ", data);
    }
}