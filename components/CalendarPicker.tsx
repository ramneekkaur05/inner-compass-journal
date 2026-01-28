'use client';

import { useState } from 'react';
import { format, getDaysInMonth, startOfMonth, getDay } from 'date-fns';

interface CalendarPickerProps {
  date: Date;
  onChange: (date: Date) => void;
  onClose: () => void;
}

export default function CalendarPicker({ date, onChange, onClose }: CalendarPickerProps) {
  const [displayDate, setDisplayDate] = useState(date);

  const getDaysArray = () => {
    const firstDay = startOfMonth(displayDate);
    const daysInMonth = getDaysInMonth(displayDate);
    const startingDayOfWeek = getDay(firstDay);
    const daysArray = [];

    // Empty cells for days before the month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      daysArray.push(null);
    }

    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push(i);
    }

    return daysArray;
  };

  const handlePrevMonth = () => {
    setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() + 1));
  };

  const handleDayClick = (day: number) => {
    const newDate = new Date(displayDate.getFullYear(), displayDate.getMonth(), day);
    onChange(newDate);
    onClose();
  };

  const daysArray = getDaysArray();
  const isCurrentMonth =
    displayDate.getMonth() === date.getMonth() &&
    displayDate.getFullYear() === date.getFullYear();

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20"
        onClick={onClose}
        style={{ pointerEvents: 'auto' }}
      />

      {/* Calendar Modal - positioned below the date button */}
      <div className="absolute top-full left-0 right-0 mt-2 z-50 flex justify-center" style={{ pointerEvents: 'none' }}>
        <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 w-full sm:w-96 max-w-lg" style={{ 
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(245, 241, 232, 0.98) 100%)',
          border: '2px solid var(--boho-sand)',
          pointerEvents: 'auto'
        }}>
          {/* Header with Month/Year Selection */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl transition-colors"
              style={{
                background: 'rgba(139, 157, 131, 0.1)',
                color: 'var(--boho-olive)'
              }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Month/Year Selectors */}
            <div className="flex items-center gap-2">
              <select
                value={displayDate.getMonth()}
                onChange={(e) => {
                  const newDate = new Date(displayDate.getFullYear(), parseInt(e.target.value));
                  setDisplayDate(newDate);
                }}
                className="px-3 py-1 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 cursor-pointer"
                style={{
                  border: '2px solid var(--boho-sand)',
                  background: 'rgba(255, 255, 255, 0.9)',
                  color: 'var(--boho-rust)',
                  fontFamily: 'Playfair Display, serif'
                }}
              >
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, idx) => (
                  <option key={month} value={idx}>
                    {month}
                  </option>
                ))}
              </select>

              <select
                value={displayDate.getFullYear()}
                onChange={(e) => {
                  const newDate = new Date(parseInt(e.target.value), displayDate.getMonth());
                  setDisplayDate(newDate);
                }}
                className="px-3 py-1 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 cursor-pointer max-h-40 overflow-y-auto"
                style={{
                  border: '2px solid var(--boho-sand)',
                  background: 'rgba(255, 255, 255, 0.9)',
                  color: 'var(--boho-rust)',
                  fontFamily: 'Playfair Display, serif'
                }}
              >
                {Array.from({ length: 151 }, (_, i) => new Date().getFullYear() - 75 + i).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleNextMonth}
              className="p-2 rounded-xl transition-colors"
              style={{
                background: 'rgba(139, 157, 131, 0.1)',
                color: 'var(--boho-olive)'
              }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <div key={day} className="text-center text-xs font-semibold py-2" style={{ 
                color: 'var(--boho-olive)',
                fontFamily: 'Playfair Display, serif'
              }}>
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {daysArray.map((day, index) => (
              <button
                key={index}
                onClick={() => day !== null && handleDayClick(day)}
                disabled={day === null}
                className="w-10 h-10 rounded-xl transition-all duration-150 font-medium text-sm"
                style={{
                  opacity: day === null ? 0 : 1,
                  cursor: day === null ? 'default' : 'pointer',
                  background: isCurrentMonth && day === date.getDate()
                    ? 'linear-gradient(135deg, var(--boho-terracotta), var(--boho-rust))'
                    : 'rgba(232, 220, 196, 0.3)',
                  color: isCurrentMonth && day === date.getDate() ? 'white' : 'var(--boho-rust)',
                  border: '1px solid var(--boho-sand)',
                  fontFamily: 'Playfair Display, serif'
                }}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="flex gap-2 mt-6 pt-4" style={{ borderTop: '2px solid var(--boho-sand)' }}>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-xl transition-colors font-medium"
              style={{
                background: 'rgba(139, 157, 131, 0.2)',
                color: 'var(--boho-rust)',
                fontFamily: 'Playfair Display, serif'
              }}
            >
              Close
            </button>
            <button
              onClick={() => {
                const today = new Date();
                onChange(today);
                onClose();
              }}
              className="flex-1 px-4 py-2 rounded-xl transition-colors font-medium"
              style={{
                background: 'linear-gradient(135deg, var(--boho-sage), var(--boho-olive))',
                color: 'white',
                fontFamily: 'Playfair Display, serif'
              }}
            >
              Today
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
