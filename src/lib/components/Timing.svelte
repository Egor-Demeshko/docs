<script>
	import { onMount } from "svelte";
    import { PUBLIC_TIMETOEND } from "$env/static/public";
    let timeLeft = 0;
    $: hour = 0;
    $: minutes = 0;
    $: seconds = 0;

    onMount( async () => {
        /*
        const local = window.localStorage;
        let {expired} = JSON.parse(local.getItem(PUBLIC_CHAIN));*/
        let expired = +window.localStorage.getItem(PUBLIC_TIMETOEND);
        
        if(!expired) return;
        let interval = setInterval( () => {
            let timeNow = Math.floor(Date.now()/1000); //секунды
            timeLeft = expired - timeNow;
            
            hour = Math.floor(timeLeft / 3600);
            {
                let difference = timeLeft - (hour * 3600);  
                minutes = Math.floor( difference / 60);
                difference = difference - (minutes * 60);
                seconds = difference;
            }
        }, 1000);



        return () => {
            clearInterval(interval);
        }
    });
</script>

<div>
    <span>Демо-режим,</span>
    <span class="time">{` ${(hour < 10) ? "0" + hour : hour}:${(minutes < 10) ? "0" + minutes : minutes}:${(seconds < 10) ? "0" + seconds : seconds}`}</span>
</div>


<style>
    div{
        display: inline-block;
        position: absolute;
        right: calc(100% + 1rem);
        top: 50%;
        transform: translateY(-50%);
        width: 11rem;
    }

    .time{
        font-size: .875rem;
    }
</style>

