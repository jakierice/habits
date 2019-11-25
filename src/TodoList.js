import React from 'react';
import API, { graphqlOperation } from '@aws-amplify/api';
import PubSub from '@aws-amplify/pubsub';

import { TodoListState, Loading, Display } from './TodoListState';
import { listTodos } from './graphql/queries';
import { onCreateTodo } from './graphql/subscriptions';
import awsconfig from './aws-exports';

API.configure(awsconfig);
PubSub.configure(awsconfig);

const QUERY = 'QUERY';
const SUBSCRIPTION = 'SUBSCRIPTION';

function TodoItems(props) {
  return (
    <ul>
      {props.todos.map(todo => (
        <li key={todo.id}>{todo.name}</li>
      ))}
    </ul>
  );
}

function mapState(state) {
  switch (state) {
    case 'Loading':
      return () => <div>Loading...</div>;
    case 'LoadingError':
      return () => <div>Error loading the application.</div>;
    case 'Display':
      return ({ data }) => (
        <ul>
          <TodoItems todos={data.todos} />
        </ul>
      );
    default:
      throw new Error('Problem loading Todo List application state.');
  }
}

function renderComponent(state) {
  // check state type and throw Error is type mismatch
  if (!(state instanceof TodoListState)) {
    throw new Error('State must be an instance of TodoListState');
  }

  // return mapState(state.constructor.name);
  const component = mapState(state.constructor.name);
  return component(state);
}

const reducer = (state, action) => {
  switch (action.type) {
    case QUERY:
      return new Display({ ...state, todos: action.todos });
    case SUBSCRIPTION:
      return new Display({
        ...state,
        todos: [...state.data.todos, action.todo],
      });
    default:
      return new Display(state);
  }
};

function TodoList() {
  const [state, dispatch] = React.useReducer(reducer, new Loading());

  React.useEffect(() => {
    async function getData() {
      const todoData = await API.graphql(graphqlOperation(listTodos));
      dispatch({ type: QUERY, todos: todoData.data.listTodos.items });
    }
    getData();
  }, []);

  React.useEffect(() => {
    const subscription = API.graphql(graphqlOperation(onCreateTodo)).subscribe({
      next: eventData => {
        const todo = eventData.value.data.onCreateTodo;
        dispatch({ type: SUBSCRIPTION, todo });
      },
    });

    return () => subscription.unsubscribe();
  }, []);

  return renderComponent(state);
}

export default TodoList;
