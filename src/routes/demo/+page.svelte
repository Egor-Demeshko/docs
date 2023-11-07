<script>
	import { onMount } from "svelte";
    import MessagesContainer from "$lib/components/MessagesContainer.svelte";
    import processDemoCreation from "$lib/scripts/utils/demo/processDemoCreation.js";
 
    onMount( () => {
        processDemoCreation();
    });
</script>


<div class="noise">
</div>

<div class="message" id="messages_anchor">
    <MessagesContainer />
    <div class="gears">
        <div class="gear__big">
            <svg viewBox="0 0 126 118" xmlns="http://www.w3.org/2000/svg">
                <path d="M113.625 41.625C102.312 41.625 97.6875 33.625 103.312 23.8125C106.562 18.125 104.625 10.875 98.9375 7.62497L88.125 1.43747C83.1875 -1.50003 76.8125 0.24997 73.875 5.18747L73.1875 6.37497C67.5625 16.1875 58.3125 16.1875 52.625 6.37497L51.9375 5.18747C49.125 0.24997 42.75 -1.50003 37.8125 1.43747L27 7.62497C21.3125 10.875 19.375 18.1875 22.625 23.875C28.3125 33.625 23.6875 41.625 12.375 41.625C5.875 41.625 0.5 46.9375 0.5 53.5V64.5C0.5 71 5.8125 76.375 12.375 76.375C23.6875 76.375 28.3125 84.375 22.625 94.1875C19.375 99.875 21.3125 107.125 27 110.375L37.8125 116.562C42.75 119.5 49.125 117.75 52.0625 112.812L52.75 111.625C58.375 101.812 67.625 101.812 73.3125 111.625L74 112.812C76.9375 117.75 83.3125 119.5 88.25 116.562L99.0625 110.375C104.75 107.125 106.687 99.8125 103.437 94.1875C97.75 84.375 102.375 76.375 113.687 76.375C120.187 76.375 125.562 71.0625 125.562 64.5V53.5C125.5 47 120.187 41.625 113.625 41.625ZM63 79.3125C51.8125 79.3125 42.6875 70.1875 42.6875 59C42.6875 47.8125 51.8125 38.6875 63 38.6875C74.1875 38.6875 83.3125 47.8125 83.3125 59C83.3125 70.1875 74.1875 79.3125 63 79.3125Z"/>
            </svg>
        </div>
        <div class="gear__small">
            <svg viewBox="0 0 126 118" xmlns="http://www.w3.org/2000/svg">
                <path d="M113.625 41.625C102.312 41.625 97.6875 33.625 103.312 23.8125C106.562 18.125 104.625 10.875 98.9375 7.62497L88.125 1.43747C83.1875 -1.50003 76.8125 0.24997 73.875 5.18747L73.1875 6.37497C67.5625 16.1875 58.3125 16.1875 52.625 6.37497L51.9375 5.18747C49.125 0.24997 42.75 -1.50003 37.8125 1.43747L27 7.62497C21.3125 10.875 19.375 18.1875 22.625 23.875C28.3125 33.625 23.6875 41.625 12.375 41.625C5.875 41.625 0.5 46.9375 0.5 53.5V64.5C0.5 71 5.8125 76.375 12.375 76.375C23.6875 76.375 28.3125 84.375 22.625 94.1875C19.375 99.875 21.3125 107.125 27 110.375L37.8125 116.562C42.75 119.5 49.125 117.75 52.0625 112.812L52.75 111.625C58.375 101.812 67.625 101.812 73.3125 111.625L74 112.812C76.9375 117.75 83.3125 119.5 88.25 116.562L99.0625 110.375C104.75 107.125 106.687 99.8125 103.437 94.1875C97.75 84.375 102.375 76.375 113.687 76.375C120.187 76.375 125.562 71.0625 125.562 64.5V53.5C125.5 47 120.187 41.625 113.625 41.625ZM63 79.3125C51.8125 79.3125 42.6875 70.1875 42.6875 59C42.6875 47.8125 51.8125 38.6875 63 38.6875C74.1875 38.6875 83.3125 47.8125 83.3125 59C83.3125 70.1875 74.1875 79.3125 63 79.3125Z"/>
            </svg>
        </div>
    </div>
    <h1>Создаем Демо-Aккаунт</h1>
</div>

<style>
    .noise{
        width: 100vw;
        height: 100vh;
        background-image: url('/assets/images/noise.svg');
        mix-blend-mode: soft-light;
        position: absolute;
    }

    .message{
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 3rem;
    }

    .gears{
        width: clamp(179px, 12.5vw, 240px);
        height:  clamp(164px, 11.46vw, 220px);
        position: relative;
    }

    .gear__big,
    .gear__small{
        fill: var(--white-blue);
    }

    .gear__big{
        position: absolute;
        bottom: 0;
        left: 0;
        width: clamp(112px, 7.8vw, 150px);
        height: clamp(112px, 7.8vw, 150px);
        animation-name: rotate-slow;
        animation-duration: 3.6s;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
        animation-fill-mode: forwards;
    }

    .gear__small{
        position: absolute;
        right: 0;
        top: 0;
        width: clamp(89.56px, 6.25vw, 120px);
        height: clamp(89.56px, 6.25vw, 120px);
        animation-name: rotate-fast;
        animation-duration: 2.4s;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
        animation-fill-mode: forwards;
    }

    svg{
        width: 100%;
        height: 100%;
    }

    @keyframes rotate-slow{
        0%{
            transform: rotateZ(0);
        }
        100%{
            transform: rotateZ(360deg);
        }
    }

    @keyframes rotate-fast{
        0%{
            transform: rotateZ(0);
        }
        100%{
            transform: rotateZ(-360deg);
        }
    }
</style>