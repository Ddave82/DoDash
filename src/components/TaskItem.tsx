import React, { useState } from 'react';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  listColor: string;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  listColor,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(task.id, { text: editText.trim() });
    }
    setIsEditing(false);
  };

  return (
    <div
      className={`group flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
        task.completed
          ? 'bg-white bg-opacity-5'
          : 'bg-white bg-opacity-10 hover:bg-opacity-15'
      }`}
    >
      <button
        onClick={() => onUpdate(task.id, { completed: !task.completed })}
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
          task.completed ? 'bg-opacity-100' : 'bg-opacity-0'
        }`}
        style={{ borderColor: listColor, backgroundColor: task.completed ? listColor : 'transparent' }}
      >
        {task.completed && (
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <div className="flex-1">
        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleSave}
            onKeyPress={(e) => e.key === 'Enter' && handleSave()}
            className="w-full bg-transparent border-none outline-none focus:ring-2 focus:ring-opacity-50 rounded px-2"
            style={{ '--tw-ring-color': listColor } as any}
            autoFocus
          />
        ) : (
          <span
            className={`${
              task.completed
                ? 'text-gray-400 line-through'
                : 'text-white'
            }`}
            onClick={() => setIsEditing(true)}
          >
            {task.text}
          </span>
        )}
      </div>

      <button
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-60 hover:opacity-100 transition-opacity duration-200"
      >
        ×
      </button>
    </div>
  );
};

export default TaskItem;
