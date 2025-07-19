import React, { useState } from 'react';

type Props = {
  onSubmit: (value: string) => Promise<void>;
};

export const Header: React.FC<Props> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    onSubmit(title.trim()).then(() => setTitle(''));
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          autoFocus
          value={title}
          onChange={handleTitleChange}
        />
      </form>
    </header>
  );
};
