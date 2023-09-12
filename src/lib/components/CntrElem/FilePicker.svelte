<script>
    export let name = "file";
    export let accept = ".docx";
    export let text = "Стандартный текст";
    import { documents } from "$lib/scripts/stores";

    const projectID = $documents.projectId;


</script>


<label tabindex="0">
    {text}
    <input type="file" {name} {accept} on:change tabindex="-1">
    <!--<input type="text" name="project_id" value="{projectID}" style="width: 0; height: 0">-->
</label>


<style>

    label{
        position: relative;
        background-color: var(--bg);
        color: var(--color);
        border: var(--border);
        border-radius: 30px;
        cursor: pointer;
        font-size: var(--font-size);
        padding: var(--padding);
        text-align: center;
        transition: background 600ms ease, color 600ms ease, border 600ms ease;
        width: 100%;
        outline: none;
        display: var(--display);
    }

    input{
        position: absolute;
        top: 0;
        left: 0;
        width: 0;
        height: 0;
    }

    label:hover{
        background-color: var(--bg-hover);
        color: var(--color-hover);
        border: var(--border-hover);
    }

    label:focus{
        border: 2px solid var(--orange);
    }
</style>