import HTTPBaseServise from "./HTTPBaseServise";

export default class HTTPtemplate extends HTTPBaseServise{
    #post = "";
    #delete = "";
    #get = "";
    #path = "template";

    constructor(){
        super()
    }

    async post(data){
        return await super.post(data, this.#path);
    }

    async delete(data){
        return await super.delete(data, this.#path);
    }

    async patch(data){
        return await super.patch(data, this.#path);
    }
}