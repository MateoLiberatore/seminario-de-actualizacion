class PlanesPrecios extends HTMLElement {
    constructor() {
        super();

        // Contenedor general de las tres columnas
        this._row = document.createElement('div');
        this._row.className = 'w3-row-padding';

        // Valor por defecto
        this._planes = [
            { titulo: "Basic", color: "w3-black", almacenamiento: "10GB", emails: "10", dominios: "10", soporte: "Endless", precio: "$ 10" },
            { titulo: "Pro", color: "w3-green", almacenamiento: "25GB", emails: "25", dominios: "25", soporte: "Endless", precio: "$ 25" },
            { titulo: "Premium", color: "w3-black", almacenamiento: "50GB", emails: "50", dominios: "50", soporte: "Endless", precio: "$ 50" }
        ];
    }

    crearColumna(plan) {
        const container = document.createElement('div');
        container.className = 'w3-third w3-margin-bottom';

        const ul = document.createElement('ul');
        ul.className = 'w3-ul w3-border w3-center w3-hover-shadow';

        // li titulo
        const liTitle = document.createElement('li');
        liTitle.className = `${plan.color} w3-xlarge w3-padding-32`;
        liTitle.textContent = plan.titulo;

        // li almacenamiento
        const liStorage = document.createElement('li');
        liStorage.className = 'w3-padding-16';
        const bStorage = document.createElement('b');
        bStorage.textContent = plan.almacenamiento;
        liStorage.appendChild(bStorage);
        liStorage.append(" Storage");

        // li emails
        const liEmails = document.createElement('li');
        liEmails.className = 'w3-padding-16';
        const bEmails = document.createElement('b');
        bEmails.textContent = plan.emails;
        liEmails.appendChild(bEmails);
        liEmails.append(" Emails");

        // li dominios
        const liDomains = document.createElement('li');
        liDomains.className = 'w3-padding-16';
        const bDomains = document.createElement('b');
        bDomains.textContent = plan.dominios;
        liDomains.appendChild(bDomains);
        liDomains.append(" Domains");

        // li soporte
        const liSupport = document.createElement('li');
        liSupport.className = 'w3-padding-16';
        const bSupport = document.createElement('b');
        bSupport.textContent = plan.soporte;
        liSupport.appendChild(bSupport);
        liSupport.append(" Support");

        // li precio
        const liPrice = document.createElement('li');
        liPrice.className = 'w3-padding-16';
        const h2Price = document.createElement('h2');
        h2Price.className = 'w3-wide';
        h2Price.textContent = plan.precio;
        const spanPrice = document.createElement('span');
        spanPrice.className = 'w3-opacity';
        spanPrice.textContent = "per month";
        liPrice.append(h2Price, spanPrice);

        // li botón
        const liButton = document.createElement('li');
        liButton.className = 'w3-light-grey w3-padding-24';
        const button = document.createElement('button');
        button.className = 'w3-button w3-green w3-padding-large';
        button.textContent = 'Sign Up';
        button.onclick = () => console.log(`Sign Up clickeado en plan: ${plan.titulo}`);
        liButton.appendChild(button);

        ul.append(liTitle, liStorage, liEmails, liDomains, liSupport, liPrice, liButton);
        container.appendChild(ul);

        return container;
    }

    render() {
        // Vaciar el contenedor antes de re-renderizar
        this._row.innerHTML = "";

        // Crear columnas dinámicamente
        this._planes.forEach(plan => {
            this._row.appendChild(this.crearColumna(plan));
        });

        // Si no estaba agregado, lo agregamos
        if (!this.contains(this._row)) {
            this.appendChild(this._row);
        }
    }

    connectedCallback() {
        console.log('PlanesPrecios agregado al DOM');

        // Si tiene atributo data-planes, se usa para inicializar
        const attr = this.getAttribute('data-planes');
        if (attr) {
            this._updatePlanes(attr);
        }

        this.render();
    }

    disconnectedCallback() {
        console.log('PlanesPrecios removido del DOM');
    }

    adoptedCallback() {
        console.log('PlanesPrecios movido a otro documento');
    }

    static get observedAttributes() {
        return ['data-planes'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'data-planes' && oldValue !== newValue) {
            console.log('Atributo data-planes cambió. Re-renderizando...');
            this._updatePlanes(newValue);
            this.render();
        }
    }

    _updatePlanes(value) {
        try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) {
                this._planes = parsed;
            } else {
                console.error("data-planes debe ser un array JSON");
            }
        } catch (e) {
            console.error("Error al parsear data-planes:", e);
        }
    }
}

customElements.define('x-planes-precios', PlanesPrecios);

// Ejemplo de uso desde JS
function main() {
    const comp = new PlanesPrecios();

    // Ejemplo dinámico: cambiar el atributo después de 3 segundos
    setTimeout(() => {
        comp.setAttribute('data-planes', JSON.stringify([
            { titulo: "Mini", color: "w3-black", almacenamiento: "5GB", emails: "5", dominios: "2", soporte: "Basic", precio: "$ 5" },
            { titulo: "Pro", color: "w3-green", almacenamiento: "25GB", emails: "25", dominios: "25", soporte: "Endless", precio: "$ 25" },
            { titulo: "Max", color: "w3-black", almacenamiento: "100GB", emails: "100", dominios: "100", soporte: "Premium", precio: "$ 100" }
        ]));
    }, 3000);

    document.body.appendChild(comp);
}

window.onload = main;
