import HTTPprojects from "$lib/scripts/utils/dataSendReceive/HTTP/HTTPprojects.js";
import JWT from "$lib/scripts/controllers/instances/JWT.js";
import DataServise from "$lib/scripts/controllers/instances/DataServise.js";


export class Projects{
    #client;
    #jwt;
    #saveData;
    /**айди активного проекта. используется для навигации projects => redactor */
    #activeProject;

    constructor(){
        this.#client = new HTTPprojects();
        this.#saveData = new DataServise({save: "local"});
        this.#jwt = new JWT({
            saveService: this.#saveData,
            http: this.#client
        });
    }


    async create(newName){
        let token = await this.#jwt.getToken();

        if(token){
            let result = await this.#client.create(token, {name: newName});
            if(result) return result;
        }
    }

    /** удаление проекта */
    async delete(id){
        // запросить эндпоинт
        let token = await this.#jwt.getToken();

        if(token){
            let result = await this.#client.delete(token, {project_id: id});
            if(result) return result;
        }
        //
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

    
    async getToken(){
        return await this.#jwt.getToken(); 
    }


    getTokenTimeStamp(){
        return this.#saveData.getTokenExp();
    }


    async changeName(data){
        let token = await this.#jwt.getToken(); 

        if(token){
            let result = await this.#client.changeName(token, data);
            if(result.success) return result.data;
        }
    }

    /**устанавливает id активного проекта */
    setActiveProject(id){
        this.#activeProject = id;
    }




    async getProjectFullInfo(){
        
    }



}