/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodos, deleteTodos, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/header';
import { TodoList } from './components/todoList';
import { Footer } from './components/footer';
import { Sort } from './types/Sort';
import { ErrorMassage } from './components/errorMassage';
import { ErrorMessage } from './types/ErrorMessage';

export const App: React.FC = () => {
  const [userTodo, setUserTodo] = useState<Todo[]>([]);
  const [errorMassage, setErrorMassage] = useState<ErrorMessage | null>(null);
  const [sortTodo, setsortTodo] = useState<Sort>('all');
  const [clearCompletedDisabled, setClearCompletedDisabled] = useState(true);

  useEffect(() => {
    getTodos()
      .then(setUserTodo)
      .catch(() => {
        setErrorMassage(ErrorMessage.Load);
      });
  }, [userTodo]);

  useEffect(() => {
    const hasCompleted = userTodo.some(todo => todo.completed);

    setClearCompletedDisabled(!hasCompleted);
  }, [userTodo]);

  useEffect(() => {
    if (!errorMassage) {
      return;
    }

    const timer = setTimeout(() => setErrorMassage(null), 3000);

    return () => clearTimeout(timer);
  }, [errorMassage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  function addToDo(title: string) {
    const userId = 3216;
    const completed = false;

    if (!title) {
      setErrorMassage(ErrorMessage.Empty);

      return Promise.resolve();
    }

    return addTodos({ title, userId, completed })
      .then(newToDo => {
        setUserTodo(currentTodos => [...currentTodos, newToDo]);
      })
      .catch(error => {
        setErrorMassage(ErrorMessage.Add);
        throw error;
      });
  }

  function deletePost(postId: number) {
    return deleteTodos(postId)
      .then(() => {
        setUserTodo(currentPosts => {
          return currentPosts.filter(post => post.id !== postId);
        });
      })
      .catch(error => {
        setErrorMassage(ErrorMessage.Delete);
        throw error;
      });
  }

  function clearDelete(allTodo: Todo[]) {
    allTodo.map(todo => {
      if (todo.completed) {
        deleteTodos(todo.id);
      }
    });

    setUserTodo(userTodo);
  }

  const sortedUserTodo = userTodo.filter(todo => {
    if (sortTodo === 'active') {
      return todo.completed === false;
    }

    if (sortTodo === 'completed') {
      return todo.completed === true;
    }

    return true;
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header onSubmit={addToDo} />
        <TodoList sortedUserTodo={sortedUserTodo} onDelete={deletePost} />

        {userTodo.length > 0 && (
          <Footer
            sort={setsortTodo}
            userTodo={userTodo}
            visible={clearCompletedDisabled}
            clearDelete={clearDelete}
          />
        )}
      </div>
      <ErrorMassage errorMassage={errorMassage} massage={setErrorMassage} />
    </div>
  );
};
