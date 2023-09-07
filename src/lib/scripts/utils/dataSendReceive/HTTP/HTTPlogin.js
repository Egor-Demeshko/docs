import HTTPBaseServise from "./HTTPBaseServise";

export default class HTTPLogin extends HTTPBaseServise{
    #post = "";
    #delete = "";
    #get = "";
    path = "api/v1/auth";

    constructor(){
        super()
    }


    /**запрашиваем енд поинт, перерабатываем ответ, чтобы только токены были 
     * @return {
     *  jwt {string}
     *  refresh {string}
     * }
    */
    async refresh(token){
        console.log('[HTTPlogin]: refreshing token');
        const end = "/refresh";

        try{
            let result = await super.post(JSON.stringify(token), end);
            
            let {success, data, details} = result;

            console.log("[HTTPLOGIN]: after request: ", {result});
            
            if(success){
                return  {jwt: data.jwt, refresh: data.refresh}; 
            } else {
                let errors = '';
                details.forEach( (err) => errors += `${err.message} \n`);
                throw new Error(errors);
            }

        } catch(e){
            console.log(e.message);
        }
    }


    async post(data, reg){
        let end = (reg) ? "/register" : "/login";

        let result;

        try{
             result = await super.post(JSON.stringify(data), end);
             console.log("[HTTPlogin]: data", data);
             if(result.success){
                return result;
             } else {
                return null;
            }
        } catch(e){
            console.log("[Логин]: не удалось залогиниться!");
            throw e;
        }
    }
}