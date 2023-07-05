export default class SimpleText{
    domLinks = [];

    constructor(id, name, content){
        this.id = id;
        this.name = name;
        this.content = content;
    }

    connect(root){
        /**every element receive linl to it's holding element */
        this.root = root;
        // debugger;
        /*console.log("SIMPLE TEXT", {id: this.id, name: this.name, content: this.content, root: this.root});*/
        let links = root.querySelectorAll(`span[data-simpleText="${this.id}"]`);

        if(links instanceof NodeList){
            this.domLinks = Array.from(links);
        } else {
            throw new Error("text elements: couldn't connect elements with document");
        }
    }
}    