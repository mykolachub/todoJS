const _list = document.getElementById('list'); // on
const _notodo = document.getElementById('notodo'); // on
const _notodoCreate = document.getElementById('notodo-create'); // on
const _todo = document.getElementById('todo'); // off
const _todoCreate = document.getElementById('todo-create');
const _sheet = document.getElementById('sheet'); // off
const _sheetName = document.getElementById('sheet-header-name-input'); // off
const _sheetNewTask = document.getElementById('sheet-header-new');
const _sheetApply = document.getElementById('sheet-bar-apply');

class ToDo {
    constructor() {
        this.database = {}; // база данны где хранятся дела
        this.todos = 0; // количество дел
        this.containsTasks = false; // есть ли дела в списке
    }

    renderList() {
        this.todos = Object.keys(this.database).length;
        if (this.todos !== 0) {
            _notodo.classList.remove('notodos--on');
            _todo.classList.add('todos--on');

            // удаляет старые записи. оставляет блок добавления записи
            if (_todo.children.length) {
                const toRemove = [];
                for (const item of _todo.children) {
                    const isTask = !item.classList.contains('todo__new');
                    if (isTask) toRemove.push(item);
                }
                toRemove.forEach(item => _todo.removeChild(item));
            }    

            // перезаписывает записи в списке из базы
            for (const hash in this.database) {
                const task = this.database[hash];
                const list = _todo;
                const item = document.createElement('div');
                item.classList.add('todo__item');
                item.setAttribute('id', hash);
                item.innerHTML = `<div class="todo__content">
                                    <div class="todo__name">
                                        <span>${task.name}</span>
                                    </div>
                                    <div class="todo__desc">
                                        <span>${task.description}</span>
                                    </div>
                                    <div class="todo__count">
                                        <span>${task.amount}</span>
                                    </div>
                                </div>`;

                list.insertBefore(item, _todoCreate);
            }
        } else {
            _notodo.classList.add('notodos--on');
            _todo.classList.remove('todos--on');
        }
    }

    updateData() {
        const hash = Date.now();
        const _id = document.getElementById('sheet-bar-id');
        const _namespace = document.getElementById('sheet-bar-name');
        const _name = document.getElementById('sheet-header-name-input');
        const _description = document.getElementById('sheet-header-disc-input');
        const _tasks = document.querySelectorAll('.sheet__list_item');

        // создаю массив объектов, которые содержат текст и статус "дела"
        const tasksCollection = [];
        _tasks.forEach(_task => {
            tasksCollection.push({
                task: _task.lastChild.value,
                completed: _task.firstChild.control.checked
            });
        });

        // добавляю в базу новый объект с данными
        this.database[hash] = {
            name: _name.value,
            id: Object.keys(this.database).length + 1,
            namespace: _name.value,
            description: _description.value,
            amount: _tasks.length,
            tasks: tasksCollection
        };

        _id.textContent = Object.keys(this.database).length + 1;
        _namespace.textContent = _name.value;
    }

    createTask() {
        const template = `<label class="sheet__list_check">
                            <input class="sheet__list_input" type="checkbox">
                            <span class="sheet__list_box"></span>
                        </label>
                        <textarea placeholder="задание.." name="" rows="1"></textarea>`;
        const ul = document.getElementById('sheet-list');
        const li = document.createElement('li');
        li.classList.add('sheet__list_item');
        li.innerHTML = template;

        ul.appendChild(li);
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
        } else {
            return false;
        }
    }

    clearForms() {
        const forms = document.querySelectorAll('textarea');
        const sheetList = document.getElementById('sheet-list');
        const _namespace = document.getElementById('sheet-bar-name');
        _namespace.textContent = '';
        forms.forEach(form => form.value = '');
        if (sheetList.children.length) {
            const toRemove = [];
            for (const task of sheetList.children) {
                toRemove.push(task);
            }
            toRemove.forEach(item => {
                sheetList.removeChild(item);
            });
        }        
    }

    autosizeForms() {
        const forms = document.querySelectorAll('textarea');
        autosize(forms);
    }
}

// app initialisation
const app = new ToDo();
app.renderList();

// создают новую запись если еще их нет
_notodoCreate.addEventListener('click', () => {
    _sheet.classList.add('sheet--on');
    app.clearForms();
    app.autosizeForms();
})

// создает новое задание в записи
_sheetNewTask.addEventListener('click', () => {
    app.createTask();
    app.autosizeForms();
})

// дублирует название записи для namespace
_sheetName.addEventListener('input', () => {
    const _namespace = document.getElementById('sheet-bar-name');
    const value = _sheetName.value;
    const validLength = 10;
    if (value.length < validLength) _namespace.textContent = _sheetName.value;   
})

// применяет изменения и сохраняет запись
_sheetApply.addEventListener('click', () => {
    const isValidate = app.validateForms();
    if (isValidate) {
        app.updateData();
        app.renderList();
        _sheet.classList.remove('sheet--on');
    } else {
        alert('Запись содержит пустые поля и/или не имеет заданий!');
    }
});

// создает новую запись
_todoCreate.addEventListener('click', () => {
    app.clearForms();
    app.autosizeForms();
    _sheet.classList.add('sheet--on');
});