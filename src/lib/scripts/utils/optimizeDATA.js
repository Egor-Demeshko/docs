export default function optimizeDATA(templates, project_id){
    /**
     *  
     * надо получить
     * 
     * {
     *          string: (html)
     *          name: (name)
     *           id: (template_id)
*              project_id
     * }
     * 
     */

     return templates.map( ({template_id, name, html}) => {
        return {
            string: html,
            name,
            id: template_id,
            project_id
        }
     });
}
