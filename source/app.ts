/// <reference path='coreFiles.ts' />

module todoApp {
    'use strict';
    var app = angular.module('mainApp', []);
    app.controller('mainCtrl', mainCtrl);
    app.directive('todoBlur', todoBlur);
    app.directive('todoFocus', todoFocus);
    app.directive('todoEscape', todoEscape);
    app.service('appStorage', appStorage)
}
