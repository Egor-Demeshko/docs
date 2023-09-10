import { nodes, storeForSimpleTexts } from "$lib/scripts/stores";
import generateUUID from "$lib/scripts/utils/generateUUID";
import { PUBLIC_BLOCKWIDTH, PUBLIC_BLOCKHEIGHT } from '$env/static/public';
import SimpleText from "$lib/scripts/docElements/simpleText.js";


export default async function createNewBlock(whatBlockToCreate, controller){
    const id = generateUUID();
    const defaultName = "Новый блок";
    let newTextElement = new SimpleText({id, name: "", content: defaultName});

    let newBlock = {
        id,
        "name": defaultName,
        "parent_id": null,
        "description": "",
        "data_type": "string",
        "node_type": whatBlockToCreate,
        "content": "",
        "condition": null,
        "trigger": null,
        "x": 600,
        "y": 150,
        "active": false,
        "width": +PUBLIC_BLOCKWIDTH,
        "height": +PUBLIC_BLOCKHEIGHT
    };

    if (whatBlockToCreate === "radiobutton") {
        newBlock.view_type = "";
        newBlock.options = [];
    }

    nodes.update(nodes => [...nodes, newBlock]);     

    storeForSimpleTexts.update( (elements) => [...elements, newTextElement]);

    //TODO new block
    let result = await controller.create(newBlock);
    console.log("[createNewBlock]: reslut: ", result);
}