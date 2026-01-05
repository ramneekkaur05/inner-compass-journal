'use client';

import { useState, useEffect } from 'react';
import type { ChecklistItem as ChecklistItemType } from '@/entities/JournalEntry';

interface ChecklistItemProps {
  item: ChecklistItemType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
  index: number;
}

export default function ChecklistItem({ item, onToggle, onDelete, onUpdate, index }: ChecklistItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(item.text);

  useEffect(() => {
    setText(item.text);
  }, [item.text]);

  const handleBlur = () => {
    setIsEditing(false);
    if (text.trim() && text !== item.text) {
      onUpdate(item.id, text);
    } else if (!text.trim()) {
      setText(item.text);
    }
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3 group p-2 sm:p-3 rounded-lg hover:bg-indigo-200 transition-colors duration-200 w-full min-w-0">
      {/* Item Number */}
      <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full bg-brand-100 text-brand-700 font-semibold text-xs sm:text-sm">
        {index}
      </div>

      <button
        onClick={() => onToggle(item.id)}
        className={`
          w-5 h-5 sm:w-6 sm:h-6 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 transform hover:scale-110
          ${
            item.completed
              ? 'bg-brand-600 border-brand-600 shadow-md'
              : 'border-neutral-300 hover:border-brand-400 hover:bg-brand-50'
          }
        `}
      >
        {item.completed && (
          <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {isEditing ? (
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleBlur();
            if (e.key === 'Escape') {
              setText(item.text);
              setIsEditing(false);
            }
          }}
          className="flex-1 min-w-0 px-2 py-1.5 sm:px-3 sm:py-2 bg-indigo-50 border-2 border-brand-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-300 text-sm sm:text-base text-neutral-900 font-medium"
          autoFocus
        />
      ) : (
        <span
          onClick={() => setIsEditing(true)}
          className={`
            flex-1 min-w-0 cursor-pointer transition-all duration-200 font-medium text-sm sm:text-base break-words
            ${item.completed 
              ? 'line-through text-neutral-400' 
              : 'text-neutral-700 hover:text-neutral-900'
            }
          `}
        >
          {item.text}
        </span>
      )}

      <button
        onClick={() => onDelete(item.id)}
        className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-red-500 transition-all flex-shrink-0 hover:scale-110 transform"
      >
        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
