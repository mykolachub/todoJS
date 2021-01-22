/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/*!*****************!*\
  !*** ./main.js ***!
  \*****************/
eval("const _list = document.getElementById('list'); // on\r\nconst _notodo = document.getElementById('notodo'); // on\r\nconst _notodoCreate = document.getElementById('notodo-create'); // on\r\nconst _todo = document.getElementById('todo'); // off\r\nconst _todoCreate = document.getElementById('todo-create');\r\nconst _sheet = document.getElementById('sheet'); // off\r\nconst _sheetApply = document.getElementById('sheet-bar-apply');\r\n\r\nclass ToDo {\r\n    constructor() {\r\n        this.database = new Object(); // база данны где хранятся дела\r\n        this.todos = 0; // количество дел\r\n    }\r\n\r\n    renderList() {\r\n        this.todos = Object.keys(this.database).length;\r\n        if (this.todos !== 0) {\r\n            _notodo.classList.remove('notodos--on');\r\n            _todo.classList.add('todos--on');\r\n        } else {\r\n            _notodo.classList.add('notodos--on');\r\n            _todo.classList.remove('todos--on');\r\n        }\r\n    }\r\n\r\n    updateData() {\r\n        const hash = Date.now();\r\n        this.database[hash] = hash;\r\n    }\r\n}\r\n\r\n// app initialisation\r\nconst app = new ToDo();\r\napp.renderList();\r\n\r\n_notodoCreate.addEventListener('click', () => {\r\n    console.log('submit');\r\n    _sheet.classList.add('sheet--on');\r\n})\r\n\r\n_sheetApply.addEventListener('click', () => {\r\n    console.log('applied');\r\n    app.updateData();\r\n    _sheet.classList.remove('sheet--on');\r\n    app.renderList();\r\n});\r\n\r\n_todoCreate.addEventListener('click', () => {\r\n    console.log('creating..');\r\n    _sheet.classList.add('sheet--on');\r\n    app.updateData();\r\n\r\n});\n\n//# sourceURL=webpack:///./main.js?");
/******/ })()
;