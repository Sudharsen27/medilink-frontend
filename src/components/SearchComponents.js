import React, { useState, useRef, useEffect } from 'react';
import { useSearch } from '../context/SearchContext';
import './SearchComponents.css';

// Main Search Bar Component
export const SearchBar = ({ 
  placeholder = "Search...", 
  onSearch, 
  onClear,
  value = "",
  autoFocus = false,
  size = "medium",
  variant = "default"
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const { recentSearches, getSearchSuggestions } = useSearch();

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue.trim());
      setShowSuggestions(false);
    }
  };

  const handleClear = () => {
    setInputValue('');
    onClear?.();
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  const suggestions = getSearchSuggestions('general', inputValue);

  return (
    <div className={`search-bar search-bar--${variant} search-bar--${size}`}>
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className="search-input"
          />
          
          <div className="search-actions">
            {inputValue && (
              <button
                type="button"
                onClick={handleClear}
                className="search-clear-btn"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
            <button
              type="submit"
              className="search-submit-btn"
              aria-label="Search"
            >
              🔍
            </button>
          </div>
        </div>

        {/* Search Suggestions */}
        {showSuggestions && inputValue && (
          <div className="search-suggestions">
            {suggestions.slice(0, 5).map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="suggestion-item"
              >
                <span className="suggestion-icon">💡</span>
                <span className="suggestion-text">{suggestion}</span>
              </button>
            ))}
          </div>
        )}

        {/* Recent Searches */}
        {showSuggestions && !inputValue && recentSearches.length > 0 && (
          <div className="recent-searches">
            <div className="recent-searches-header">
              <span>Recent Searches</span>
            </div>
            {recentSearches.slice(0, 5).map((search) => (
              <button
                key={search.id}
                type="button"
                onClick={() => handleSuggestionClick(search.query)}
                className="suggestion-item"
              >
                <span className="suggestion-icon">🕒</span>
                <span className="suggestion-text">{search.query}</span>
              </button>
            ))}
          </div>
        )}
      </form>
    </div>
  );
};

// Filter Sidebar Component
export const FilterSidebar = ({ 
  filters = [], 
  onFilterChange, 
  activeFilters = {},
  onClearAll 
}) => {
  const hasActiveFilters = Object.values(activeFilters).some(
    value => value && value !== 'all' && (!Array.isArray(value) || value.length > 0)
  );

  return (
    <div className="filter-sidebar">
      <div className="filter-header">
        <h3>Filters</h3>
        {hasActiveFilters && (
          <button onClick={onClearAll} className="clear-all-btn">
            Clear All
          </button>
        )}
      </div>

      <div className="filters-list">
        {filters.map((filter) => (
          <FilterSection
            key={filter.key}
            filter={filter}
            value={activeFilters[filter.key]}
            onChange={(value) => onFilterChange(filter.key, value)}
          />
        ))}
      </div>
    </div>
  );
};

// Individual Filter Section
const FilterSection = ({ filter, value, onChange }) => {
  const renderFilterInput = () => {
    switch (filter.type) {
      case 'select':
        return (
          <select
            value={value || 'all'}
            onChange={(e) => onChange(e.target.value === 'all' ? null : e.target.value)}
            className="filter-select"
          >
            <option value="all">All {filter.label}</option>
            {filter.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'multiselect':
        return (
          <div className="multiselect-filter">
            {filter.options.map(option => (
              <label key={option.value} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={value?.includes(option.value) || false}
                  onChange={(e) => {
                    const newValue = e.target.checked
                      ? [...(value || []), option.value]
                      : (value || []).filter(v => v !== option.value);
                    onChange(newValue.length > 0 ? newValue : null);
                  }}
                />
                <span className="checkmark"></span>
                {option.label}
              </label>
            ))}
          </div>
        );

      case 'range':
        return (
          <div className="range-filter">
            <div className="range-inputs">
              <input
                type="number"
                placeholder="Min"
                value={value?.min || ''}
                onChange={(e) => onChange({
                  ...value,
                  min: e.target.value ? Number(e.target.value) : undefined
                })}
                className="range-input"
              />
              <span className="range-separator">to</span>
              <input
                type="number"
                placeholder="Max"
                value={value?.max || ''}
                onChange={(e) => onChange({
                  ...value,
                  max: e.target.value ? Number(e.target.value) : undefined
                })}
                className="range-input"
              />
            </div>
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value || null)}
            className="filter-date"
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="filter-section">
      <label className="filter-label">{filter.label}</label>
      {renderFilterInput()}
    </div>
  );
};

// Sort Dropdown Component
export const SortDropdown = ({ 
  options = [], 
  value, 
  onChange, 
  order, 
  onOrderChange 
}) => {
  return (
    <div className="sort-dropdown">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="sort-select"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            Sort by {option.label}
          </option>
        ))}
      </select>
      
      <button
        onClick={() => onOrderChange(order === 'asc' ? 'desc' : 'asc')}
        className={`sort-order-btn ${order}`}
        aria-label={`Sort ${order === 'asc' ? 'descending' : 'ascending'}`}
      >
        {order === 'asc' ? '↑' : '↓'}
      </button>
    </div>
  );
};

// Search Results Header Component
export const SearchResultsHeader = ({ 
  totalResults, 
  searchTime, 
  searchQuery,
  onSaveSearch,
  showSaveButton = true 
}) => {
  const { saveSearch } = useSearch();

  const handleSaveSearch = () => {
    if (searchQuery) {
      saveSearch({
        name: `Search: ${searchQuery}`,
        query: searchQuery,
        type: 'general',
        filters: {} // You can include current filters here
      });
    }
  };

  return (
    <div className="search-results-header">
      <div className="results-info">
        <h3>
          {totalResults === 0 ? 'No results found' : `${totalResults} results`}
          {searchQuery && ` for "${searchQuery}"`}
        </h3>
        {searchTime && (
          <span className="search-time">Found in {searchTime}ms</span>
        )}
      </div>
      
      {showSaveButton && searchQuery && totalResults > 0 && (
        <button onClick={handleSaveSearch} className="save-search-btn">
          💾 Save Search
        </button>
      )}
    </div>
  );
};

// Pagination Component
export const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems 
}) => {
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="pagination">
      <div className="pagination-info">
        <span>
          Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
          {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
        </span>
        
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="items-per-page-select"
        >
          <option value={10}>10 per page</option>
          <option value={25}>25 per page</option>
          <option value={50}>50 per page</option>
          <option value={100}>100 per page</option>
        </select>
      </div>

      <div className="pagination-controls">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-btn"
        >
          ← Previous
        </button>

        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
            className={`pagination-btn ${
              page === currentPage ? 'active' : ''
            } ${page === '...' ? 'dots' : ''}`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-btn"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

// Saved Searches Component
export const SavedSearches = ({ onLoadSearch, onDeleteSearch }) => {
  const { savedSearches, deleteSavedSearch } = useSearch();

  const handleDelete = (searchId, e) => {
    e.stopPropagation();
    deleteSavedSearch(searchId);
    onDeleteSearch?.(searchId);
  };

  if (savedSearches.length === 0) {
    return (
      <div className="saved-searches-empty">
        <p>No saved searches yet</p>
        <span>Save your frequent searches for quick access</span>
      </div>
    );
  }

  return (
    <div className="saved-searches">
      <h3>Saved Searches</h3>
      <div className="saved-searches-list">
        {savedSearches.map(search => (
          <div
            key={search.id}
            className="saved-search-item"
            onClick={() => onLoadSearch(search)}
          >
            <div className="saved-search-info">
              <div className="saved-search-name">{search.name}</div>
              <div className="saved-search-query">{search.query}</div>
              <div className="saved-search-date">
                {new Date(search.createdAt).toLocaleDateString()}
              </div>
            </div>
            <button
              onClick={(e) => handleDelete(search.id, e)}
              className="delete-saved-search-btn"
              aria-label="Delete saved search"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};