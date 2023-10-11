import { nodes, storeForSimpleTexts } from "$lib/scripts/stores";
import generateUUID from "$lib/scripts/utils/generateUUID";
import { PUBLIC_BLOCKWIDTH, PUBLIC_BLOCKHEIGHT } from '$env/static/public';
import { getCors } from "$lib/components/draws/SVGMain.svelte";
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
    let {y} = getCors();
    y = Math.floor(y);

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
        "y": (-1 * y + 250),
        "active": true,
        "width": +PUBLIC_BLOCKWIDTH,
        "height": +PUBLIC_BLOCKHEIGHT
    };

    if (whatBlockToCreate === "select") {
        newBlock.view_type = "drop_list";
        newBlock.options = [];
    }

    nodes.update(nodes => [...nodes, newBlock]);     

    storeForSimpleTexts.update( (elements) => [...elements, newTextElement]);


    let result = await controller.create(newBlock);
    console.log("[createNewBlock]: {SAVING NEW BLOCK DATA} reslut: ", result);
}