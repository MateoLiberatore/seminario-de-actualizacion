class WCModalDialog extends HTMLElement {
    static get observedAttributes() {
        return ['open'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' }); 
        
        this.modalWrapper = document.createElement('div');
        this.modalWrapper.classList.add('modal-wrapper');

        this.closeButton = document.createElement('span');
        this.closeButton.classList.add('close-button');
        this.closeButton.textContent = '×';

        this.contentContainer = document.createElement('div');
        this.contentContainer.classList.add('content-container');
        
        this.contentSlot = document.createElement('slot');
        this.contentSlot.setAttribute('name', 'content');

        this.contentContainer.appendChild(this.closeButton);
        this.contentContainer.appendChild(this.contentSlot);
        this.modalWrapper.appendChild(this.contentContainer);
        this.shadowRoot.appendChild(this.modalWrapper);
        
        this.closeButton.addEventListener('click', this.close.bind(this));
        
        this.modalWrapper.addEventListener('click', (event) => {
            if (event.target === this.modalWrapper) {
                this.close();
            }
        });
        
        document.addEventListener('keydown', (event) => {
            if (this.hasAttribute('open') && event.key === 'Escape') {
                this.close();
            }
        });

        this.addStyles();
    }

    addStyles() {
        const link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', 'styles.css'); 
        this.shadowRoot.appendChild(link);
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'open') {
            const isOpen = this.hasAttribute('open');
            this.modalWrapper.style.display = isOpen ? 'block' : 'none';
            document.body.style.overflow = isOpen ? 'hidden' : ''; 

            const eventName = isOpen ? 'wc-modal-open' : 'wc-modal-close';
            this.dispatchEvent(new CustomEvent(eventName, { 
                bubbles: true, 
                composed: true 
            }));
        }
    }

    open() {
        if (!this.hasAttribute('open')) {
            this.setAttribute('open', '');
        }
    }

    close() {
        if (this.hasAttribute('open')) {
            this.removeAttribute('open');
        }
    }

    toggle() {
        if (this.hasAttribute('open')) {
            this.close();
        } else {
            this.open();
        }
    }
}

customElements.define('wc-modal-dialog', WCModalDialog);

document.addEventListener('DOMContentLoaded', () => {
    
    const container = document.createElement('div');
    container.classList.add('w3-container');
    document.body.appendChild(container);
    
    const title = document.createElement('h2');
    title.textContent = 'Web Component Modal';
    container.appendChild(title);

    const modalInstance = document.createElement('wc-modal-dialog');
    modalInstance.id = 'myModal'; 

    const slotContent = document.createElement('div');
    slotContent.setAttribute('slot', 'content');
    slotContent.classList.add('w3-modal-content');
    
    const innerContainer = document.createElement('div');
    innerContainer.classList.add('w3-container');

    const p1 = document.createElement('p');
    p1.textContent = 'Contenido del modal generado por JavaScript.';
    const p2 = document.createElement('p');
    p2.textContent = 'Solo hay una instancia del modal y un botón de activación.';

    innerContainer.appendChild(p1);
    innerContainer.appendChild(p2);
    slotContent.appendChild(innerContainer);

    modalInstance.appendChild(slotContent);
    container.appendChild(modalInstance);

    // ÚNICO Botón de activación
    const openButtonToggle = document.createElement('button');
    openButtonToggle.classList.add('w3-button', 'w3-black');
    openButtonToggle.textContent = 'Abrir Modal';
    
    openButtonToggle.addEventListener('click', () => {
        modalInstance.toggle(); 
    });
    
    container.appendChild(openButtonToggle);
});