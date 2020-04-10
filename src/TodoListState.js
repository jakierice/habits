export class TodoListState {
  constructor() {
    if (this.constructor.name === 'TodoListState') {
      throw new Error(
        `TodoListState is an abstract class. You can't have an instance of it.`,
      );
    }
  }
}

export class Loading extends TodoListState {};

export class LoadingError extends TodoListState {
  constructor(error) {
    super();
    this.error = error;
  }
}

export class Display extends TodoListState {
  constructor(data) {
    super();
    this.data = data;
  }
}
