export default function sanitizeManyHtmlInAnketa(arr){
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
        if(matchArr){
            cleanHtml = matchArr[0];  
            cleanHtml = cleanHtml.replace(/<body>/, "<div>")
            .replace(/<\/body>/, "</div>")
        } else {
            cleanHtml = html;
        }

        cleanHtml = cleanHtml.replaceAll("doc_active", "")
        .replaceAll("doc_hoverlike", "")
        .replaceAll("doc_elements", "doc_elements doc_no_active"); 

        return cleanHtml;
    }
}





        