const inputElement: HTMLInputElement | null = document.getElementById('input') as HTMLInputElement;
const outputElement: HTMLElement | null = document.getElementById('output') as HTMLElement;
const commandHistoryStack1: string[] = [];
const commandHistoryStack2: string[] = [];


interface ICar {
    id: Number
    manufacturer: String
    model: String
    price: Number
    year: Number
}


document.addEventListener('DOMContentLoaded', () => {
    const handleInput = (event: KeyboardEvent) => {
        if (event.key === 'ArrowUp') {
            const el = commandHistoryStack1.pop();
            if (el) {
                commandHistoryStack2.push(el);
                inputElement.value = el;
            }
        }

        if (event.key === 'ArrowDown') {
            const el = commandHistoryStack2.pop();
            if (el) {
                commandHistoryStack1.push(el);
                inputElement.value = el;
            }
        }

        if (event.key === 'Enter') {
            const input = inputElement.value;
            commandHistoryStack1.push(input);
            inputElement.value = '';
            console.log(input);
            switch (input.split(' ')[0]) {
                case './create.sh':
                    return API.create(input);

                case './getAll.sh':
                    return API.getAll();
                case './getById.sh':
                    return API.getById(input.split(' ')[1]);
                case './update.sh':
                    return API.update(input);
                case './delete.sh':
                    return API.delete(Number(input.split(' ')[1]));
                case 'clear':
                    return clear();
                case 'help':
                    return help();
                case 'ls':
                    return ls();
                default:
                    help();
            }
        }
    };

    inputElement.addEventListener('keydown', handleInput);
});

function addOutput(text: string) {
    if (outputElement) {
        outputElement.innerHTML += `<div>[user@localhost ~]$ ${text}</div>`;
    }
}

function noSymbolOutput(text: string) {
    if (outputElement) {
        outputElement.innerHTML += `<div>${text}</div>`;
    }
}

function clear() {
    if (outputElement && inputElement) {
        outputElement.innerHTML = '';
        inputElement.value = '';
    }
}

function help() {
    addOutput('Ограниченное использование терминала.');
    noSymbolOutput('Для вас доступно только выполнение скриптов находязихся в текущей директории.');
    noSymbolOutput('Для просмотра содержимого директории введите "ls"');
}

function ls() {
    addOutput('ls');
    noSymbolOutput(`-rwxr-xr-x  1 user        ${new Date().toLocaleDateString('ru-RU', { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })} create.sh`);
    noSymbolOutput(`-rwxr-xr-x  1 user        ${new Date().toLocaleDateString('ru-RU', { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })} getById.sh`);
    noSymbolOutput(`-rwxr-xr-x  1 user        ${new Date().toLocaleDateString('ru-RU', { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })} update.sh`);
    noSymbolOutput(`-rwxr-xr-x  1 user        ${new Date().toLocaleDateString('ru-RU', { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })} getAll.sh`);
    noSymbolOutput(`-rwxr-xr-x  1 user        ${new Date().toLocaleDateString('ru-RU', { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })} delete.sh`);
}

class APIRequest {
    baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    serializeCreate = (car: string) => ({
        manufacturer: car.split(' ')[1],
        model: car.split(' ')[2],
        year: Number(car.split(' ')[3]),
        price: Number(car.split(' ')[4]),
    });

    serializeUpdate = (car: string) => ({
        id: car.split(' ')[1],
        newPrice: car.split(' ')[2],
    });

    async create(item: string) {
        if (item.split(' ').length < 4) {
            noSymbolOutput('usage: ./create.sh [Manufacturer] [model] [year] [price]');
        } else {
            const response = await this.makeRequest('POST', '/new', this.serializeCreate(item));
            if (response) {
                this.renderCar(response);
            }
        }
    }

    async update(item: string) {
        const response = await this.makeRequest('POST', `/update`, this.serializeUpdate(item));
        if (response) {
            addOutput('update.sh:');
            noSymbolOutput('price updated!');
            this.renderCar(response);
        }
    }

    async delete(id: number) {
        const response: ICar = await this.makeRequest('POST', `/delete`, { id });
        if (response) {
            addOutput('delete.sh:');
            noSymbolOutput('car deleted');
            this.renderCar(response);
        }
    }

    async getAll() {
        const response = await this.makeRequest('GET', '/');
        if (response) {
            response.map((car: ICar) => this.renderCar(car));
        }
    }

    async getById(id: string) {
        const response = await this.makeRequest('GET', '/' + id);
        if (response) {
            this.renderCar(response);
        }
    }

    renderCar(item: Record<string, any>) {
        Object.keys(item).map((key) => noSymbolOutput(`${key}: ${item[key]}`));
    }

    async makeRequest(method: string, endpoint: string, body: any = null) {
        const url = this.baseUrl + endpoint;
        const headers = {
            'Content-Type': 'application/json',
        };

        let options: RequestInit = {
            method,
            headers,
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(url, options);

            if (!response.ok) {
                throw new Error('Request failed');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            noSymbolOutput('Fetching error:' + error);
            return null;
        }
    }
}

const apiUrl = 'http://localhost:3000/cars';
const API = new APIRequest(apiUrl);
