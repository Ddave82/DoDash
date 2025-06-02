import React, { useState, useEffect } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { AppData, TodoList, Task } from './types';
import ListSelector from './components/ListSelector';
import TaskList from './components/TaskList';
import AddListButton from './components/AddListButton';

function App() {
  const [data, setData] = useState<AppData>({ lists: [] });
  const [activeListId, setActiveListId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      const jsonData = await response.json();
      setData(jsonData);
      setActiveListId(jsonData.lists[0]?.id || '');
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setLoading(false);
    }
  };

  const saveData = async (newData: AppData) => {
    try {
      await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData),
      });
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const activeList = data.lists.find(list => list.id === activeListId);
    if (!activeList) return;

    const newTasks = Array.from(activeList.tasks);
    const [reorderedTask] = newTasks.splice(result.source.index, 1);
    newTasks.splice(result.destination.index, 0, reorderedTask);

    const updatedTasks = newTasks.map((task, index) => ({
      ...task,
      order: index,
    }));

    const newData = {
      ...data,
      lists: data.lists.map(list =>
        list.id === activeListId
          ? { ...list, tasks: updatedTasks }
          : list
      ),
    };

    setData(newData);
    saveData(newData);
  };

  const activeList = data.lists.find(list => list.id === activeListId);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-dodash-purple"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark text-white">
      <header className="py-8 bg-black bg-opacity-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-10">
            <img src="/logo.png" alt="DoDash" className="h-16 transform hover:scale-105 transition-transform duration-300" />
          </div>
          <div className="flex flex-col items-center space-y-4 md:space-y-0 w-full max-w-5xl mx-auto px-4">
            <div className="w-full">
              <div className="flex flex-wrap md:flex-nowrap items-center justify-center gap-3 py-2">
                <ListSelector
                  lists={data.lists}
                  activeListId={activeListId}
                  onSelectList={setActiveListId}
                  onUpdateList={(updatedList: TodoList) => {
                    const newData = {
                      ...data,
                      lists: data.lists.map(list =>
                        list.id === updatedList.id ? updatedList : list
                      ),
                    };
                    setData(newData);
                    saveData(newData);
                  }}
                  onDeleteList={(listId: string) => {
                    const newData = {
                      ...data,
                      lists: data.lists.filter(list => list.id !== listId),
                    };
                    setData(newData);
                    saveData(newData);
                    setActiveListId(newData.lists[0]?.id || '');
                  }}
                  showControls
                />
                <div className="hidden md:block flex-shrink-0">
                  <AddListButton
                    onAdd={(newList: TodoList) => {
                      const newData = {
                        ...data,
                        lists: [...data.lists, newList],
                      };
                      setData(newData);
                      saveData(newData);
                      setActiveListId(newList.id);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3 md:hidden">
              {activeList && (
                <button
                  onClick={() => {
                    const colorPicker = document.querySelector('#desktop-color-picker') as HTMLElement;
                    if (colorPicker) colorPicker.click();
                  }}
                  className="p-2.5 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl bg-opacity-20 hover:bg-opacity-40 flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: activeList.color }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </button>
              )}
              <div className="flex-shrink-0">
                <AddListButton
                  onAdd={(newList: TodoList) => {
                    const newData = {
                      ...data,
                      lists: [...data.lists, newList],
                    };
                    setData(newData);
                    saveData(newData);
                    setActiveListId(newList.id);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {activeList && (
          <DragDropContext onDragEnd={handleDragEnd}>
            <TaskList
              list={activeList}
              onUpdateList={(updatedList) => {
                const newData = {
                  ...data,
                  lists: data.lists.map(list =>
                    list.id === updatedList.id ? updatedList : list
                  ),
                };
                setData(newData);
                saveData(newData);
              }}
            />
          </DragDropContext>
        )}
      </main>
    </div>
  );
}

export default App;
