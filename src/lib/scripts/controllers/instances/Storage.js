import { PUBLIC_CHAIN } from "$env/static/public";   

export default class Storage{
    static instance;

    constructor(){
        if(Storage.instance) return instance;
        
        Storage.instance = this;
    }

    static isToken(){
        const storage = window.localStorage;
        let data = localStorage.getItem(PUBLIC_CHAIN);

        return (data) ? true : false;
    }


    getTokenRefresh(){
        return localStorage.getItem(PUBLIC_CHAIN)?.refresh;
    }


    getTokenJwt(){
        
    }


    save(data){
        const storage = window.localStorage;

        storage.setItem( PUBLIC_CHAIN, data);
    }


    delete(){
        const local = window.localStorage;

        local.removeItem(PUBLIC_CHAIN);
    }
}