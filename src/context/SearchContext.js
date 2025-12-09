import React, { createContext, useState, useContext, } from 'react';
import { useToast } from './ToastContext';

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [searchHistory, setSearchHistory] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const { addToast } = useToast();

  // Add search to history
  const addToSearchHistory = (searchData) => {
    const searchEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...searchData
    };

    setSearchHistory(prev => {
      const filtered = prev.filter(item => 
        item.query !== searchData.query || 
        item.type !== searchData.type
      );
      return [searchEntry, ...filtered].slice(0, 50); // Keep last 50 searches
    });

    // Update recent searches (last 10)
    setRecentSearches(prev => {
      const filtered = prev.filter(item => 
        item.query !== searchData.query || 
        item.type !== searchData.type
      );
      return [searchEntry, ...filtered].slice(0, 10);
    });
  };

  // Save search for later
  const saveSearch = (searchData) => {
    const savedSearch = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      ...searchData
    };

    setSavedSearches(prev => {
      const exists = prev.find(item => 
        item.name === searchData.name && 
        item.type === searchData.type
      );
      if (exists) {
        addToast('Search with this name already exists', 'warning');
        return prev;
      }
      return [savedSearch, ...prev];
    });

    addToast('Search saved successfully', 'success');
  };

  // Delete saved search
  const deleteSavedSearch = (searchId) => {
    setSavedSearches(prev => prev.filter(search => search.id !== searchId));
    addToast('Search deleted', 'info');
  };

  // Clear search history
  const clearSearchHistory = () => {
    setSearchHistory([]);
    setRecentSearches([]);
    addToast('Search history cleared', 'info');
  };

  // Get search suggestions based on type and query
  const getSearchSuggestions = (type, query) => {
    const suggestions = {
      doctors: [
        'Cardiologist', 'Dermatologist', 'Pediatrician', 'Orthopedic',
        'Dentist', 'Gynecologist', 'Psychiatrist', 'Neurologist'
      ],
      appointments: [
        'Checkup', 'Consultation', 'Follow-up', 'Emergency',
        'Routine', 'Vaccination', 'Test', 'Surgery'
      ],
      prescriptions: [
        'Antibiotics', 'Pain Relief', 'Vitamins', 'Blood Pressure',
        'Diabetes', 'Allergy', 'Antidepressants', 'Cholesterol'
      ],
      medical_records: [
        'Lab Report', 'X-Ray', 'Blood Test', 'MRI Scan',
        'Prescription', 'Doctor Notes', 'Vaccination', 'Surgery Report'
      ]
    };

    const typeSuggestions = suggestions[type] || [];
    return typeSuggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(query.toLowerCase())
    );
  };

  const value = {
    searchHistory,
    recentSearches,
    savedSearches,
    addToSearchHistory,
    saveSearch,
    deleteSavedSearch,
    clearSearchHistory,
    getSearchSuggestions
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};