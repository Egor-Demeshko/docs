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
        super.post(data, this.#path);
    }

    async delete(data){
        super.delete(data, this.#path);
    }

    async patch(data){
        super.patch(data, this.#path);
    }
}