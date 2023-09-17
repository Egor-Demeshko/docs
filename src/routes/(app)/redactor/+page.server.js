import HTTPprojects from "$lib/scripts/utils/dataSendReceive/HTTP/HTTPprojects.js";
import { redirect } from '@sveltejs/kit';
import HTTPtemplate from "$lib/scripts/utils/dataSendReceive/HTTP/HTTPtemplate.js";


export async function load({ cookies }){
    //console.log("[server load anketa]: cookies: ", await cookies.getAll());
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

    const {success, data} = await client.getFullInfo(jwt, {project_id: Number(project_id)}, "no-cors");
    console.log('[page.server.js]: after request: ', data);
    if(success) return data;
    if(!success){
        throw redirect("307", "/projects");
    }
}

/*
export const actions = {
    default: async ({request, cookies, fetch}) => {
        const data = await request.formData();
        const jwt = cookies.get("jwt");
        const content = cookies.getAll();
        const client = new HTTPtemplate();
        //console.log("[ACtioNS]: CONTENT-TYPE: ", content);
        //console.log("[ACtioNS]: JWT ", jwt);
        let response = await client.sendFile(jwt, data);
        console.log('[ACTIONS]: reponse for request: ', response);
    }
}*/

