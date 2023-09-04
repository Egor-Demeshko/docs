<script>
    import Button2 from '$lib/components/CntrElem/Button2.svelte';
    
    export let text;
    export let heading;
  </script>
  


    <div class="modal-window">
        <h2>{heading}</h2>
        <p>{text}</p>
        <Button2 on:click
        name={"Вернуться к работе"}
        --bg="var(--middle-blue)"
        --bg-hover="var(--gray-blue)"
        --color="var(--white-blue)"
        --border="2px solid var(--middle-blue)"
        --border-hover="2px solid var(--gray-blue)"
        --focus-border="2px solid var(--orange)"
      />
    </div>


  
  <style>    
    .modal-window {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        background-color: var(--white-blue);
        padding: 3rem 2.5rem;
        border-radius: 20px;
        max-width: 540px;
        text-align: center;
        color: var(--middle-blue);
    }

    h2{
        margin: 0;
        margin-bottom: .625rem;
        font-size: 1.5rem;
        color: inherit;
        font-weight: 500;
    }

    p{
        font-size: 1.125rem;
        margin-bottom: 1.5rem;
        color: inherit;
    }
    
    .modal-window p {
      margin-bottom: 1rem;
    }
  </style>