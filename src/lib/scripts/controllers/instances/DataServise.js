import Storage from "$lib/scripts/controllers/instances/Storage.js";

export default class DataService{
    #service;

    constructor({save}){
        if(save === "local"){
            this.#service = new Storage();
        }
    }


    static isToken(){
        return Storage.isToken();
    }

    static isRefreshToken(){
        return Storage.isRefreshToken();
    }


    getToken(whatToken){
        return this.#service.getToken(whatToken);
    }

    getTokenExp(){
        return this.#service.getTokenExp();
    }

    save(obj){
        this.#service.save(obj);
    }

    deleteToken(){
        this.#service.delete();
    }
}