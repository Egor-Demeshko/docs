export async function handle({ event, resolve}){
    const fetch = event.fetch;

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

            /*console.log("DATA FROM SERVER: ", data);*/

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

    return await resolve(event)
}