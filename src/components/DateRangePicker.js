// src/components/DateRangePicker.js
import React, { useState } from 'react';

const DateRangePicker = ({ onRangeChange }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleStartDateChange = (e) => {
    const date = e.target.value;
    setStartDate(date);
    if (date && endDate) {
      onRangeChange({ start: new Date(date), end: new Date(endDate) });
    }
  };

  const handleEndDateChange = (e) => {
    const date = e.target.value;
    setEndDate(date);
    if (startDate && date) {
      onRangeChange({ start: new Date(startDate), end: new Date(date) });
    }
  };

  const clearDates = () => {
    setStartDate('');
    setEndDate('');
    onRangeChange({ start: null, end: null });
  };

  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-2">Date Range</label>
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-gray-500">to</span>
        <input
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {(startDate || endDate) && (
          <button
            onClick={clearDates}
            className="p-1 text-gray-400 hover:text-gray-600"
            title="Clear dates"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default DateRangePicker;