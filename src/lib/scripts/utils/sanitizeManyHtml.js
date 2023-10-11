export default function sanitizeManyHtml(arr){
    return arr.map( (obj) => {
        try{          
            let string = obj.string;
            
            if(!string) throw new Error("в данных не найдена строка документа");

            return {
                ...obj,
                string: clearHtml(string)
            }
            
        } catch(e) {
            console.log(e.message);
            return obj;
        }
    });


    function clearHtml(html){
        let cleanHtml = '';
        html = html.trim() + '';
        let matchArr = html.match(/<body>[\s\S]*<\/body>/);
        if(!matchArr) return html;
        cleanHtml = matchArr[0];
        cleanHtml = cleanHtml.replace(/<body>/, "<div>")
                    .replace(/<\/body>/, "</div>")
                    .replaceAll("doc_active", "")
                    .replaceAll("doc_hoverlike", "");   
        return cleanHtml;
    }
}





        