export const ssr = false;

export function load({ locals }){
    if(locals) return {locals};
    return {}
}