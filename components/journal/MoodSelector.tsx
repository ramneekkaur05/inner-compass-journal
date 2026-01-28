'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface MoodSelectorProps {
  value: string | null;
  color: string | null;
  onChange: (mood: string, color: string) => void;
}

const moods = [
  { label: 'Excellent', color: '#8B9D83', emoji: '✨', shortLabel: 'Great' },
  { label: 'Good', color: '#D4A574', emoji: '🌿', shortLabel: 'Good' },
  { label: 'Neutral', color: '#C89F81', emoji: '🍂', shortLabel: 'Okay' },
  { label: 'Challenging', color: '#D97757', emoji: '🌙', shortLabel: 'Low' },
  { label: 'Difficult', color: '#B85C38', emoji: '🌊', shortLabel: 'Struggling' },
];

export default function MoodSelector({ value, color, onChange }: MoodSelectorProps) {
  const [selected, setSelected] = useState<string | null>(value);

  useEffect(() => {
    setSelected(value);
  }, [value]);

  const handleSelect = (mood: string, moodColor: string) => {
    setSelected(mood);
    onChange(mood, moodColor);
  };

  return (
    <div className="flex gap-3 flex-wrap justify-center items-center" style={{ position: 'relative', zIndex: 20 }}>
      {moods.map((mood, index) => (
        <motion.button
          key={mood.label}
          onClick={() => handleSelect(mood.label, mood.color)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
          whileHover={{ 
            scale: 1.15,
            y: -8,
            transition: { duration: 0.15, ease: "easeOut" }
          }}
          whileTap={{ scale: 0.9 }}
          className="flex flex-col items-center gap-2 px-4 py-3 rounded-2xl transition-shadow duration-150"
          style={{
            background: selected === mood.label 
              ? `linear-gradient(135deg, ${mood.color}33, ${mood.color}22)`
              : 'rgba(255, 255, 255, 0.6)',
            border: `2px solid ${selected === mood.label ? mood.color : 'var(--boho-sand)'}`,
            boxShadow: selected === mood.label 
              ? `0 6px 25px ${mood.color}50`
              : '0 2px 10px rgba(139, 157, 131, 0.1)',
            cursor: 'pointer',
            position: 'relative',
            zIndex: 20,
            transform: selected === mood.label ? 'scale(1.05)' : 'scale(1)',
            willChange: 'transform'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = `0 12px 35px ${mood.color}60`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = selected === mood.label 
              ? `0 6px 25px ${mood.color}50`
              : '0 2px 10px rgba(139, 157, 131, 0.1)';
          }}
        >
          <motion.span 
            className="text-2xl"
            animate={{ 
              rotate: selected === mood.label ? [0, -10, 10, -10, 0] : 0 
            }}
            transition={{ duration: 0.5 }}
          >
            {mood.emoji}
          </motion.span>
          <span className="text-sm font-medium handwritten" style={{ 
            color: 'var(--boho-rust)',
            fontSize: '1rem'
          }}>
            {mood.label}
          </span>
          <motion.div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: mood.color }}
            animate={{ 
              scale: selected === mood.label ? [1, 1.2, 1] : 1 
            }}
            transition={{ duration: 0.5, repeat: selected === mood.label ? Infinity : 0, repeatDelay: 2 }}
          />
        </motion.button>
      ))}
    </div>
  );
}
