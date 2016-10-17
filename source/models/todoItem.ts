/// <reference path='../_all.ts' />

module todoApp {
    'use strict';
    
    export class TodoItem {
        constructor(
            public title: string,
            public completed: boolean
            ) { }
    }
}
