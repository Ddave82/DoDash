import React, { useState } from 'react';
import { TodoList } from '../types';
import { HexColorPicker } from 'react-colorful';

interface ListSelectorProps {
  lists: TodoList[];
  activeListId: string;
  onSelectList: (id: string) => void;
  onUpdateList: (list: TodoList) => void;
  onDeleteList: (id: string) => void;
  showControls?: boolean;
}

const ListSelector: React.FC<ListSelectorProps> = ({
  lists,
  activeListId,
  onSelectList,
  onUpdateList,
  onDeleteList,
  showControls = true,
}) => {
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const activeList = lists.find(list => list.id === activeListId);

  const handleEdit = (list: TodoList) => {
    setEditingListId(list.id);
    setEditingName(list.name);
  };

  const handleSave = (list: TodoList) => {
    if (editingName.trim()) {
      onUpdateList({ ...list, name: editingName.trim() });
    }
    setEditingListId(null);
  };

  return (
    <div className="flex flex-wrap md:flex-nowrap items-center justify-center gap-3 w-full">
      {lists.map((list) => (
        <div key={list.id} className="relative flex-shrink-0 flex-grow-0">
          <button
            className={`px-6 py-2.5 rounded-full transition-all duration-200 flex items-center space-x-3 shadow-lg hover:shadow-xl ${
              list.id === activeListId
                ? 'bg-opacity-100 scale-105'
                : 'bg-opacity-20 hover:bg-opacity-40 hover:scale-102'
            }`}
            style={{ backgroundColor: list.color }}
            onClick={() => onSelectList(list.id)}
          >
            {editingListId === list.id ? (
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={() => handleSave(list)}
                onKeyPress={(e) => e.key === 'Enter' && handleSave(list)}
                className="bg-transparent border-none outline-none text-white placeholder-white text-lg font-medium"
                autoFocus
              />
            ) : (
              <>
                <span className="text-lg font-medium whitespace-nowrap">{list.name}</span>
                {showControls && (
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(list);
                      }}
                      className="opacity-60 hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    {lists.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteList(list.id);
                        }}
                        className="opacity-60 hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </button>
        </div>
      ))}

      {showControls && activeList && (
        <div className="relative hidden md:block flex-shrink-0">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="p-2.5 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl bg-opacity-20 hover:bg-opacity-40 flex items-center justify-center"
            style={{ backgroundColor: activeList.color }}
            id="desktop-color-picker"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </button>
          {showColorPicker && (
            <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={(e) => e.target === e.currentTarget && setShowColorPicker(false)}>
              <div className="bg-gray-800 p-4 rounded-xl shadow-2xl border border-gray-700">
                <HexColorPicker
                  color={activeList.color}
                  onChange={(color) => {
                    onUpdateList({ ...activeList, color });
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ListSelector;
