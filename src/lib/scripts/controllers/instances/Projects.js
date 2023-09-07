import HTTPprojects from "$lib/scripts/utils/dataSendReceive/HTTP/HTTPprojects.js";
import JWT from "$lib/scripts/controllers/instances/JWT.js";
import DataServise from "$lib/scripts/controllers/instances/DataServise.js";


export class Projects{
    #client;
    #jwt;
    #saveData;

    constructor(){
        this.#client = new HTTPprojects();
        this.#saveData = new DataServise({save: "local"});
        this.#jwt = new JWT({
            saveService: this.#saveData,
            http: this.#client
        });
    }

    /**
     *
     * @description получает список проектов в учетной записи, функция сама запрашивает токен */
    async getList(){
        let token = await this.#jwt.getToken(); 

        if(token){
            let result = await this.#client.getList(token);
            if(result.success) return result.data;
        }
    }

    async changeName(data){
        let token = await this.#jwt.getToken(); 

        if(token){
            let result = await this.#client.changeName(token, data);
            if(result.success) return result.data;
        }
    }
}