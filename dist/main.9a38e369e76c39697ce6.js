/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!*****************!*\
  !*** ./main.js ***!
  \*****************/
eval("\r\n\r\nfunction getElement(attr) {\r\n    if (attr.startsWith('.')) {\r\n        return document.querySelectorAll(attr);\r\n    }\r\n    return document.getElementById(attr);\r\n}\r\n\r\nconst block = {\r\n    'list': getElement('list'),\r\n    'no-todo': getElement('notodo'),\r\n    'no-todo-create': getElement('notodo-create'),\r\n    'todo': getElement('todo'),\r\n    'todo-create': getElement('todo-create'),\r\n    'sheet': getElement('sheet'),\r\n    'sheet-bar-apply': getElement('sheet-bar-apply'),\r\n    'sheet-bar-close': getElement('sheet-bar-close'),\r\n    'sheet-bar-delete': getElement('sheet-bar-delete'),\r\n    'sheet-input-name': getElement('sheet-header-name-input'),\r\n    'sheet-input-description': getElement('sheet-header-disc-input'),\r\n    'sheet-task-create': getElement('sheet__new_btn'),\r\n    'sheet-task-list': getElement('sheet-list'),\r\n    'modal': getElement('modal'),\r\n    'count': getElement('count'),\r\n}\r\n\r\nclass ToDo {\r\n    constructor() {\r\n        this.database = {}; // база данны где хранятся дела\r\n        this.todos = 0; // количество дел\r\n        this.containsTasks = false; // есть ли дела в списке\r\n        this.mode = null; // creator or editor\r\n        this.editorHash = undefined; // хеш записи которую редактирую\r\n        this.allCount = 1;\r\n    }\r\n\r\n    renderList() {\r\n        this.todos = Object.keys(this.database).length;\r\n        block['count'].textContent = '';\r\n        block['count'].textContent = `Всего записей: ${this.todos}`;\r\n        if (this.todos !== 0) {\r\n            block['no-todo'].classList.remove('notodos--on');\r\n            block['todo'].classList.add('todos--on');\r\n\r\n            // удаляет старые записи. оставляет блок добавления записи\r\n            const length = block['todo'].children.length;\r\n            if (length) {\r\n                const toRemove = [];\r\n                for (const item of block['todo'].children) {\r\n                    const isTask = !item.classList.contains('todo__new');\r\n                    if (isTask) toRemove.push(item);\r\n                }\r\n                toRemove.forEach(item => block['todo'].removeChild(item));\r\n            }    \r\n\r\n            // добавляет текстовое уточнение для количества дел\r\n            function nameOfAmount(number) {\r\n                const stringed = number.toString();\r\n                const lastDigit = parseInt(stringed[stringed.length - 1]);\r\n                if ((number >= 5 && number <= 20) || (lastDigit >= 5 && lastDigit <= 9 || lastDigit === 0)) {\r\n                    return `${number} дел`;\r\n                } else if (lastDigit >= 2 && lastDigit <= 4) {\r\n                    return `${number} дела`;\r\n                } else if (lastDigit === 1 && (number + 9) %10 === 0) {\r\n                    return `${number} дело`;\r\n                }\r\n            }\r\n\r\n            // перезаписывает записи в списке из базы\r\n            for (const hash in this.database) {\r\n                const todo = this.database[hash];\r\n                const item = document.createElement('div');\r\n                item.classList.add('todo__item');\r\n                item.setAttribute('data-id', hash);\r\n                item.innerHTML = `<div data-id=\"${hash}\" class=\"todo__content\">\r\n                                    <div data-id=\"${hash}\"class=\"todo__name\">\r\n                                        <span data-id=\"${hash}\">${todo.name}</span>\r\n                                    </div>\r\n                                    <div data-id=\"${hash}\"class=\"todo__desc\">\r\n                                        <span data-id=\"${hash}\">${todo.description}</span>\r\n                                    </div>\r\n                                    <div data-id=\"${hash}\"class=\"todo__count\">\r\n                                        <span data-id=\"${hash}\">${nameOfAmount(todo.amount)}</span>\r\n                                    </div>\r\n                                </div>`;\r\n\r\n                block['todo'].insertBefore(item, block['todo-create']);\r\n            }\r\n        } else {\r\n            block['no-todo'].classList.add('notodos--on');\r\n            block['todo'].classList.remove('todos--on');\r\n        }\r\n    }\r\n\r\n    updateData() {\r\n        const hash = this.editorHash !== undefined ? this.editorHash: Date.now();\r\n        const tasks = document.querySelectorAll('.sheet__list_item');\r\n\r\n        // создаю массив объектов, которые содержат текст и статус \"дела\"\r\n        const tasksCollection = [];\r\n        tasks.forEach(item => {\r\n            tasksCollection.push({\r\n                task: item.lastChild.value,\r\n                completed: item.firstChild.control.checked\r\n            });\r\n        });\r\n\r\n        // добавляю в базу новый объект с данными\r\n        this.database[hash] = {\r\n            name: block['sheet-input-name'].value,\r\n            id: this.allCount,\r\n            namespace: block['sheet-input-name'].value,\r\n            description: block['sheet-input-description'].value,\r\n            amount: tasks.length,\r\n            tasks: tasksCollection,\r\n        };\r\n\r\n        // обновляю localStorage\r\n        localStorage.setItem('todos', JSON.stringify(this.database));\r\n        this.editorHash = undefined;\r\n    }\r\n\r\n    createTask(task, completed) {\r\n        let template;\r\n        if (task) {\r\n            // если переданы аргументы в функцию, \"задания\" создаются по определенному шаблону\r\n            if (completed) {\r\n                template = `<label class=\"sheet__list_check\">\r\n                                <input hidden class=\"sheet__list_input\" checked type=\"checkbox\">\r\n                                <span class=\"sheet__list_box\"></span>\r\n                            </label>\r\n                            <textarea placeholder=\"задание..\" name=\"\" rows=\"1\">${task}</textarea>`;    \r\n            } else {\r\n                template = `<label class=\"sheet__list_check\">\r\n                                <input hidden class=\"sheet__list_input\" type=\"checkbox\">\r\n                                <span class=\"sheet__list_box\"></span>\r\n                            </label>\r\n                            <textarea placeholder=\"задание..\" name=\"\" rows=\"1\">${task}</textarea>`;    \r\n            }\r\n        } else {\r\n            // иначе, простой шаблон пустого \"задания\"\r\n            template = `<label class=\"sheet__list_check\">\r\n                            <input hidden class=\"sheet__list_input\" type=\"checkbox\">\r\n                            <span class=\"sheet__list_box\"></span>\r\n                        </label>\r\n                        <textarea placeholder=\"задание..\" name=\"\" rows=\"1\"></textarea>`;\r\n        }\r\n        const item = document.createElement('li');\r\n        item.classList.add('sheet__list_item');\r\n        item.innerHTML = template;\r\n        block['sheet-task-list'].appendChild(item);\r\n        this.containsTasks = true;\r\n    }\r\n\r\n    validateForms() {\r\n        const flags = [];\r\n        const forms = document.querySelectorAll('textarea');\r\n\r\n        // проверка только если есть формы \"дел\"\r\n        if (this.containsTasks) {\r\n            forms.forEach(form => {\r\n                const isEmpty = form.value.trim() !== '';\r\n                flags.push(isEmpty);\r\n            });\r\n            return !flags.includes(false);\r\n        }\r\n        return false;\r\n    }\r\n\r\n    clearForms() {\r\n        document.querySelectorAll('textarea').forEach(form => form.value = '');\r\n\r\n        const list = block['sheet-task-list'];\r\n        const length = list.children.length; \r\n        if (length) {\r\n            const toRemove = [];\r\n            for (const task of list.children) {\r\n                toRemove.push(task);\r\n            }\r\n            toRemove.forEach(item => {\r\n                list.removeChild(item);\r\n            });\r\n        }        \r\n    }\r\n\r\n    autosizeForms() {\r\n        const forms = document.querySelectorAll('textarea');\r\n        autosize(forms);\r\n    }\r\n\r\n    checkStorage() {\r\n        if (localStorage.getItem('todos') !== null) {\r\n            const raw = localStorage.getItem('todos');\r\n            this.database = JSON.parse(raw);\r\n        }\r\n    }\r\n\r\n    renderSheet(hash) {\r\n        const todo = this.database[hash];\r\n        const {name, description, tasks} = todo;\r\n        block['sheet-input-name'].value = name;\r\n        block['sheet-input-description'].value = description;\r\n\r\n        for (const tasksCollection of tasks) {\r\n            const {task, completed} = tasksCollection;\r\n            this.createTask(task, completed);\r\n        }\r\n    }\r\n\r\n    setMode(mode, editorHash) {\r\n        this.mode = mode;\r\n        this.editorHash = editorHash;\r\n    }\r\n\r\n    getMode() {\r\n        return {\r\n            mode: this.mode,\r\n            editorHash: this.editorHash\r\n        };\r\n    }\r\n\r\n    openSheet() {\r\n        block['sheet'].classList.add('sheet--on');\r\n        block['sheet'].classList.remove('sheet--off');\r\n    }\r\n\r\n    closeSheet() {\r\n        block['sheet'].classList.remove('sheet--on');\r\n        block['sheet'].classList.add('sheet--off');\r\n    }\r\n\r\n    deleteSheet(hash) {\r\n        delete this.database[hash];\r\n        localStorage.setItem('todos', JSON.stringify(this.database));\r\n    }\r\n\r\n    openModal(mode) {\r\n        block['modal'].classList.remove('modal--off');\r\n        block['modal'].classList.add('modal--on');\r\n\r\n        const options = {\r\n            'delete': {\r\n                icon: './src/icons/warning.png',\r\n                label: 'Внимание!',\r\n                message: 'Вы точно хотите удалить эту запись? Восстановить данные будет невозможно.',\r\n                accept: 'Удалить',\r\n                decline: 'Отменить',\r\n                color: ' rgba(255, 69, 58, 1)',\r\n            },\r\n            'unfinished': {\r\n                icon: './src/icons/clue.png',\r\n                label: 'Подсказка',\r\n                message: 'Некоторые поля записи пустые. Для продолжения необходимо заполнить их все.',\r\n                accept: 'Хорошо',\r\n                decline: 'Закрыть',\r\n                color: 'rgba(48, 209, 88, 1)',\r\n            }\r\n        }\r\n        const template = `  <div class=\"modal__warning modal__item\">\r\n                                <img class=\"modal__icon\" src=\"${options[mode].icon}\" alt=\"warning\">\r\n                                <span>${options[mode].label}</span>\r\n                            </div>\r\n                            <div class=\"modal__message modal__item\"><span>${options[mode].message}</span></div>\r\n                            <div class=\"modal__buttons modal__item\">\r\n                                <div id=\"modal-accept\" class=\"modal__accept\">\r\n                                    <span style=\"color:${options[mode].color};\">${options[mode].accept}</span>\r\n                                </div>\r\n                                <div id=\"modal-decline\" class=\"modal__decline\">\r\n                                    <span>${options[mode].decline}</span>\r\n                                </div>\r\n                            </div>`;\r\n        const modalContent = document.createElement('div');\r\n        modalContent.classList.add('modal__content');\r\n        modalContent.innerHTML = template;\r\n        block['modal'].appendChild(modalContent);\r\n        return {\r\n            'accept': getElement('modal-accept'),\r\n            'decline': getElement('modal-decline'),\r\n        };\r\n    }\r\n\r\n    closeModal() {\r\n        block['modal'].classList.add('modal--off');\r\n        block['modal'].classList.remove('modal--on');\r\n        block['modal'].innerHTML = '';\r\n    }\r\n}\r\n\r\nconst app = new ToDo();\r\n// проект инициализируется только тогда DOM загрузился\r\ndocument.addEventListener('DOMContentLoaded', () => {\r\n    app.checkStorage();\r\n    app.renderList();\r\n});\r\n\r\n// создают новую запись если еще их нет\r\nblock['no-todo-create'].addEventListener('click', () => {\r\n    block['sheet-bar-delete'].classList.add('bar__delete--off');\r\n    app.openSheet();\r\n    app.clearForms();\r\n    app.autosizeForms();\r\n})\r\n\r\n// создает новое задание в записи\r\nblock['sheet-task-create'].addEventListener('click', () => {\r\n    app.createTask();\r\n    app.autosizeForms();\r\n})\r\n\r\n// применяет изменения и сохраняет запись\r\nblock['sheet-bar-apply'].addEventListener('click', () => {\r\n    const isValidate = app.validateForms();\r\n    if (isValidate) {\r\n        app.updateData();\r\n        app.renderList();\r\n        app.closeSheet();\r\n    } else {\r\n        const mode = 'unfinished';\r\n        const respond = app.openModal(mode);\r\n        respond['decline'].addEventListener('click', () => {\r\n            app.closeModal();\r\n            return;\r\n        });\r\n        respond['accept'].addEventListener('click', () => {\r\n            app.closeModal();\r\n            return;\r\n        });\r\n    }\r\n});\r\n\r\n// создает новую запись\r\nblock['todo-create'].addEventListener('click', () => {\r\n    block['sheet-bar-delete'].classList.add('bar__delete--off');\r\n    app.setMode('creator');\r\n    app.clearForms();\r\n    app.autosizeForms();\r\n    app.openSheet();\r\n});\r\n\r\n// закрывает форму без изменений в базе при нажатии на кнопку \"закрыть\"\r\nblock['sheet-bar-close'].addEventListener('click', () => {\r\n    app.clearForms();\r\n    app.closeSheet();\r\n});\r\n\r\n// закрывает форму без изменений в базе при нажатии вне\r\nblock['sheet'].addEventListener('click', (e) => {\r\n    const isOut = e.target.className === \"sheet__wrapper\";\r\n    if (isOut) {\r\n        app.clearForms();\r\n        app.closeSheet();\r\n    }\r\n})\r\n\r\n// изменение существующей записи\r\ndocument.addEventListener('click', (e) => {\r\n    const target = e.target;\r\n\r\n    // слушает только те элементы которые получили data-id т.е. только записи\r\n    if (target.hasAttribute('data-id')) {\r\n        block['sheet-bar-delete'].classList.remove('bar__delete--off');\r\n        const hash = target.getAttribute('data-id');  \r\n        app.setMode('editor', hash);\r\n        app.clearForms();\r\n        app.renderSheet(hash);\r\n        app.autosizeForms();\r\n        app.openSheet();\r\n    }\r\n});\r\n\r\n// кнопка удаления записи\r\nblock['sheet-bar-delete'].addEventListener('click', () => {\r\n    const mode = 'delete';\r\n    const respond = app.openModal(mode);\r\n    respond['decline'].addEventListener('click', () => {\r\n        app.closeModal();\r\n        return;\r\n    });\r\n    respond['accept'].addEventListener('click', () => {\r\n        const hash = app.getMode().editorHash;\r\n        app.closeModal();\r\n        app.closeSheet();\r\n        app.deleteSheet(hash);\r\n        app.renderList();\r\n        return;\r\n    });\r\n});\n\n//# sourceURL=webpack:///./main.js?");
/******/ })()
;