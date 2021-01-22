const _list = document.getElementById('list'); // on
const _notodo = document.getElementById('notodo'); // on
const _notodoCreate = document.getElementById('notodo-create'); // on
const _todo = document.getElementById('todo'); // off
const _todoCreate = document.getElementById('todo-create');
const _sheet = document.getElementById('sheet'); // off
const _sheetApply = document.getElementById('sheet-bar-apply');

class ToDo {
    constructor() {
        this.database = new Object(); // база данны где хранятся дела
        this.todos = 0; // количество дел
    }

    renderList() {
        this.todos = Object.keys(this.database).length;
        if (this.todos !== 0) {
            _notodo.classList.remove('notodos--on');
            _todo.classList.add('todos--on');
        } else {
            _notodo.classList.add('notodos--on');
            _todo.classList.remove('todos--on');
        }
    }

    updateData() {
        const hash = Date.now();
        this.database[hash] = hash;
    }
}

// app initialisation
const app = new ToDo();
app.renderList();

_notodoCreate.addEventListener('click', () => {
    console.log('submit');
    _sheet.classList.add('sheet--on');
})

_sheetApply.addEventListener('click', () => {
    console.log('applied');
    app.updateData();
    _sheet.classList.remove('sheet--on');
    app.renderList();
});

_todoCreate.addEventListener('click', () => {
    console.log('creating..');
    _sheet.classList.add('sheet--on');
    app.updateData();

});