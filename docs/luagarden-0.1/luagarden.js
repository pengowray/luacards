class OutputElement {
    constructor(type) {
        this.element = document.createElement('div');
        this.element.className = `output-element ${type}-element`;
        this.element.dataset.type = type;
    }

    append(logArea) {
        logArea.appendChild(this.element);
    }
}

class TextOutput extends OutputElement {
    constructor(message) {
        super('text');
        this.element.innerHTML = marked.parse(message);
    }
}

class ButtonOutput extends OutputElement {
    constructor() {
        super('button');
    }

    addButton(label, callback) {
        const button = document.createElement('button');
        button.textContent = label;
        button.addEventListener('click', (event) => gardenlog.handleButtonClick(event, label, callback));
        this.element.appendChild(button);
    }
}

class CardOutput extends OutputElement {
    constructor() {
        super('card');
        this.element.classList.add('card-container');
    }

    addCard(player) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'player-card';

        let cardContent = `<h3>${player.get('icon') || ''} ${player.get('name')}</h3>`;

        ['role', 'knowledge', 'status', 'votes'].forEach(prop => {
            const value = player.get(prop);
            if (value !== undefined) {
                cardContent += `<p><strong>${prop}:</strong> ${value}</p>`;
            }
        });

        cardDiv.innerHTML = cardContent;
        this.element.appendChild(cardDiv);
    }
}

class GardenLog {
    constructor() {
        this.logArea = document.getElementById('log-area');
        this.currentElement = null;
    }

    print(message) {
        this.currentElement = new TextOutput(message);
        this.currentElement.append(this.logArea);
        this.scrollToBottom();
    }

    createButton(label, callback) {
        if (!(this.currentElement instanceof ButtonOutput)) {
            this.currentElement = new ButtonOutput();
            this.currentElement.append(this.logArea);
        }
        this.currentElement.addButton(label, callback);
        this.scrollToBottom();
    }

    printCard(player) {
        if (!(this.currentElement instanceof CardOutput)) {
            this.currentElement = new CardOutput();
            this.currentElement.append(this.logArea);
        }
        this.currentElement.addCard(player);
        this.scrollToBottom();
    }

    handleButtonClick(event, buttonText, callback) {
        event.preventDefault();
        
        // Remove all buttons
        const buttonElements = this.logArea.querySelectorAll('.button-element');
        buttonElements.forEach(element => element.remove());
        
        // Add the selected button text
        const selectedButtonDiv = new TextOutput(`<em><strong>${buttonText}</strong></em>`);
        selectedButtonDiv.append(this.logArea);
        
        this.scrollToBottom();
        
        // Execute the callback after a short delay
        setTimeout(() => {
            try {
                callback();
            } catch (e) {
                console.error("Error in Lua callback:", e);
                this.print("Error: " + e.message);
            }
        }, 300);
    }

    scrollToBottom() {
        const lastElement = this.logArea.lastElementChild;
        if (lastElement) {
            const scrollPosition = lastElement.offsetTop - this.logArea.offsetTop;
            this.logArea.scrollTop = scrollPosition;
        }
    }

    clear() {
        this.logArea.innerHTML = '';
        this.currentElement = null;
    }
}

const gardenlog = new GardenLog();
window.gardenlog = gardenlog;

export default gardenlog;