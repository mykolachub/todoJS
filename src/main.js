const _list = document.getElementById('list'); // on
const _notodo = document.getElementById('notodo'); // on
const _notodoCreate = document.getElementById('notodo-create'); // on
const _todo = document.getElementById('todo'); // off
const _todoCreate = document.getElementById('todo-create');
const _sheet = document.getElementById('sheet'); // off
const _sheetName = document.getElementById('sheet-header-name-input'); // off
const _sheetNewTask = document.getElementById('sheet-header-new');
const _sheetApply = document.getElementById('sheet-bar-apply');
const _sheetClose = document.getElementById('sheet-bar-close');

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
                item.setAttribute('data-id', hash);
                item.innerHTML = `<div data-id="${hash}" class="todo__content">
                                    <div data-id="${hash}"class="todo__name">
                                        <span data-id="${hash}">${task.name}</span>
                                    </div>
                                    <div data-id="${hash}"class="todo__desc">
                                        <span data-id="${hash}">${task.description}</span>
                                    </div>
                                    <div data-id="${hash}"class="todo__count">
                                        <span data-id="${hash}">${task.amount}</span>
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

        // обновляю localStorage
        localStorage.setItem('todos', JSON.stringify(this.database));
    }

    createTask(task, completed) {
        let template;

        if (task) {
            // если переданы аргументы в функцию, "задания" создаются по определенному шаблону
            if (completed) {
                template = `<label class="sheet__list_check">
                                <input class="sheet__list_input" checked type="checkbox">
                                <span class="sheet__list_box"></span>
                            </label>
                            <textarea placeholder="задание.." name="" rows="1">${task}</textarea>`;    
            } else {
                template = `<label class="sheet__list_check">
                                <input class="sheet__list_input" type="checkbox">
                                <span class="sheet__list_box"></span>
                            </label>
                            <textarea placeholder="задание.." name="" rows="1">${task}</textarea>`;    
            }
        } else {
            // иначе, простой шаблон пустого "задания"
            template = `<label class="sheet__list_check">
                            <input class="sheet__list_input" type="checkbox">
                            <span class="sheet__list_box"></span>
                        </label>
                        <textarea placeholder="задание.." name="" rows="1"></textarea>`;
        }
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

    checkStorage() {
        if (localStorage.getItem('todos') !== null) {
            const raw = localStorage.getItem('todos');
            app.database = JSON.parse(raw);
        }
    }

    renderSheet(hash) {
        const task = this.database[hash];
        const _id = document.getElementById('sheet-bar-id');
        const _namespace = document.getElementById('sheet-bar-name');
        const _name = document.getElementById('sheet-header-name-input');
        const _description = document.getElementById('sheet-header-disc-input');

        _id.textContent = task.id;
        _namespace.textContent = task.namespace;
        _name.value = task.name;
        _description.value = task.description;

        for (const tasksCollection of task.tasks) {
            const task = tasksCollection.task;
            const completed = tasksCollection.completed;
            this.createTask(task, completed);
        }
    }
}

// app initialisation
const app = new ToDo();

app.checkStorage();
app.renderList();

// создают новую запись если еще их нет
_notodoCreate.addEventListener('click', () => {
    _sheet.classList.add('sheet--on');
    _sheet.classList.remove('sheet--off');
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
        _sheet.classList.add('sheet--off');
    } else {
        alert('Запись содержит пустые поля и/или не имеет заданий!');
    }
});

// создает новую запись
_todoCreate.addEventListener('click', () => {
    console.log('creative mode');
    app.clearForms();
    app.autosizeForms();
    _sheet.classList.add('sheet--on');
    _sheet.classList.remove('sheet--off');
});

// закрывает форму без изменений в базе при нажатии на кнопку "закрыть"
_sheetClose.addEventListener('click', () => {
    app.clearForms();
    _sheet.classList.remove('sheet--on');
    _sheet.classList.add('sheet--off');
});

// закрывает форму без изменений в базе при нажатии вне
_sheet.addEventListener('click', (e) => {
    const isOut = e.target.className === "sheet__wrapper";
    if (isOut) {
        app.clearForms();
        _sheet.classList.remove('sheet--on');
        _sheet.classList.add('sheet--off');
    }
})

// изменение существующей записи
document.addEventListener('click', (e) => {
    const target = e.target;

    // слушает только те элементы которые получили data-id т.е. только записи
    if (target.hasAttribute('data-id')) {
        // console.log('editing mode');
        const hash = target.getAttribute('data-id');  
        app.clearForms();
        app.renderSheet(hash);
        app.autosizeForms();
        _sheet.classList.add('sheet--on');
        _sheet.classList.remove('sheet--off');
    }
});