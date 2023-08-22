<script>
    import createNewBlock from '$lib/scripts/utils/createNewBlock.js';
    import { nodeOptions } from "$lib/scripts/stores.js";


  
    function handleClick(optionId) {
        createNewBlock(optionId);
    }


  </script>
  
  <ul>
    {#each $nodeOptions as option}
        <li on:click={() => handleClick(option.value)}>
            <svg>
            <use href="/assets/icons/all.svg#{option.value}"/>
            </svg>
            <span>{option.text}</span>
        </li>
    {/each}
  </ul> 


  <style>
    ul {
        list-style: none;
        padding: .575rem 0;
        margin: 0;
        border: 2px solid var(--middle-blue);
        background-color: var(--light-slate-gray);
        display: flex;
        flex-direction: column;
        gap: .25rem;
        border-radius: .875rem;
    }
  
    li {
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: .25rem .875rem;
        transition: background 400ms ease-in-out;
    }

    li:hover{
        background-color: var(--middle-blue);
    }
  
    svg {
        width: .875rem;
        height: .875rem;
        margin-right: .5rem;
    }
  </style>