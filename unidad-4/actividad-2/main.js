class RequestData extends HTMLElement {
    
    constructor(){
        super();
        this.attachShadow({ mode: 'open' });

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

    async dataRequest(){
        const URL = 'https://jsonplaceholder.typicode.com/posts/1';

        this.requestArea.value = "mintuser@desktop:~$ ";
        this.requestArea.classList.add('loading');

        await this.simulateTyping("fetch-data --init-request\n[INFO] Starting request to API...", 15);
        
        
    }

}