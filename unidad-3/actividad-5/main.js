class WCContactForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' }); 
        this.addStyles();
        this.render();
    }

    addStyles() {
        const link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', 'styles.css'); 
        this.shadowRoot.appendChild(link);
    }

    createRow(iconClass, inputName, inputType, placeholder) {
        const row = document.createElement('div');
        row.classList.add('input-row');

        const colIcon = document.createElement('div');
        colIcon.classList.add('icon-col');
        
        const icon = document.createElement('i');
        icon.classList.add('fa', iconClass);
        
        colIcon.appendChild(icon);

        const divInput = document.createElement('div');
        divInput.classList.add('input-rest');
        
        const input = document.createElement('input');
        input.classList.add('form-input');
        input.setAttribute('name', inputName);
        input.setAttribute('type', inputType);
        input.setAttribute('placeholder', placeholder);
        
        divInput.appendChild(input);
        
        row.appendChild(colIcon);
        row.appendChild(divInput);
        
        return row;
    }

    render() {
        const form = document.createElement('form');
        form.setAttribute('action', '/action_page.php');
        form.classList.add('form-container');

        const title = document.createElement('h2');
        title.classList.add('form-title');
        title.textContent = 'Contact Us';
        
        form.appendChild(title);
        
        form.appendChild(this.createRow('fa-user', 'first', 'text', 'First Name'));
        form.appendChild(this.createRow('fa-user', 'last', 'text', 'Last Name'));
        form.appendChild(this.createRow('fa-envelope-o', 'email', 'text', 'Email'));
        form.appendChild(this.createRow('fa-phone', 'phone', 'text', 'Phone'));
        form.appendChild(this.createRow('fa-pencil', 'message', 'text', 'Message'));

        const pButton = document.createElement('p');
        pButton.classList.add('btn-center');

        const button = document.createElement('button');
        button.classList.add('form-button');
        button.textContent = 'Send';

        pButton.appendChild(button);
        form.appendChild(pButton);

        this.shadowRoot.appendChild(form);
    }
}

customElements.define('wc-contact-form', WCContactForm);

document.addEventListener('DOMContentLoaded', () => {
    const contactFormInstance = document.createElement('wc-contact-form');
    document.body.appendChild(contactFormInstance);
});