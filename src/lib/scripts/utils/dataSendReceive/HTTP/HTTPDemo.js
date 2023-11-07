
import { PUBLIC_BACK_HOST } from "$env/static/public";

export default class HTTPDemo{
    static path = "api/v1/auth";
    static secondPath = "/demo";
    constructor(){
    }

    static async createDemo(){
        let response = await fetch(PUBLIC_BACK_HOST + this.path + this.secondPath, {method: "post"});
        return await response.json();
    }
}