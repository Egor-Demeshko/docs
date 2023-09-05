import HTTPBaseServise from "./HTTPBaseServise";

export default class HTTPLogin extends HTTPBaseServise{
    #post = "";
    #delete = "";
    #get = "";
    #path = "api/v1/auth";

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
        const route = "/refresh/";

        
        let result = await super.post(JSON.stringify({refresh: token}), route);

        let {success, data} = result;

        if(success){
           return  {jwt: data.jwt, refresh: data.refresh}; 
        } else {

        }

    }
}