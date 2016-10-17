/// <reference path='../coreFiles.ts' />

module todoApp {
	export interface ITodoStorage {
		get (): TodoItem[];
		put(todos: TodoItem[]);
	}
}