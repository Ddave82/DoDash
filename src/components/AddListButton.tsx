import React from 'react';
import { TodoList } from '../types';

interface AddListButtonProps {
  onAdd: (list: TodoList) => void;
}

const AddListButton: React.FC<AddListButtonProps> = ({ onAdd }) => {
  const handleAdd = () => {
    const newList: TodoList = {
      id: `list-${Date.now()}`,
      name: 'New List',
      color: '#8B5CF6',
      tasks: [],
    };
    onAdd(newList);
  };

  return (
    <button
      onClick={handleAdd}
      className="px-4 py-2 rounded-full bg-dodash-purple bg-opacity-20 hover:bg-opacity-40 transition-all duration-200"
    >
      + New List
    </button>
  );
};

export default AddListButton;
