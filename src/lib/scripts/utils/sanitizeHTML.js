export default function sanitizeHTML(htmlString){
    return htmlString.replace(/<script .*>.*<\/script>/gi, "")
                    .replace(/<[^>]+on[a-z]+\s*=\s*"[^"]*"/gi, "");
}