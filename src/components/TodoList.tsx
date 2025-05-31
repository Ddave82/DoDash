import React, { useState } from 'react';
import styled from 'styled-components';
import { Todo } from '../App';

const adjustColor = (color: string, amount: number): string => {
  const clamp = (num: number) => Math.min(255, Math.max(0, num));
  
  // Remove the leading '#' and parse the remaining hex value
  const hex = color.replace('#', '');
  
  // Parse the hex values to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Adjust each component
  const adjustR = clamp(r + amount);
  const adjustG = clamp(g + amount);
  const adjustB = clamp(b + amount);
  
  // Convert back to hex
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  
  return `#${toHex(adjustR)}${toHex(adjustG)}${toHex(adjustB)}`;
};

interface Props {
  todos: Todo[];
  onUpdateTodos: (todos: Todo[]) => void;
  color: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section = styled.div`
  background: linear-gradient(135deg, #2d2d2d 0%, #252525 100%);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const TodoInput = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: linear-gradient(135deg, #353535 0%, #404040 100%);
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: #888;
  }
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.05);
  }
`;

const Button = styled.button<{ color: string }>`
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 8px;
  background: ${props => `linear-gradient(135deg, ${props.color} 0%, ${adjustColor(props.color, -20)} 100%)`};
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
`;

const TodoItem = styled.div<{ completed: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background: linear-gradient(135deg, #333 0%, #2a2a2a 100%);
  margin-bottom: 0.75rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);
  
  &:hover {
    transform: translateX(2px);
    border-color: rgba(255, 255, 255, 0.1);
  }
  
  ${props => props.completed && `
    opacity: 0.6;
    text-decoration: line-through;
    background: linear-gradient(135deg, #2a2a2a 0%, #252525 100%);
  `}
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })<{ color: string }>`
  width: 1.2rem;
  height: 1.2rem;
  cursor: pointer;
  border-radius: 4px;
  margin: 0;
  
  &:checked {
    accent-color: ${props => props.color};
  }
  
  &:hover {
    transform: scale(1.1);
  }
`;

const TodoText = styled.span`
  flex: 1;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #ff6b6b;
  cursor: pointer;
  padding: 0.2rem 0.5rem;
  
  &:hover {
    opacity: 0.8;
  }
`;

const ClearButton = styled(Button)`
  background-color: #ff6b6b;
  margin-top: 1rem;
`;

const TodoList: React.FC<Props> = ({ todos, onUpdateTodos, color }) => {
  const [newTodo, setNewTodo] = useState('');
  
  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      const todo: Todo = {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false
      };
      onUpdateTodos([...todos, todo]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: number) => {
    onUpdateTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    onUpdateTodos(todos.filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    onUpdateTodos(todos.filter(todo => !todo.completed));
  };

  return (
    <Container>
      <Section>
        <form onSubmit={addTodo}>
          <TodoInput>
            <Input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new task..."
            />
            <Button type="submit" color={color}>Add Task</Button>
          </TodoInput>
        </form>

        <div>
          {activeTodos.map(todo => (
            <TodoItem key={todo.id} completed={false}>
              <Checkbox
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                color={color}
              />
              <TodoText>{todo.text}</TodoText>
              <DeleteButton onClick={() => deleteTodo(todo.id)}>×</DeleteButton>
            </TodoItem>
          ))}
        </div>
      </Section>

      {completedTodos.length > 0 && (
        <Section>
          <h3>Completed</h3>
          {completedTodos.map(todo => (
            <TodoItem key={todo.id} completed={true}>
              <Checkbox
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                color={color}
              />
              <TodoText>{todo.text}</TodoText>
              <DeleteButton onClick={() => deleteTodo(todo.id)}>×</DeleteButton>
            </TodoItem>
          ))}
          <ClearButton onClick={clearCompleted} color="#ff6b6b">
            Clear Completed
          </ClearButton>
        </Section>
      )}
    </Container>
  );
};

export default TodoList;
