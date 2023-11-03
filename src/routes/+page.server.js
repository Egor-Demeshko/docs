export async function load({url}){
    const searchParams = url.searchParams;
    const response = {};

    if(searchParams.has("registrate")){
        response.registrate = true; 
    }

    return response;
}