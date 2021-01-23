const _list = document.getElementById('list'); // on
const _notodo = document.getElementById('notodo'); // on
const _notodoCreate = document.getElementById('notodo-create'); // on
const _todo = document.getElementById('todo'); // off
const _todoCreate = document.getElementById('todo-create');
const _sheet = document.getElementById('sheet'); // off
const _sheetNewTask = document.getElementById('sheet-header-new');
const _sheetApply = document.getElementById('sheet-bar-apply');

class ToDo {
    constructor() {
        this.database = new Object(); // база данны где хранятся дела
        this.todos = 0; // количество дел
        this.containsTasks = false; // есть ли дела в списке
    }

    renderList() {
        this.todos = Object.keys(this.database).length;
        if (this.todos !== 0) {
            _notodo.classList.remove('notodos--on');
            _todo.classList.add('todos--on');

            const last = Object.keys(app.database)[Object.keys(app.database).length - 1];
            const list = _todo;
            const item = document.createElement('div');
            item.classList.add('todo__item');
            item.innerHTML = `<div class="todo__content">
                                <div class="todo__name">
                                    <span>${app.database[last].name}</span>
                                </div>
                                <div class="todo__desc">
                                    <span>${app.database[last].description}</span>
                                </div>
                                <div class="todo__count">
                                    <span>${app.database[last].amount}</span>
                                </div>
                            </div>`;

            list.insertBefore(item, _todoCreate);

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
        
        const tasksCollection = [];
        _tasks.forEach(_task => {
            tasksCollection.push({
                task: _task.lastChild.value,
                completed: _task.firstChild.control.checked
            });
        });
        
        // добавляю в базу новые данные
        this.database[hash] = {
            name: _name.value,
            description: _description.value,
            amount: _tasks.length,
            tasks: tasksCollection
        };
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
        // проверка только если есть формы дел
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
}

// app initialisation
const app = new ToDo();
app.renderList();

_notodoCreate.addEventListener('click', () => {
    console.log('submit');
    _sheet.classList.add('sheet--on');
})

_sheetNewTask.addEventListener('click', () => {
    app.createTask();
    autosize(document.querySelectorAll('textarea'));
})

_sheetApply.addEventListener('click', () => {
    const isValidate = app.validateForms();
    if (isValidate) {
        console.log('applied');
        app.containsTasks = false;
        app.updateData();
        _sheet.classList.remove('sheet--on');
        app.renderList();   
    } else {
        alert('Заполни все поля');
    }
});

_todoCreate.addEventListener('click', () => {
    console.log('creating..');
    _sheet.classList.add('sheet--on');
});