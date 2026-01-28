'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
    <motion.div 
      className="flex items-center gap-2 sm:gap-3 group p-2 sm:p-3 rounded-xl transition-all duration-300 w-full min-w-0"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ 
        x: 4,
        backgroundColor: 'rgba(139, 157, 131, 0.1)'
      }}
      style={{
        background: 'rgba(255, 255, 255, 0.5)',
        position: 'relative',
        zIndex: 15
      }}
    >
      <motion.div 
        className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full font-semibold text-xs sm:text-sm"
        style={{
          background: 'linear-gradient(135deg, var(--boho-sage), var(--boho-olive))',
          color: 'white',
          fontFamily: 'Playfair Display, serif'
        }}
        whileHover={{ scale: 1.1, rotate: 360 }}
        transition={{ duration: 0.3 }}
      >
        {index}
      </motion.div>

      <motion.button
        onClick={() => onToggle(item.id)}
        className="w-5 h-5 sm:w-6 sm:h-6 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0"
        style={{
          borderColor: item.completed ? 'var(--boho-terracotta)' : 'var(--boho-sand)',
          background: item.completed 
            ? 'linear-gradient(135deg, var(--boho-terracotta), var(--boho-rust))'
            : 'rgba(255, 255, 255, 0.8)',
          cursor: 'pointer',
          position: 'relative',
          zIndex: 20
        }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
      >
        {item.completed && (
          <motion.svg 
            className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </motion.svg>
        )}
      </motion.button>

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
          className="flex-1 min-w-0 px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl focus:outline-none focus:ring-2 text-sm sm:text-base font-medium handwritten"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            border: '2px solid var(--boho-sage)',
            color: 'var(--boho-rust)'
          }}
          autoFocus
        />
      ) : (
        <span
          onClick={() => setIsEditing(true)}
          className="flex-1 min-w-0 cursor-pointer transition-all duration-200 font-medium break-words handwritten"
          style={{
            color: item.completed ? 'var(--boho-clay)' : 'var(--boho-rust)',
            textDecoration: item.completed ? 'line-through' : 'none',
            fontSize: '1.35rem',
            position: 'relative',
            zIndex: 15
          }}
        >
          {item.text}
        </span>
      )}

      <motion.button
        onClick={() => onDelete(item.id)}
        className="opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
        style={{
          color: 'var(--boho-rust)',
          cursor: 'pointer',
          position: 'relative',
          zIndex: 20
        }}
        whileHover={{ scale: 1.2, color: '#B85C38' }}
        whileTap={{ scale: 0.9 }}
      >
        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </motion.button>
    </motion.div>
  );
}
