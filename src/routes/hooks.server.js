export async function handel({ event, resolve}){
    const fetch = event.fetch;

    if(event.url.pathName === "/"){
        //event.locals = await fetch('');
        //
        //TODO получение данных при загрузке страницы с сервера
    }


    return await resolve(event)
}