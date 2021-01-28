'use strict';

function getElement(attr) {
    if (attr.startsWith('.')) {
        return document.querySelectorAll(attr);
    }
    return document.getElementById(attr);
}

const block = {
    'list': getElement('list'),
    'no-todo': getElement('notodo'),
    'no-todo-create': getElement('notodo-create'),
    'todo': getElement('todo'),
    'todo-create': getElement('todo-create'),
    'sheet': getElement('sheet'),
    'sheet-bar-apply': getElement('sheet-bar-apply'),
    'sheet-bar-close': getElement('sheet-bar-close'),
    'sheet-bar-delete': getElement('sheet-bar-delete'),
    'sheet-input-name': getElement('sheet-header-name-input'),
    'sheet-input-description': getElement('sheet-header-disc-input'),
    'sheet-task-create': getElement('sheet__new_btn'),
    'sheet-task-list': getElement('sheet-list'),
    'modal': getElement('modal'),
    'count': getElement('count'),
}

class ToDo {
    constructor() {
        this.database = {}; // база данны где хранятся дела
        this.todos = 0; // количество дел
        this.containsTasks = false; // есть ли дела в списке
        this.mode = null; // creator or editor
        this.editorHash = undefined; // хеш записи которую редактирую
        this.allCount = 1;
    }

    renderList() {
        this.todos = Object.keys(this.database).length;
        block['count'].textContent = '';
        block['count'].textContent = `Всего записей: ${this.todos}`;
        if (this.todos !== 0) {
            block['no-todo'].classList.remove('notodos--on');
            block['todo'].classList.add('todos--on');

            // удаляет старые записи. оставляет блок добавления записи
            const length = block['todo'].children.length;
            if (length) {
                const toRemove = [];
                for (const item of block['todo'].children) {
                    const isTask = !item.classList.contains('todo__new');
                    if (isTask) toRemove.push(item);
                }
                toRemove.forEach(item => block['todo'].removeChild(item));
            }    

            // добавляет текстовое уточнение для количества дел
            function nameOfAmount(number) {
                const stringed = number.toString();
                const lastDigit = parseInt(stringed[stringed.length - 1]);
                if (lastDigit === 1) {
                    return `${number} дело`;
                } else if (lastDigit >= 2 && lastDigit <= 4) {
                    return `${number} дела`;
                } else if (lastDigit >= 5 && lastDigit <= 9 || lastDigit === 0) {
                    return `${number} дел`;
                }
            }

            // перезаписывает записи в списке из базы
            for (const hash in this.database) {
                const todo = this.database[hash];
                const item = document.createElement('div');
                item.classList.add('todo__item');
                item.setAttribute('data-id', hash);
                item.innerHTML = `<div data-id="${hash}" class="todo__content">
                                    <div data-id="${hash}"class="todo__name">
                                        <span data-id="${hash}">${todo.name}</span>
                                    </div>
                                    <div data-id="${hash}"class="todo__desc">
                                        <span data-id="${hash}">${todo.description}</span>
                                    </div>
                                    <div data-id="${hash}"class="todo__count">
                                        <span data-id="${hash}">${nameOfAmount(todo.amount)}</span>
                                    </div>
                                </div>`;

                block['todo'].insertBefore(item, block['todo-create']);
            }
        } else {
            block['no-todo'].classList.add('notodos--on');
            block['todo'].classList.remove('todos--on');
        }
    }

    updateData() {
        const hash = this.editorHash !== undefined ? this.editorHash: Date.now();
        const tasks = document.querySelectorAll('.sheet__list_item');

        // создаю массив объектов, которые содержат текст и статус "дела"
        const tasksCollection = [];
        tasks.forEach(item => {
            tasksCollection.push({
                task: item.lastChild.value,
                completed: item.firstChild.control.checked
            });
        });

        // добавляю в базу новый объект с данными
        this.database[hash] = {
            name: block['sheet-input-name'].value,
            id: this.allCount,
            namespace: block['sheet-input-name'].value,
            description: block['sheet-input-description'].value,
            amount: tasks.length,
            tasks: tasksCollection,
        };

        // обновляю localStorage
        localStorage.setItem('todos', JSON.stringify(this.database));
        this.editorHash = undefined;
    }

    createTask(task, completed) {
        let template;
        if (task) {
            // если переданы аргументы в функцию, "задания" создаются по определенному шаблону
            if (completed) {
                template = `<label class="sheet__list_check">
                                <input hidden class="sheet__list_input" checked type="checkbox">
                                <span class="sheet__list_box"></span>
                            </label>
                            <textarea placeholder="задание.." name="" rows="1">${task}</textarea>`;    
            } else {
                template = `<label class="sheet__list_check">
                                <input hidden class="sheet__list_input" type="checkbox">
                                <span class="sheet__list_box"></span>
                            </label>
                            <textarea placeholder="задание.." name="" rows="1">${task}</textarea>`;    
            }
        } else {
            // иначе, простой шаблон пустого "задания"
            template = `<label class="sheet__list_check">
                            <input hidden class="sheet__list_input" type="checkbox">
                            <span class="sheet__list_box"></span>
                        </label>
                        <textarea placeholder="задание.." name="" rows="1"></textarea>`;
        }
        const item = document.createElement('li');
        item.classList.add('sheet__list_item');
        item.innerHTML = template;
        block['sheet-task-list'].appendChild(item);
        this.containsTasks = true;
    }

    validateForms() {
        const flags = [];
        const forms = document.querySelectorAll('textarea');

        // проверка только если есть формы "дел"
        if (this.containsTasks) {
            forms.forEach(form => {
                const isEmpty = form.value.trim() !== '';
                flags.push(isEmpty);
            });
            return !flags.includes(false);
        }
        return false;
    }

    clearForms() {
        document.querySelectorAll('textarea').forEach(form => form.value = '');

        const list = block['sheet-task-list'];
        const length = list.children.length; 
        if (length) {
            const toRemove = [];
            for (const task of list.children) {
                toRemove.push(task);
            }
            toRemove.forEach(item => {
                list.removeChild(item);
            });
        }        
    }

    autosizeForms() {
        const forms = document.querySelectorAll('textarea');
        autosize(forms);
    }

    checkStorage() {
        if (localStorage.getItem('todos') !== null) {
            const raw = localStorage.getItem('todos');
            this.database = JSON.parse(raw);
        }
    }

    renderSheet(hash) {
        const todo = this.database[hash];
        const {name, description, tasks} = todo;
        block['sheet-input-name'].value = name;
        block['sheet-input-description'].value = description;

        for (const tasksCollection of tasks) {
            const {task, completed} = tasksCollection;
            this.createTask(task, completed);
        }
    }

    setMode(mode, editorHash) {
        this.mode = mode;
        this.editorHash = editorHash;
    }

    getMode() {
        return {
            mode: this.mode,
            editorHash: this.editorHash
        };
    }

    openSheet() {
        block['sheet'].classList.add('sheet--on');
        block['sheet'].classList.remove('sheet--off');
    }

    closeSheet() {
        block['sheet'].classList.remove('sheet--on');
        block['sheet'].classList.add('sheet--off');
    }

    deleteSheet(hash) {
        delete this.database[hash];
        localStorage.setItem('todos', JSON.stringify(this.database));
    }

    openModal(mode) {
        block['modal'].classList.remove('modal--off');
        block['modal'].classList.add('modal--on');

        const options = {
            'delete': {
                icon: './src/icons/warning.png',
                label: 'Внимание!',
                message: 'Вы точно хотите удалить эту запись? Восстановить данные будет невозможно.',
                accept: 'Удалить',
                decline: 'Отменить',
                color: ' rgba(255, 69, 58, 1)',
            },
            'unfinished': {
                icon: './src/icons/clue.png',
                label: 'Подсказка',
                message: 'Некоторые поля записи пустые. Для продолжения необходимо заполнить их все.',
                accept: 'Хорошо',
                decline: 'Закрыть',
                color: 'rgba(48, 209, 88, 1)',
            }
        }
        const template = `  <div class="modal__warning modal__item">
                                <img class="modal__icon" src="${options[mode].icon}" alt="warning">
                                <span>${options[mode].label}</span>
                            </div>
                            <div class="modal__message modal__item"><span>${options[mode].message}</span></div>
                            <div class="modal__buttons modal__item">
                                <div id="modal-accept" class="modal__accept">
                                    <span style="color:${options[mode].color};">${options[mode].accept}</span>
                                </div>
                                <div id="modal-decline" class="modal__decline">
                                    <span>${options[mode].decline}</span>
                                </div>
                            </div>`;
        const modalContent = document.createElement('div');
        modalContent.classList.add('modal__content');
        modalContent.innerHTML = template;
        block['modal'].appendChild(modalContent);
        return {
            'accept': getElement('modal-accept'),
            'decline': getElement('modal-decline'),
        };
    }

    closeModal() {
        block['modal'].classList.add('modal--off');
        block['modal'].classList.remove('modal--on');
        block['modal'].innerHTML = '';
    }
}

const app = new ToDo();
// проект инициализируется только тогда DOM загрузился
document.addEventListener('DOMContentLoaded', () => {
    app.checkStorage();
    app.renderList();
});

// создают новую запись если еще их нет
block['no-todo-create'].addEventListener('click', () => {
    block['sheet-bar-delete'].classList.add('bar__delete--off');
    app.openSheet();
    app.clearForms();
    app.autosizeForms();
})

// создает новое задание в записи
block['sheet-task-create'].addEventListener('click', () => {
    app.createTask();
    app.autosizeForms();
})

// применяет изменения и сохраняет запись
block['sheet-bar-apply'].addEventListener('click', () => {
    const isValidate = app.validateForms();
    if (isValidate) {
        app.updateData();
        app.renderList();
        app.closeSheet();
    } else {
        const mode = 'unfinished';
        const respond = app.openModal(mode);
        respond['decline'].addEventListener('click', () => {
            app.closeModal();
            return;
        });
        respond['accept'].addEventListener('click', () => {
            app.closeModal();
            return;
        });
    }
});

// создает новую запись
block['todo-create'].addEventListener('click', () => {
    block['sheet-bar-delete'].classList.add('bar__delete--off');
    app.setMode('creator');
    app.clearForms();
    app.autosizeForms();
    app.openSheet();
});

// закрывает форму без изменений в базе при нажатии на кнопку "закрыть"
block['sheet-bar-close'].addEventListener('click', () => {
    app.clearForms();
    app.closeSheet();
});

// закрывает форму без изменений в базе при нажатии вне
block['sheet'].addEventListener('click', (e) => {
    const isOut = e.target.className === "sheet__wrapper";
    if (isOut) {
        app.clearForms();
        app.closeSheet();
    }
})

// изменение существующей записи
document.addEventListener('click', (e) => {
    const target = e.target;

    // слушает только те элементы которые получили data-id т.е. только записи
    if (target.hasAttribute('data-id')) {
        block['sheet-bar-delete'].classList.remove('bar__delete--off');
        const hash = target.getAttribute('data-id');  
        app.setMode('editor', hash);
        app.clearForms();
        app.renderSheet(hash);
        app.autosizeForms();
        app.openSheet();
    }
});

// кнопка удаления записи
block['sheet-bar-delete'].addEventListener('click', () => {
    const mode = 'delete';
    const respond = app.openModal(mode);
    respond['decline'].addEventListener('click', () => {
        app.closeModal();
        return;
    });
    respond['accept'].addEventListener('click', () => {
        const hash = app.getMode().editorHash;
        app.closeModal();
        app.closeSheet();
        app.deleteSheet(hash);
        app.renderList();
        return;
    });
});