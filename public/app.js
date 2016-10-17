/// <reference path='../coreFiles.ts' />
var todoApp;
(function (todoApp) {
    'use strict';
    /**
     * The main controller for the app. The controller:
     * - retrieves and persists the model via the todoStorage service
     * - exposes the model to the template and provides event handlers
     */
    var mainCtrl = (function () {
        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        function mainCtrl($scope, $location, todoStorage, filterFilter) {
            var _this = this;
            this.$scope = $scope;
            this.$location = $location;
            this.todoStorage = todoStorage;
            this.filterFilter = filterFilter;
            this.todos = $scope.todos = todoStorage.get();
            $scope.newTodo = '';
            $scope.editedTodo = null;
            // 'vm' stands for 'view model'. We're adding a reference to the controller to the scope
            // for its methods to be accessible from view / HTML
            $scope.vm = this;
            // watching for events/changes in scope, which are caused by view/user input
            // if you subscribe to scope or event with lifetime longer than this controller, make sure you unsubscribe.
            $scope.$watch('todos', function () { return _this.onTodos(); }, true);
            $scope.$watch('location.path()', function (path) { return _this.onPath(path); });
            if ($location.path() === '')
                $location.path('/');
            $scope.location = $location;
        }
        mainCtrl.prototype.onPath = function (path) {
            this.$scope.statusFilter = (path === '/active') ?
                { completed: false } : (path === '/completed') ?
                { completed: true } : {};
        };
        mainCtrl.prototype.onTodos = function () {
            this.$scope.remainingCount = this.filterFilter(this.todos, { completed: false }).length;
            this.$scope.doneCount = this.todos.length - this.$scope.remainingCount;
            this.$scope.allChecked = !this.$scope.remainingCount;
            this.todoStorage.put(this.todos);
        };
        mainCtrl.prototype.addTodo = function () {
            var newTodo = this.$scope.newTodo.trim();
            if (!newTodo.length) {
                return;
            }
            this.todos.push(new todoApp.TodoItem(newTodo, false));
            this.$scope.newTodo = '';
        };
        mainCtrl.prototype.editTodo = function (todoItem) {
            this.$scope.editedTodo = todoItem;
            // Clone the original todo in case editing is cancelled.
            this.$scope.originalTodo = angular.extend({}, todoItem);
        };
        mainCtrl.prototype.revertEdits = function (todoItem) {
            this.todos[this.todos.indexOf(todoItem)] = this.$scope.originalTodo;
            this.$scope.reverted = true;
        };
        mainCtrl.prototype.doneEditing = function (todoItem) {
            this.$scope.editedTodo = null;
            this.$scope.originalTodo = null;
            if (this.$scope.reverted) {
                // Todo edits were reverted, don't save.
                this.$scope.reverted = null;
                return;
            }
            todoItem.title = todoItem.title.trim();
            if (!todoItem.title) {
                this.removeTodo(todoItem);
            }
        };
        mainCtrl.prototype.removeTodo = function (todoItem) {
            this.todos.splice(this.todos.indexOf(todoItem), 1);
        };
        mainCtrl.prototype.clearDoneTodos = function () {
            this.$scope.todos = this.todos = this.todos.filter(function (todoItem) { return !todoItem.completed; });
        };
        mainCtrl.prototype.markAll = function (completed) {
            this.todos.forEach(function (todoItem) { todoItem.completed = completed; });
        };
        return mainCtrl;
    }());
    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    mainCtrl.$inject = [
        '$scope',
        '$location',
        'appStorage',
        'filterFilter'
    ];
    todoApp.mainCtrl = mainCtrl;
})(todoApp || (todoApp = {}));
/// <reference path='../coreFiles.ts' />
/// <reference path='../coreFiles.ts' />
/// <reference path='../coreFiles.ts' />
var todoApp;
(function (todoApp) {
    'use strict';
    /**
     * Directive that executes an expression when the element it is applied to loses focus.
     */
    function todoBlur() {
        return {
            link: function ($scope, element, attributes) {
                element.bind('blur', function () { $scope.$apply(attributes.todoBlur); });
                $scope.$on('$destroy', function () { element.unbind('blur'); });
            }
        };
    }
    todoApp.todoBlur = todoBlur;
})(todoApp || (todoApp = {}));
/// <reference path='../coreFiles.ts' />
var todoApp;
(function (todoApp) {
    'use strict';
    var ESCAPE_KEY = 27;
    /**
     * Directive that cancels editing a todo if the user presses the Esc key.
     */
    function todoEscape() {
        return {
            link: function ($scope, element, attributes) {
                element.bind('keydown', function (event) {
                    if (event.keyCode === ESCAPE_KEY) {
                        $scope.$apply(attributes.todoEscape);
                    }
                });
                $scope.$on('$destroy', function () { element.unbind('keydown'); });
            }
        };
    }
    todoApp.todoEscape = todoEscape;
})(todoApp || (todoApp = {}));
/// <reference path='../coreFiles.ts' />
var todoApp;
(function (todoApp) {
    'use strict';
    /**
     * Directive that places focus on the element it is applied to when the expression it binds to evaluates to true.
     */
    function todoFocus($timeout) {
        return {
            link: function ($scope, element, attributes) {
                $scope.$watch(attributes.todoFocus, function (newval) {
                    if (newval) {
                        $timeout(function () { return element[0].focus(); }, 0, false);
                    }
                });
            }
        };
    }
    todoApp.todoFocus = todoFocus;
    todoFocus.$inject = ['$timeout'];
})(todoApp || (todoApp = {}));
/// <reference path='../coreFiles.ts' />
var todoApp;
(function (todoApp) {
    'use strict';
    var appStorage = (function () {
        function appStorage() {
            this.STORAGE_ID = 'typescript-todo-app';
        }
        appStorage.prototype.get = function () {
            return JSON.parse(localStorage.getItem(this.STORAGE_ID) || '[]');
        };
        appStorage.prototype.put = function (todos) {
            localStorage.setItem(this.STORAGE_ID, JSON.stringify(todos));
        };
        return appStorage;
    }());
    todoApp.appStorage = appStorage;
})(todoApp || (todoApp = {}));
/// <reference path='controllers/mainCtrl.ts' />
/// <reference path='interfaces/scope.ts' />
/// <reference path='interfaces/storage.ts' />
/// <reference path='directives/todoBlur.ts' />
/// <reference path='directives/todoEscape.ts' />
/// <reference path='directives/todoFocus.ts' />
/// <reference path='services/appStorage.ts' />
/// <reference path='./app.ts' />
/// <reference path='coreFiles.ts' />
var todoApp;
(function (todoApp) {
    'use strict';
    var app = angular.module('mainApp', []);
    app.controller('mainCtrl', todoApp.mainCtrl);
    app.directive('todoBlur', todoApp.todoBlur);
    app.directive('todoFocus', todoApp.todoFocus);
    app.directive('todoEscape', todoApp.todoEscape);
    app.service('appStorage', todoApp.appStorage);
})(todoApp || (todoApp = {}));
/// <reference path='../_all.ts' />
var todoApp;
(function (todoApp) {
    'use strict';
    var TodoItem = (function () {
        function TodoItem(title, completed) {
            this.title = title;
            this.completed = completed;
        }
        return TodoItem;
    }());
    todoApp.TodoItem = TodoItem;
})(todoApp || (todoApp = {}));
