import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from './ToastContext';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  /**
   * Load favorites from backend (if logged in),
   * otherwise load from localStorage as fallback
   */
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const token = localStorage.getItem('token');

        // If user not logged in, load from localStorage
        if (!token) {
          const savedFavorites = localStorage.getItem('medilink_favorites');
          if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
          }
          setLoading(false);
          return;
        }

        // Fetch favorites from backend
        const response = await fetch('/api/favorites', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setFavorites(data);
        } else {
          console.error('Failed to load favorites from server');
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
        addToast('Error loading saved favorites', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [addToast]);

  /**
   * Save to localStorage when favorites change (for offline persistence)
   */
  useEffect(() => {
    localStorage.setItem('medilink_favorites', JSON.stringify(favorites));
  }, [favorites]);

  /**
   * Add a doctor to favorites (syncs with backend + local)
   */
  const addFavorite = async (doctor) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        // Offline or guest user → use localStorage
        if (favorites.some((fav) => fav.id === doctor.id)) {
          addToast('Doctor is already in your favorites', 'info');
          return;
        }

        const localFavorite = {
          id: doctor.id,
          name: doctor.name,
          specialization: doctor.specialization,
          hospital: doctor.hospital,
          image: doctor.image,
          rating: doctor.rating,
          experience: doctor.experience,
          addedAt: new Date().toISOString(),
        };

        setFavorites((prev) => [localFavorite, ...prev]);
        addToast('Doctor added to favorites (local)', 'success');
        return;
      }

      // Authenticated → Sync with backend
      const response = await fetch(`/api/favorites/${doctor.id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const newFavorite = await response.json();
        const favoriteDoctor = {
          doctor_id: doctor.id,
          doctor_name: doctor.name,
          specialization: doctor.specialization,
          hospital: doctor.hospital,
          experience: doctor.experience,
          rating: doctor.rating,
          favorited_at: newFavorite.favorite.created_at,
        };

        setFavorites((prev) => [favoriteDoctor, ...prev]);
        addToast('Doctor added to favorites!', 'success');
      } else {
        const error = await response.json();
        addToast(error.message || 'Failed to add favorite', 'error');
      }
    } catch (error) {
      console.error('Error adding favorite:', error);
      addToast('Failed to add doctor to favorites', 'error');
    }
  };

  /**
   * Remove a doctor from favorites (syncs with backend + local)
   */
  const removeFavorite = async (doctorId) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        // Offline removal
        setFavorites((prev) => prev.filter((fav) => fav.id !== doctorId));
        addToast('Doctor removed from favorites (local)', 'info');
        return;
      }

      const response = await fetch(`/api/favorites/${doctorId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setFavorites((prev) => prev.filter((fav) => fav.doctor_id !== doctorId));
        addToast('Doctor removed from favorites', 'info');
      } else {
        const error = await response.json();
        addToast(error.message || 'Failed to remove favorite', 'error');
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      addToast('Failed to remove doctor from favorites', 'error');
    }
  };

  /**
   * Check if a doctor is in favorites
   */
  const isFavorite = (doctorId) => {
    return favorites.some(
      (fav) => fav.id === doctorId || fav.doctor_id === doctorId
    );
  };

  /**
   * Clear all favorites (with backend and local fallback)
   */
  const clearFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setFavorites([]);
        addToast('All local favorites cleared', 'info');
        return;
      }

      // If backend has a bulk delete route, call it here
      // Otherwise remove each one
      for (const favorite of favorites) {
        await removeFavorite(favorite.doctor_id);
      }
      addToast('All favorites cleared', 'info');
    } catch (error) {
      console.error('Error clearing favorites:', error);
      addToast('Failed to clear favorites', 'error');
    }
  };

  /**
   * Get total favorite count
   */
  const getFavoriteCount = () => favorites.length;

  const value = {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    isFavorite,
    clearFavorites,
    getFavoriteCount,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
