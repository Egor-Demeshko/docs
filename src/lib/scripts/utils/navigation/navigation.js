import DataService from "$lib/scripts/controllers/instances/DataServise.js";
/**определяем руты */
const paths = ["/", "/projects", "/anketa", "/contact", "/redactor"];

/**
 * @param none
 * @returns {Promise <{redirect: boolean, path: string}>} 
 * @description функция чекает токен, если надо пытается освежить токен и определяет перенаправление,
 *  возращает его в компонент страницы или layout
 * будет работать на корневом layout и на каждой странице основного потока*/
export async function shouldRedirected(controller){
    const currentPath = window.location.pathname;
    
    if(!paths.includes(currentPath)) return {redirect: false, path: ""};

    /**если аксесс токен есть, проверить сессию, если надо обновить ее*/
    if(DataService.isToken()){
    /**
     * проверяем токен, просто в памяти. есть ли он.
     * если его нет, разблокируем логин
     * 
     * если токен есть, то проверяем его свежесть
     * 
     * если он свежий, то грузим дальше
     * если нет, то пытаемся его обновить

     * если обновился, то грузим дальше
     * если нет то редирект на логин, старый токен необходимо удалить.
    */
        //если он свежий, то грузим дальше
        if(controller.isTokenFresh()){

            if(currentPath === "/"){
                return {redirect: true, path: "projects"};
            }
            return {redirect: false, path: ""};
        } else {
            //если нет, то пытаемся его обновить
           let result = await tryRefresh(controller);
           if(result){
                if(currentPath === "/"){
                    return {redirect: true, path: "projects"};
                } 
                return {redirect: false, path: ""};
           } else {
                if(window.location.pathname === '/'){
                    return {redirect: false, path: ""};
                } else {
                    return {redirect: true, path: "/"};
                }
           }
        }

    } else {
        if(DataService.isRefreshToken()){
            let result = await tryRefresh(controller);
            if(result){
                if(currentPath === "/"){
                    return {redirect: true, path: "projects"};
                } else {
                    return {redirect: false, path: ""};
                }  
            } else {
                return {redirect: true, path: "/"};
            }
        } else {
            if(window.location.pathname === '/'){
                return {redirect: false, path: ""};
            } else {
                return {redirect: true, path: "/"};
            }
        }
    }
}


async function tryRefresh(controller){
    try{
        return await controller.refreshSession();     
        } catch(e) {
            console.log("[main]: не удалось обновить сессию", e.message);
        }
        //TODO сделать кнопку обновления сессии
}