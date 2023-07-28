<div>
    <input type="text" placeholder="Найти блок по имени">
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M0.666504 7.8916C0.666504 3.90138 3.86679 0.666664 7.81454 0.666664C9.71031 0.666664 11.5284 1.42786 12.869 2.7828C14.2095 4.13774 14.9626 5.97543 14.9626 7.8916C14.9626 11.8818 11.7623 15.1165 7.81454 15.1165C3.86679 15.1165 0.666504 11.8818 0.666504 7.8916ZM14.8443 13.7119L16.9732 15.4303H17.0101C17.4408 15.8657 17.4408 16.5715 17.0101 17.0068C16.5794 17.4422 15.8811 17.4422 15.4504 17.0068L13.6838 14.9821C13.5167 14.8138 13.4229 14.5853 13.4229 14.347C13.4229 14.1086 13.5167 13.8801 13.6838 13.7119C14.0059 13.392 14.5222 13.392 14.8443 13.7119Z" fill="#DDE6ED"/>
        </svg>
</div>

<style>
    div{
        max-width: 15rem;
        position: relative;
    }


    input{
        border: none;
        border-bottom: 1px solid var(--light-blue);
        background-color: var(--middle-blue);
        padding: 0.09rem 0 0.22rem;
        width: 100%;
    }


    input::placeholder{
        color: var(--faded-gray-blue);
        font-style: italic;
        font-size: 0.875rem;
    }

    input:focus{
        border: none;
        border-bottom: 1px solid var(--light-blue);
        outline: none;
    }

    svg{
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
    }
</style>