/// <reference path='../coreFiles.ts' />

module todoApp {
    'use strict';

    export class appStorage implements ITodoStorage {

        STORAGE_ID = 'typescript-todo-app';

        get (): TodoItem[] {
            return JSON.parse(localStorage.getItem(this.STORAGE_ID) || '[]');
        }

        put(todos: TodoItem[]) {
            localStorage.setItem(this.STORAGE_ID, JSON.stringify(todos));
        }
    }
}