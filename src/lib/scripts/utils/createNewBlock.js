import { nodes, storeForSimpleTexts } from "$lib/scripts/stores";
import generateUUID from "$lib/scripts/utils/generateUUID";
import { PUBLIC_BLOCKWIDTH, PUBLIC_BLOCKHEIGHT } from '$env/static/public';
import SimpleText from "$lib/scripts/docElements/simpleText.js";

/**
 * Creates a new block.
 *
 * @param {string} whatBlockToCreate - The type of block to create.
 * @param {object} controller - The controller object.
 * @return {Promise} A promise that resolves with the result of creating the block.
 */
export default async function createNewBlock(whatBlockToCreate, controller){
    const id = generateUUID();
    const defaultName = "Новый блок";
    let newTextElement = new SimpleText({id, name: "", content: defaultName});

    let newBlock = {
        id,
        "name": defaultName,
        "parent_id": null,
        "description": "",
        "data_type": (whatBlockToCreate === "checkbox") ? "bool" : "string",
        "node_type": whatBlockToCreate,
        "content": "",
        "condition": null,
        "trigger": null,
        "x": 500,
        "y": 150,
        "active": false,
        "width": +PUBLIC_BLOCKWIDTH,
        "height": +PUBLIC_BLOCKHEIGHT
    };

    if (whatBlockToCreate === "select") {
        newBlock.view_type = "drop_list";
        newBlock.options = [];
    }

    nodes.update(nodes => [...nodes, newBlock]);     

    storeForSimpleTexts.update( (elements) => [...elements, newTextElement]);

    //TODO new block
    debugger;
    let result = await controller.create(newBlock);
    console.log("[createNewBlock]: reslut: ", result);
}