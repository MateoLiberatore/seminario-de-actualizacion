// calculator-component.js
class CalculatorComponent extends HTMLElement
{
    constructor()
    {
        super();                                //contructor superclase
        this.attachShadow({ mode: 'open' });    //adjunta shadow dom
        this.display = null;                    //pantalla
        // eventos
        this.boundHandleCalculateClick = this.handleCalculateClick.bind(this);
        this.boundHandleClearClick = this.handleClearClick.bind(this);
    }

    connectedCallback()
    {
        var styleLink = document.createElement('link');

        styleLink.setAttribute('rel', 'stylesheet');
        styleLink.setAttribute('href', './styles.css');// hoja de estilos
        this.shadowRoot.appendChild(styleLink);

        var calculatorContainer = document.createElement('div');
        calculatorContainer.classList.add('calculator-container');

        this.display = document.createElement('input');
        this.display.classList.add('input');
        this.display.setAttribute('type', 'text');
        this.display.setAttribute('id', 'display');
        this.display.setAttribute('disabled', 'true');
        calculatorContainer.appendChild(this.display);

        var tableElement = document.createElement('table');
        tableElement.classList.add('table');

        var buttonsConfig = [
            [{ value: '1', id: 'azul' }, { value: '2', id: 'azul' }, { value: '3', id: 'azul' }, { value: '+', id: 'verde' }],
            [{ value: '4', id: 'azul' }, { value: '5', id: 'azul' }, { value: '6', id: 'azul' }, { value: '-', id: 'verde' }],
            [{ value: '7', id: 'azul' }, { value: '8', id: 'azul' }, { value: '9', id: 'azul' }, { value: '*', id: 'verde' }],
            [{ value: '0', id: 'azul' }, { value: '.', id: 'azul' }, { value: '=', id: 'amarillo', action: 'calculate' }, { value: '/' , id: 'verde'}]
        ];

        function processButtonConfig(btnConfig, tr) // procesar filas
        {
            var td = document.createElement('td');
            var button = document.createElement('button');

            button.classList.add('button');
            button.setAttribute('id', btnConfig.id);
            button.innerText = btnConfig.value;

            if (btnConfig.action === 'calculate')
            {
                button.addEventListener('click', this.boundHandleCalculateClick);
            }
            else
            {
                var self = this;
                function handleValueButtonClick() {
                    self.appendValue(btnConfig.value);
                }
                button.addEventListener('click', handleValueButtonClick);
            }
            td.appendChild(button);
            tr.appendChild(td);
        }

        function processRowConfig(rowConfig)
        {
            var tr = document.createElement('tr');
            rowConfig.forEach(function(config) { //Pasa el contexto this para el callback de forEach
                processButtonConfig.call(this, config, tr);
            }, this);
            tableElement.appendChild(tr);
        }

        function forEachRowConfigCallback(config) // Callback para buttonsConfig.forEach
        {
            processRowConfig.call(this, config);
        }

        buttonsConfig.forEach(forEachRowConfigCallback, this); //Pasa el contexto this para el callback de forEach.

        calculatorContainer.appendChild(tableElement);

        var clearButton = document.createElement('button');

        clearButton.classList.add('button');
        clearButton.setAttribute('id', 'rojo');
        clearButton.innerText = 'Clear';
        clearButton.addEventListener('click', this.boundHandleClearClick);
        calculatorContainer.appendChild(clearButton);

        this.shadowRoot.appendChild(calculatorContainer);
        // apariencia general en el DOM
        var hostStyle = document.createElement('style');
        hostStyle.textContent = `
            :host {
                display: block;
                border: 1px solid #ccc;
                padding: 10px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
                width: 230px;
                margin: 20px auto;
            }
        `;
        this.shadowRoot.appendChild(hostStyle);
    }

    disconnectedCallback() {
        // vacío en este caso
    }

    attributeChangedCallback(name, oldValue, newValue) { }  //es un método que se activa cuando cambia un atributo HTML del componente
    static get observedAttributes() { return []; }          //nunca se ejecutará porque el componente no está observando ningún cambio de atributo externo

    handleCalculateClick() {
        this.calculateResult();
    }

    handleClearClick() {
        this.clearDisplay();
    }

    appendValue(value) {
        if (this.display) {
            this.display.value += value;
        }
    }

    calculateResult() {
        if (this.display) {
            try {
                this.display.value = eval(this.display.value);
            } catch (error) {
                this.display.value = 'Error';
            }
        }
    }

    clearDisplay() {
        if (this.display) {
            this.display.value = "";
        }
    }
}

customElements.define('calculator-component', CalculatorComponent);