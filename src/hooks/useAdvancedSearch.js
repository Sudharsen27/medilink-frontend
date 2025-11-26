import { useState, useMemo, useCallback } from 'react';

export const useAdvancedSearch = (items, searchConfig) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState(searchConfig.defaultSort || 'name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(searchConfig.itemsPerPage || 10);

  // Apply search and filters
  const filteredItems = useMemo(() => {
    if (!items || !Array.isArray(items)) return [];

    return items.filter(item => {
      // Text search across multiple fields
      const matchesSearch = searchTerm === '' || 
        searchConfig.searchFields.some(field => {
          const value = getNestedValue(item, field);
          return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
        });

      // Apply filters
      const matchesFilters = Object.entries(filters).every(([key, filterValue]) => {
        if (!filterValue || filterValue === 'all') return true;
        
        const itemValue = getNestedValue(item, key);
        
        // Handle different filter types
        if (Array.isArray(filterValue)) {
          return filterValue.includes(itemValue);
        }
        
        if (typeof filterValue === 'object' && filterValue.min !== undefined) {
          return itemValue >= filterValue.min && itemValue <= filterValue.max;
        }
        
        return itemValue === filterValue;
      });

      return matchesSearch && matchesFilters;
    });
  }, [items, searchTerm, filters, searchConfig.searchFields]);

  // Apply sorting
  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const aValue = getNestedValue(a, sortBy);
      const bValue = getNestedValue(b, sortBy);
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredItems, sortBy, sortOrder]);

  // Pagination
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedItems.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedItems, currentPage, itemsPerPage]);

  // Total pages for pagination
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);

  // Helper function to get nested object values
  function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  // Update filter
  const updateFilter = useCallback((filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  }, []);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setFilters({});
    setSearchTerm('');
    setCurrentPage(1);
  }, []);

  // Reset search
  const resetSearch = useCallback(() => {
    setSearchTerm('');
    setFilters({});
    setSortBy(searchConfig.defaultSort || 'name');
    setSortOrder('asc');
    setCurrentPage(1);
  }, [searchConfig.defaultSort]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return searchTerm !== '' || Object.keys(filters).length > 0;
  }, [searchTerm, filters]);

  return {
    // State
    searchTerm,
    filters,
    sortBy,
    sortOrder,
    currentPage,
    itemsPerPage,
    
    // Data
    filteredItems: sortedItems,
    paginatedItems,
    
    // Pagination info
    totalItems: sortedItems.length,
    totalPages,
    hasResults: sortedItems.length > 0,
    
    // Actions
    setSearchTerm,
    updateFilter,
    setSortBy,
    setSortOrder,
    setCurrentPage,
    setItemsPerPage,
    clearAllFilters,
    resetSearch,
    hasActiveFilters
  };
};