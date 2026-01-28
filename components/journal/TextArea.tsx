'use client';

import { useState, useEffect } from 'react';

interface TextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minRows?: number;
  maxRows?: number;
}

export default function TextArea({
  value,
  onChange,
  placeholder,
  minRows = 3,
  maxRows = 10,
}: TextAreaProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
  };

  return (
    <textarea
      value={localValue}
      onChange={handleChange}
      placeholder={placeholder}
      className="textarea-calm"
      style={{ 
        lineHeight: '2',
        scrollbarGutter: 'stable',
        overflowY: 'auto',
        height: '280px',
        minHeight: '280px',
        maxHeight: '450px',
        resize: 'none',
        display: 'block',
        width: '100%',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 15,
        pointerEvents: 'auto'
      }}
    />
  );
}
