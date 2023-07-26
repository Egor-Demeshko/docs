<script>
    export let active;
    export let focusActive;


</script>


<div>
    <svg viewBox="0 0 10 10">
        <path d="M9.07675 5.92428H5.91769V9.07572C5.91769 9.58797 5.50612 10 4.99444 10C4.48276 10 4.07119 9.58797 4.07119 9.07572V5.92428H0.923248C0.411568 5.91314 0 5.50111 0 4.98886C0 4.74276 0.100111 4.51002 0.266963 4.33185C0.444939 4.16481 0.678532 4.06459 0.923248 4.06459H4.07119V0.924276C4.07119 0.412027 4.48276 0 4.99444 0C5.50612 0 5.91769 0.412027 5.91769 0.924276V4.06459H9.07675C9.58843 4.06459 10 4.47661 10 4.98886C10 5.50111 9.58843 5.91314 9.07675 5.92428Z"/>
    </svg>
</div>

<style>
    div{
        display: flex;
        color: inherit;
        justify-content: center;
        align-items: center;
        width: .75rem;
        height: .75rem;
        border-radius: 4px;
        border: 1px solid var(--deep-blue);
        background-color: currentcolor;
    }


    svg{
        width: 6px;
        height: 6px;
        fill: var(--deep-blue);
    }
    
</style>