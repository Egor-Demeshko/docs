import { PUBLIC_CHAIN } from "$env/static/public";  
import { PUBLIC_REFRESH, PUBLIC_DEMO, PUBLIC_TIMETOEND } from "$env/static/public"; 

export default class Storage{
    static instance;

    constructor(){
        if(Storage.instance) return this.instance;
        Storage.instance = this;
    }

    static isToken(){
        let data = localStorage.getItem(PUBLIC_CHAIN);

        return (data) ? true : false;
    }


    static isRefreshToken(){
        let data = localStorage.getItem(PUBLIC_REFRESH);

        return (data) ? true : false;  
    }


    getToken(kind){
        const data = localStorage.getItem(PUBLIC_CHAIN);

        if(kind === "refresh"){
            return JSON.parse( localStorage.getItem(PUBLIC_REFRESH) );

        } else if(kind === "jwt"){
            const obj = JSON.parse( localStorage.getItem(PUBLIC_CHAIN) );
            return obj?.jwt;
        }
    }


    getTokenExp(){
        const data = localStorage.getItem(PUBLIC_CHAIN);
 
        return JSON.parse(data)?.expired;
    }


    save(data){
        let accessToken = {jwt: data.jwt, expired: data.expired};
        let refresh = {refresh: data.refresh};
        
        
        localStorage.setItem( PUBLIC_CHAIN, JSON.stringify(accessToken));
        localStorage.setItem( PUBLIC_REFRESH, JSON.stringify(refresh));
    }


    delete(){
        const local = window.localStorage;

        local.removeItem(PUBLIC_CHAIN);
        // ВОТ ТУТ ИДЕТ УДАЛЕНИЕ ТОКЕНА. ПЕРЕСМОТЕРТЬ В DEMO.js
    }

    deleteDemo(){
        const local = window.localStorage;
        
        local.removeItem(PUBLIC_DEMO);
    }

    /**
     * 
     * @param {number} timeToEnd timestamp когда истечет демо учетка
     * @description сохраняет данные демо учетки
     */
    addDemo(timeToEnd){
        const local = window.localStorage;

        local.setItem( PUBLIC_DEMO, "true" );
        local.setItem( PUBLIC_TIMETOEND, timeToEnd );
    }
}