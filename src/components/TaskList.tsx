import React, { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { TodoList, Task } from '../types';
import TaskItem from './TaskItem';

interface TaskListProps {
  list: TodoList;
  onUpdateList: (list: TodoList) => void;
}

const TaskList: React.FC<TaskListProps> = ({ list, onUpdateList }) => {
  const [newTaskText, setNewTaskText] = useState('');

  const addTask = (text: string) => {
    if (text.trim()) {
      const newTask: Task = {
        id: `task-${Date.now()}`,
        text: text.trim(),
        completed: false,
        order: list.tasks.length,
      };
      onUpdateList({
        ...list,
        tasks: [...list.tasks, newTask],
      });
      setNewTaskText('');
    }
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    onUpdateList({
      ...list,
      tasks: list.tasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      ),
    });
  };

  const deleteTask = (taskId: string) => {
    onUpdateList({
      ...list,
      tasks: list.tasks.filter(task => task.id !== taskId),
    });
  };

  const clearCompleted = () => {
    onUpdateList({
      ...list,
      tasks: list.tasks.filter(task => !task.completed),
    });
  };

  const activeTasks = list.tasks.filter(task => !task.completed);
  const completedTasks = list.tasks.filter(task => task.completed);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask(newTaskText)}
            placeholder="Add a new task..."
            className="flex-1 bg-white bg-opacity-5 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-opacity-50"
            style={{ '--tw-ring-color': list.color } as any}
          />
          <button
            onClick={() => addTask(newTaskText)}
            className="px-4 py-2 rounded-lg transition-all duration-200"
            style={{ backgroundColor: list.color }}
          >
            Add
          </button>
        </div>
      </div>

      <Droppable droppableId="tasks">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-2"
          >
            {activeTasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <TaskItem
                      task={task}
                      listColor={list.color}
                      onUpdate={updateTask}
                      onDelete={deleteTask}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {completedTasks.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-400">Completed</h3>
            <button
              onClick={clearCompleted}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Clear All
            </button>
          </div>
          <div className="space-y-2">
            {completedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                listColor={list.color}
                onUpdate={updateTask}
                onDelete={deleteTask}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
