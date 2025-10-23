class RequestData extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        this.handleLoadRequest = this.handleLoadRequest.bind(this);
        this.handleErrorRequest = this.handleErrorRequest.bind(this);
        this.dataRequest = this.dataRequest.bind(this);

        this.requestArea = null; 
        
        this.addStyles();
        this.render();
    }

    renderEl(tag, props = {}, children = []) {
        const element = document.createElement(tag);

        for (const key in props) {
            if (key === 'classList' && Array.isArray(props[key])) {
                element.classList.add(...props[key]);
            } else if (key === 'textContent') {
                element.textContent = props[key];
            } else if (props.hasOwnProperty(key)) {
                element.setAttribute(key, props[key]);
            }
        }

        children.forEach(function(child) {
            if (child instanceof Node) {
                element.appendChild(child);
            } else if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            }
        });

        return element;
    }

    simulateTyping(text, delay = 5) {
        return new Promise(resolve => {
            let i = 0;
            const interval = setInterval(() => {
                if (i < text.length) {
                    this.requestArea.value += text.charAt(i);
                    i++;
                    this.requestArea.scrollTop = this.requestArea.scrollHeight; 
                } else {
                    clearInterval(interval);
                    resolve();
                }
            }, delay);
        });
    }

    async handleLoadRequest(xhr) {
        this.requestArea.classList.remove('loading'); 
        
        if (xhr.status >= 200 && xhr.status < 300) {
            const prettyJson = JSON.stringify(xhr.response, null, 2);
            
            this.requestArea.value += " fetch-data --url=/posts/1\n";
            await this.simulateTyping("[200 OK] Data payload received successfully.", 10);
            
            await this.simulateTyping(`\n\n${prettyJson}`, 5);
            
            this.requestArea.value += "\n\nmintuser@desktop:~$ ";
        } else {
            this.requestArea.value += ` fetch-data --url=/posts/1\n`;
            await this.simulateTyping(`\n[ERROR ${xhr.status}] The remote endpoint returned an error. Check firewall rules.`, 10);
            this.requestArea.value += "\n\nmintuser@desktop:~$ ";
        }
    }

    async handleErrorRequest(xhr) {
        this.requestArea.classList.remove('loading');
        
        this.requestArea.value += ` fetch-data --url=/posts/1\n`;
        await this.simulateTyping("\n[FATAL] Network error. Could not establish connection (CORS/Timeout).", 10);
        this.requestArea.value += "\n\nmintuser@desktop:~$ ";
    }

    dataRequest() {

        this.requestArea.value = "mintuser@desktop:~$ ";
        this.requestArea.classList.add('loading'); 
        

        this.simulateTyping("fetch-data --init-request\n[INFO] Starting request to API...", 15);

        const xhr = new XMLHttpRequest();

        xhr.open('GET', 'https://jsonplaceholder.typicode.com/posts/1', true);
        xhr.responseType = 'json';

        xhr.onload = this.handleLoadRequest.bind(this, xhr);
        xhr.onerror = this.handleErrorRequest.bind(this, xhr);

        setTimeout(() => xhr.send(), 500);
    }

    addStyles() {
        const style = this.renderEl('style', {}, [
            `
            /* --- Paleta Linux Mint Dark Theme (Mint-Y Refinado) --- */
            :host {
                --mint-window-bg: #353b48;      /* Gris oscuro del cuerpo de la ventana */
                --mint-terminal-bg: #1e1e1e;    /* Fondo del área de la terminal (Negro) */
                --mint-green: #68B045;          /* Color de acento Mint Green (Botón, Cursor) */
                --mint-dark-green: #568F3F;     /* Acento oscuro / hover */
                --mint-text: #E8EBE9;           /* Texto claro principal */
                --mint-prompt: #68B045;         /* Color para el prompt (verde) */
                --mint-output: #A0A0A0;         /* Color de salida general (gris claro - ÚNICO COLOR DE TEXTO) */
                --mint-shadow: rgba(0,0,0,0.4);
                
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background-color: #22252A; 
                font-family: 'Roboto', sans-serif; 
                font-size: 16px;
                box-sizing: border-box;
            }

            .wrapper {
                display: flex;
                flex-direction: column;
                max-width: 800px;
                width: 90%;
                margin: 50px auto;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 15px 40px var(--mint-shadow);
            }

            /* --- Barra de Título (Header) --- */
            .title-bar {
                background-color: var(--mint-window-bg);
                color: var(--mint-text);
                padding: 5px 15px;
                font-weight: 500;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 0.9em;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            .window-controls {
                font-weight: bold;
                opacity: 0.7;
            }

            /* --- Área de la Terminal (Consola) --- */
            .terminal-view {
                background-color: var(--mint-terminal-bg);
                padding: 15px;
                flex-grow: 1; 
            }
            
            .form-input {
                padding: 0;
                background-color: transparent;
                color: var(--mint-output); /* Todo el texto de salida usa este color */
                font-family: 'Roboto Mono', monospace; 
                border: none;
                font-size: 0.9em;
                line-height: 1.4;
                min-height: 400px; 
                resize: none; 
                outline: none;
                width: 100%;
                box-sizing: border-box;
            }
            
            /* Simulación del cursor pulsante (color verde Mint) */
            .form-input.loading {
                caret-color: var(--mint-green);
            }
            
            /* El color del PROMPT (mintuser@desktop:$) se manejaría idealmente con sintaxis resaltada, 
               pero ya que es un textarea simple, se usa el color general de salida. 
               Para dar un pequeño toque de Mint, mantenemos el color del cursor en verde. */

            
            /* --- Status Bar y Botón --- */
            .status-bar {
                background-color: var(--mint-window-bg);
                padding: 10px 15px;
                display: flex;
                justify-content: flex-end; 
                border-top: 1px solid rgba(0, 0, 0, 0.2);
            }

            .btn {
                background-color: var(--mint-green);
                color: var(--mint-text);
                border: none;
                border-radius: 4px;
                padding: 8px 15px; 
                cursor: pointer;
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: 1px;
                transition: background-color 0.2s;
                box-shadow: 0 2px 0 var(--mint-dark-green);
                font-size: 0.9em;
            }
            .btn:hover {
                background-color: var(--mint-dark-green);
            }
            .btn:active {
                transform: translateY(1px);
                box-shadow: 0 1px 0 var(--mint-dark-green);
            }
            `
        ]);
        this.shadowRoot.appendChild(style);
    }
    
    render() {
        
        const titleBar = this.renderEl('div', { classList: ['title-bar'] }, [
            this.renderEl('span', { textContent: 'Terminal - mintuser@desktop:/home/mintuser' }),
            this.renderEl('span', { classList: ['window-controls'], textContent: '✕ ☐ —' })
        ]);

        this.requestArea = this.renderEl('textarea', {
            name: 'terminal_output',
            placeholder: 'mintuser@desktop:~$ Pulsa el botón para iniciar la solicitud de datos...',
            rows: '20',
            classList: ['form-input']
        });

        const terminalView = this.renderEl('div', { classList: ['terminal-view'] }, [
            this.requestArea
        ]);

        const requestButton = this.renderEl('button', {
            classList: ['btn'],
            type: 'button',
            textContent: 'Ejecutar Comando de Fetch',
        });

        requestButton.addEventListener('click', this.dataRequest.bind(this));

        const statusBar = this.renderEl('div', { classList: ['status-bar'] }, [
            requestButton
        ]);

        const wrapper = this.renderEl('div', {
            classList: ['wrapper'],
        },
            [
                titleBar,
                terminalView,
                statusBar
            ]);

        this.shadowRoot.appendChild(wrapper);
    }

}

customElements.define('request-data', RequestData);

document.addEventListener('DOMContentLoaded', function() {
    const requestComponent = document.createElement('request-data');
    document.body.appendChild(requestComponent);
    
    const fontLink1 = document.createElement('link');
    fontLink1.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap';
    fontLink1.rel = 'stylesheet';
    document.head.appendChild(fontLink1);
    
    const fontLink2 = document.createElement('link');
    fontLink2.href = 'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400&display=swap';
    fontLink2.rel = 'stylesheet';
    document.head.appendChild(fontLink2);
});