import Storage from "$lib/scripts/controllers/instances/Storage.js";

export default class DataService{
    #service;

    constructor({service}){
        if(service === "local"){
            this.#service = new Storage();
        }
    }


    static isToken(){
        return Storage.isToken();
    }


    getToken(){
        this.#service.getToken();
    }

    save(obj){
        this.#service.save(obj);
    }

    deleteToken(){
        this.#service.delete();
    }
}