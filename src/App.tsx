import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import TodoList from './components/TodoList';
import ColorPicker from './components/ColorPicker';

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

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export interface TodoListType {
  id: number;
  name: string;
  color: string;
  todos: Todo[];
}

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    color: #ffffff;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
`;

const AppContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, #fff 0%, #a8a8a8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0;
  }
`;

const ListSelector = styled.div`
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const ListActions = styled.div`
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s ease;
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover ${ListActions} {
    opacity: 1;
  }
`;

const ListButton = styled.button<{ active: boolean; color: string }>`
  flex: 1;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 8px;
  background: ${props => props.active 
    ? `linear-gradient(135deg, ${props.color} 0%, ${adjustColor(props.color, -20)} 100%)`
    : 'linear-gradient(135deg, #333 0%, #2a2a2a 100%)'};
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

const ActionButton = styled.button`
  padding: 0.4rem;
  border: none;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const AddListButton = styled(ListButton)`
  background: linear-gradient(135deg, #444 0%, #333 100%);
  padding: 0.75rem 1.25rem;
`;

const Section = styled.div`
  background: linear-gradient(135deg, #2d2d2d 0%, #252525 100%);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  
  h3 {
    margin: 0 0 1rem;
    background: linear-gradient(135deg, #fff 0%, #a8a8a8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  p {
    color: #888;
    margin: 0;
  }
`;

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
const DEFAULT_COLOR = '#6B46C1';

// Server data helper functions
const saveToServer = async (data: { lists: TodoListType[] }): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to save data');
    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error('Error saving to server:', error);
    return false;
  }
};

const loadFromServer = async () => {
  try {
    const response = await fetch(`${API_URL}/data`);
    if (!response.ok) throw new Error('Failed to load data');
    return await response.json();
  } catch (error) {
    console.error('Error loading from server:', error);
    return { lists: [] };
  }
};

function App() {
  const [lists, setLists] = useState<TodoListType[]>([]);
  const [activeListId, setActiveListId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data from server
  useEffect(() => {
    const loadInitialData = async () => {
      const data = await loadFromServer();
      setLists(data.lists);
      
      // Automatically select the first list if there are any lists
      if (data.lists.length > 0) {
        setActiveListId(data.lists[0].id);
      }
      
      setIsLoading(false);
    };
    loadInitialData();
  }, []);



  // Poll for updates every 5 seconds
  useEffect(() => {
    const pollInterval = setInterval(async () => {
      if (!isLoading) {
        const data = await loadFromServer();
        setLists(data.lists);
      }
    }, 5000);

    return () => clearInterval(pollInterval);
  }, [isLoading]);

  const addList = async () => {
    const name = prompt('Enter list name:');
    if (name) {
      const newList: TodoListType = {
        id: Date.now(),
        name,
        color: DEFAULT_COLOR,
        todos: []
      };
      const newLists = [...lists, newList];
      const saved = await saveToServer({ lists: newLists });
      if (saved) {
        setLists(newLists);
        setActiveListId(newList.id);
      } else {
        alert('Failed to save list. Please try again.');
      }
    }
  };

  const updateTodos = async (updatedTodos: Todo[]) => {
    const newLists = lists.map(list =>
      list.id === activeListId
        ? { ...list, todos: updatedTodos }
        : list
    );
    const saved = await saveToServer({ lists: newLists });
    if (saved) {
      setLists(newLists);
    } else {
      alert('Failed to save changes. Please try again.');
    }
  };

  const activeList = lists.find(list => list.id === activeListId);

  return (
    <ThemeProvider theme={{}}>
      <GlobalStyle />
      <AppContainer>
        <Header>
          <h1>DoDash</h1>
        </Header>
        
        <ListSelector>
          {lists.map(list => (
            <ListItem key={list.id}>
              <ListButton
                active={list.id === activeListId}
                color={list.color}
                onClick={() => setActiveListId(list.id)}
              >
                {list.name}
              </ListButton>
              <ListActions>
                <ColorPicker
                  color={list.color}
                  onChange={async (newColor) => {
                    const newLists = lists.map(l =>
                      l.id === list.id ? { ...l, color: newColor } : l
                    );
                    const saved = await saveToServer({ lists: newLists });
                    if (saved) {
                      setLists(newLists);
                    } else {
                      alert('Failed to change list color. Please try again.');
                    }
                  }}
                />
                <ActionButton
                  onClick={async () => {
                    const newName = prompt('Enter new list name:', list.name);
                    if (newName?.trim()) {
                      const newLists = lists.map(l =>
                        l.id === list.id ? { ...l, name: newName.trim() } : l
                      );
                      const saved = await saveToServer({ lists: newLists });
                      if (saved) {
                        setLists(newLists);
                      } else {
                        alert('Failed to rename list. Please try again.');
                      }
                    }
                  }}
                >
                  ✎
                </ActionButton>
                <ActionButton
                  onClick={async () => {
                    if (window.confirm('Are you sure you want to delete this list?')) {
                      const newLists = lists.filter(l => l.id !== list.id);
                      const saved = await saveToServer({ lists: newLists });
                      if (saved) {
                        setLists(newLists);
                        if (activeListId === list.id) {
                          setActiveListId(newLists.length > 0 ? newLists[0].id : null);
                        }
                      } else {
                        alert('Failed to delete list. Please try again.');
                      }
                    }
                  }}
                >
                  ×
                </ActionButton>
              </ListActions>
            </ListItem>
          ))}
          <AddListButton active={false} color={DEFAULT_COLOR} onClick={addList}>
            + New List
          </AddListButton>
        </ListSelector>

        {lists.length === 0 ? (
          <Section>
            <EmptyState>
              <h3>Welcome to DoDash!</h3>
              <p>Create your first list to get started.</p>
            </EmptyState>
          </Section>
        ) : activeList ? (
          <TodoList
            todos={activeList.todos}
            color={activeList.color}
            onUpdateTodos={updateTodos}
          />
        ) : (
          <Section>
            <EmptyState>
              <h3>Select a List</h3>
              <p>Choose a list from above or create a new one.</p>
            </EmptyState>
          </Section>
        )}
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;
