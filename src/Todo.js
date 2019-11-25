import React from 'react';
import API, { graphqlOperation } from '@aws-amplify/api';
import PubSub from '@aws-amplify/pubsub';

import { createTodo } from './graphql/mutations';
import awsconfig from './aws-exports';
import TodoList from './TodoList';

API.configure(awsconfig);
PubSub.configure(awsconfig);

async function createNewTodo() {
  const todo = { name: 'use AWS AppSync', description: 'Realtime and offline' };
  await API.graphql(graphqlOperation(createTodo, { input: todo }));
}

function Todo() {
  return (
    <React.Fragment>
      <button onClick={createNewTodo}>Create New Todo</button>
      <TodoList />
    </React.Fragment>
  );
}

export default Todo;
