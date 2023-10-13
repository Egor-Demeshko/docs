export default function sanitizeHTML(htmlString){
    return htmlString.replace(/<script .*>.*<\/script>/gi, "")
                    .replace(/<[^>]+\bon\w+\s*=\s*"[^"]*"[^>]*>/gi, "")
                    .replaceAll("doc_active", "")
                    .replaceAll("doc_hoverlike", "");   
}