<script>
    import LogoAndName from "$lib/components/LogoAndName.svelte";
    import Button2 from "$lib/components/CntrElem/Button2.svelte";
    import AccountButton from "$lib/components/CntrElem/AccountButton.svelte";
    import {onNavigate} from "$app/navigation";

    onNavigate( (navigation) => {
        if(!document.startViewTransition) return;

        return new Promise( (resolve) => {
            document.startViewTransition( async () => {
                resolve();
                await navigation.complete;
            });
        });
    });
</script>


<div class="background">
</div>     
<div class="logo_position">
    <LogoAndName/>
</div>

<div class="header_right">
    <div class="icon">
        <AccountButton />
    </div>
    <Button2
    on:click={() => {
        let url = new URL(window.location.origin + "/contact");
        window.open(url, "_blank")
    }}
    --bg="transparent"
    --color="var(--white-blue)"
    --border="2px solid var(--white-blue)"
    --font-size=".875rem"
    --padding=".25rem 1.25rem .15rem"
    --bg-hover="var(--gray-blue)"
    --color-hover="var(--white-blue)"
    --border-hover="2px solid var(--white-blue)"
    --focus-border="2px solid var(--orange)"
    --focus-outline="none"
    name={"Поддержка"}
    />
</div>          


    <slot></slot>

<style>
.background{
    background: url('/assets/images/noise.svg');
    mix-blend-mode: soft-light;  
    position: absolute;
    top:0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 0;
}

.logo_position{
    padding: 1.5rem;
    background-color: transparent;
    position: relative;
    display: flex;
    width: 50%;
    justify-content: space-between;
    view-transition-name: background;
}

.header_right{
    position: absolute;
    top: 1.25rem;
    right: 1.5rem;
    z-index: 20;
    display: flex;
    gap: .5rem;
    align-items: center;
}

@media print{
        .logo_position{
            display: none;
        }

        .background{
            display: none;
        }

        .header_right{
            display: none;
        }
}

</style>