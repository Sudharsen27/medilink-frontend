// src/components/FilterBar.js
import React from 'react';

const FilterBar = ({ onFilter, currentFilter }) => {
  const filters = [
    { value: 'all', label: 'All', color: 'gray' },
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'confirmed', label: 'Confirmed', color: 'green' },
    { value: 'cancelled', label: 'Cancelled', color: 'red' }
  ];

  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-2">Status Filter</label>
      <div className="flex flex-wrap gap-2">
        {filters.map(filter => (
          <button
            key={filter.value}
            onClick={() => onFilter(filter.value)}
            className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
              currentFilter === filter.value
                ? `bg-${filter.color}-100 text-${filter.color}-800 border border-${filter.color}-300`
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;