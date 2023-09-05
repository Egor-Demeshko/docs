<script>

</script>




<div class="background">
</div>     
<div class="logo_position">
    <LogoAndName/>
    <div class="header_right">
        <Button2
        on:click
        --bg="transparent"
        --color="var(--white-blue)"
        --border="3px solid var(--white-blue)"
        --font-size="1rem"
        --padding=".5rem 1.25rem"
        --bg-hover="var(--gray-blue)"
        --color-hover="var(--white-blue)"
        --border-hover="3px solid var(--white-blue)"
        --focus-border="3px solid var(--orange)"
        --focus-outline="none"
        name={"Поддержка"}
        />
    </div>          
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
    justify-content: space-between;
}

</style>