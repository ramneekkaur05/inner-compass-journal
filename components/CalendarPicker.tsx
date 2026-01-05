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
      />

      {/* Calendar Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[95vw] sm:w-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 w-full sm:w-96 max-w-lg">
          {/* Header with Month/Year Selection */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
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
                className="px-3 py-1 rounded-lg border border-neutral-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-300 cursor-pointer hover:border-neutral-300"
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
                className="px-3 py-1 rounded-lg border border-neutral-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-300 cursor-pointer hover:border-neutral-300 max-h-40 overflow-y-auto"
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
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <div key={day} className="text-center text-xs font-semibold text-neutral-600 py-2">
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
                className={`
                  w-10 h-10 rounded-lg transition-all duration-200 font-medium text-sm
                  ${
                    day === null
                      ? 'opacity-0 cursor-default'
                      : isCurrentMonth && day === date.getDate()
                      ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-md'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }
                `}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="flex gap-2 mt-6 pt-4 border-t border-neutral-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors font-medium"
            >
              Close
            </button>
            <button
              onClick={() => {
                const today = new Date();
                onChange(today);
                onClose();
              }}
              className="flex-1 px-4 py-2 bg-brand-100 text-brand-700 hover:bg-brand-200 rounded-lg transition-colors font-medium"
            >
              Today
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
