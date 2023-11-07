import Demo from "$lib/scripts/controllers/instances/Demo.js";  
import Storage from "$lib/scripts/controllers/instances/Storage";
import { goto } from "$app/navigation";

const storage = new Storage();


export default async function processDemoCreation(){
    const local = window.localStorage;
    const data = local.getItem("chain");

    /**проверяем есть ли уже токены в localStorage*/
    if(data){
        let baseToken = data.split('.')[1];
        let {session, demo, exp} = JSON.parse(atob(baseToken));

        if(session && !demo){
            goto("/projects");
        } else if(session && demo){
            let dateNow = Date.now()/1000;

            /**проверяем не истек ли токен*/
            if(exp && (dateNow - exp) >= 0){
                storage.delete();
            } else {
                let response = await Demo.updateDemo();
            }
            goto("/");
        }   
    } else {
        /**если никаких токенов нет, то */
        try{
            let result = await Demo.createDemo();
            if(result) goto('/projects');
            document.dispatchEvent( new CustomEvent("error", {detail: {
                err_data: [
                    {
                        blockId: 0,
                        message: "Ошибка запроса на создание демо, перезагрузите страницу",
                        err_id: 1100,
                        err_type: "emergency",
                    }
                ]
            }}));
            
        } catch(e) {
            console.error(e.message);

            document.dispatchEvent( new CustomEvent("error", {detail: {
                err_data: [
                    {
                        blockId: 0,
                        message: "Ошибка сети",
                        err_id: 1101,
                        err_type: "emergency",
                    }
                ]
            }}));
        }
    }
}