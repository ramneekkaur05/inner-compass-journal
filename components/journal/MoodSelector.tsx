'use client';

import { useState, useEffect } from 'react';

interface MoodSelectorProps {
  value: string | null;
  color: string | null;
  onChange: (mood: string, color: string) => void;
}

const moods = [
  { label: 'Excellent', color: '#10b981', shortLabel: 'Great' },
  { label: 'Good', color: '#0ea5e9', shortLabel: 'Good' },
  { label: 'Neutral', color: '#f59e0b', shortLabel: 'Okay' },
  { label: 'Challenging', color: '#8b5cf6', shortLabel: 'Low' },
  { label: 'Difficult', color: '#dc2626', shortLabel: 'Struggling' },
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
    <div className="flex gap-4 flex-wrap justify-center items-center">
      {moods.map((mood) => (
        <button
          key={mood.label}
          onClick={() => handleSelect(mood.label, mood.color)}
          className={`
            flex flex-col items-center gap-2 px-6 py-3 rounded-lg border-2 transition-all duration-200
            ${
              selected === mood.label
                ? 'border-brand-300 bg-brand-50 scale-105'
                : 'border-violet-200 bg-violet-50 hover:border-violet-300 hover:scale-102'
            }
          `}
        >
          <span className="text-sm font-medium text-neutral-700">{mood.label}</span>
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: mood.color }}
          />
        </button>
      ))}
    </div>
  );
}
