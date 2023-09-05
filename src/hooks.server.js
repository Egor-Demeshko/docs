export async function handle({ event, resolve}){
    const fetch = event.fetch;
    const cookies = event.cookies;




    let response = await resolve(event);

   /* console.log("event", event);
    console.log("coockie", cookies.getAll());*/
    /*
    if( event.url.pathname.startsWith("/redactor") ||
        event.url.pathname.startsWith("/anketa") ){
        
        try{
            let data = await fetch('http://constructor.crabdance.com/get_project', {
                        method: "POST",
                        body: JSON.stringify({
                            "user_id": 1,
                            "project_id": 1
                        }),
                        headers: {
                            'Content-Type': 'application/json'
                        },  
            })
            .then( (response) => (response.ok) ? response.json() : '');

            /*console.log("DATA FROM SERVER: ", data);*//*

            if(data){
                event.locals = data;
            }           
        } catch(err){

            resolve(event.locals = {
                "error": "Data no received",
                "message": err.message
            });
        }
    

    }
    */
    return response;
}