class LoginComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() 
    {
        var styleLink = document.createElement('link');

        styleLink.setAttribute('rel', 'stylesheet');
        styleLink.setAttribute('href', 'https://www.w3schools.com/w3css/5/w3.css');
        this.shadowRoot.appendChild(styleLink);

        var headerElement = document.createElement('header');
        headerElement.classList.add('w3-container', 'w3-teal');

        var h1Element = document.createElement('h1')
        h1Element.innerText = 'Login Example';
        headerElement.appendChild(h1Element);

        var divContainer = document.createElement('div');
        divContainer.classList.add('w3-container', 'w3-half', 'w3-margin-top');

        var formElement = document.createElement('form');
        formElement.classList.add('w3-container', 'w3-card-4');

        var pName = document.createElement('p');
        var inputName = document.createElement('input');
        inputName.classList.add('w3-input');
        inputName.setAttribute('type', 'text');
        inputName.style.width = '90%';
        inputName.setAttribute('required', '');

        var labelName = document.createElement('label');
        labelName.innerText = 'Name';
        pName.appendChild(inputName);
        pName.appendChild(labelName);
        formElement.appendChild(pName);

        var pPassword = document.createElement('p');
        var inputPassword = document.createElement('input');
        inputPassword.classList.add('w3-input');
        inputPassword.setAttribute('type', 'password');
        inputPassword.style.width = '90%';
        inputPassword.setAttribute('required', '');

        var labelPassword = document.createElement('label');
        labelPassword.innerText = 'Password';
        pPassword.appendChild(inputPassword);
        pPassword.appendChild(labelPassword);
        formElement.appendChild(pPassword);

        var pMale = document.createElement('p');
        var inputMale = document.createElement('input');
        inputMale.classList.add('w3-radio');
        inputMale.setAttribute('type', 'radio');
        inputMale.setAttribute('name', 'gender');
        inputMale.setAttribute('value', 'male');
        inputMale.setAttribute('checked', '');

        var labelMale = document.createElement('label');
        labelMale.innerText = 'Male';
        pMale.appendChild(inputMale);
        pMale.appendChild(labelMale);
        formElement.appendChild(pMale);

        var pFemale = document.createElement('p');
        var inputFemale = document.createElement('input');
        inputFemale.classList.add('w3-radio');
        inputFemale.setAttribute('type', 'radio');
        inputFemale.setAttribute('name', 'gender');
        inputFemale.setAttribute('value', 'female');

        var labelFemale = document.createElement('label');
        labelFemale.innerText = 'Female';
        pFemale.appendChild(inputFemale);
        pFemale.appendChild(labelFemale);
        formElement.appendChild(pFemale);

        var pDisabled = document.createElement('p');
        var inputDisabled = document.createElement('input');
        inputDisabled.classList.add('w3-radio');
        inputDisabled.setAttribute('type', 'radio');
        inputDisabled.setAttribute('name', 'gender');
        inputDisabled.setAttribute('value', '');
        inputDisabled.setAttribute('disabled', '');

        var labelDisabled = document.createElement('label');
        labelDisabled.innerText = "Don't know (Disabled)";
        pDisabled.appendChild(inputDisabled);
        pDisabled.appendChild(labelDisabled);
        formElement.appendChild(pDisabled);

        var pCheckbox = document.createElement('p');
        var inputCheckbox = document.createElement('input');
        inputCheckbox.setAttribute('id', 'milk');
        inputCheckbox.classList.add('w3-check');
        inputCheckbox.setAttribute('type', 'checkbox');
        inputCheckbox.setAttribute('checked', 'checked');

        var labelCheckbox = document.createElement('label');
        labelCheckbox.setAttribute('for', 'milk');
        labelCheckbox.innerText = 'Stay logged in';
        pCheckbox.appendChild(inputCheckbox);
        pCheckbox.appendChild(labelCheckbox);
        formElement.appendChild(pCheckbox);

        var pButton = document.createElement('p');
        var buttonLogin = document.createElement('button');
        buttonLogin.classList.add('w3-button', 'w3-section', 'w3-teal', 'w3-ripple');
        buttonLogin.innerText = 'Log in';
        pButton.appendChild(buttonLogin);
        formElement.appendChild(pButton);

        divContainer.appendChild(formElement);

        this.shadowRoot.appendChild(headerElement);
        this.shadowRoot.appendChild(divContainer);
    }

    disconnectedCallback() {
 
    }

    attributeChangedCallback(name, oldValue, newValue) { }
    static get observedAttributes() { return []; }
}

customElements.define('login-component', LoginComponent);