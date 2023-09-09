import HTTPprojects from "$lib/scripts/utils/dataSendReceive/HTTP/HTTPprojects.js";
import { redirect } from '@sveltejs/kit';


export async function load({ locals, cookies }){
    console.log("[server load anketa]: cookies: ", await cookies.getAll());
    const cookiesArr = await cookies.getAll();
    const client = new HTTPprojects();

    let project_id;
    let jwt;

    cookiesArr.forEach( element => {

        if(element.name === "project_id"){
            project_id = element.value;
        } else if (element.name === "jwt"){
            jwt = element.value;
        }

    });

    const {success, data} = await client.getOnlyActive(jwt, {project_id: Number(project_id)}, "no-cors");
    console.log('[page.server.js]: after request: ', data);
    if(success) return data;
    if(!success){
        throw redirect("307", "/projects");
    }
}