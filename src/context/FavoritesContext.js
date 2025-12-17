// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { useToast } from './ToastContext';

// const FavoritesContext = createContext();

// export const useFavorites = () => {
//   const context = useContext(FavoritesContext);
//   if (!context) {
//     throw new Error('useFavorites must be used within a FavoritesProvider');
//   }
//   return context;
// };

// export const FavoritesProvider = ({ children }) => {
//   const [favorites, setFavorites] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { addToast } = useToast();

//   /**
//    * Load favorites from backend (if logged in),
//    * otherwise load from localStorage as fallback
//    */
//   useEffect(() => {
//     const loadFavorites = async () => {
//       try {
//         const token = localStorage.getItem('token');

//         // If user not logged in, load from localStorage
//         if (!token) {
//           const savedFavorites = localStorage.getItem('medilink_favorites');
//           if (savedFavorites) {
//             setFavorites(JSON.parse(savedFavorites));
//           }
//           setLoading(false);
//           return;
//         }

//         // Fetch favorites from backend
//         const response = await fetch('/api/favorites', {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (response.ok) {
//           const data = await response.json();
//           setFavorites(data);
//         } else {
//           console.error('Failed to load favorites from server');
//         }
//       } catch (error) {
//         console.error('Error loading favorites:', error);
//         addToast('Error loading saved favorites', 'error');
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadFavorites();
//   }, [addToast]);

//   /**
//    * Save to localStorage when favorites change (for offline persistence)
//    */
//   useEffect(() => {
//     localStorage.setItem('medilink_favorites', JSON.stringify(favorites));
//   }, [favorites]);

//   /**
//    * Add a doctor to favorites (syncs with backend + local)
//    */
//   const addFavorite = async (doctor) => {
//     try {
//       const token = localStorage.getItem('token');

//       if (!token) {
//         // Offline or guest user → use localStorage
//         if (favorites.some((fav) => fav.id === doctor.id)) {
//           addToast('Doctor is already in your favorites', 'info');
//           return;
//         }

//         const localFavorite = {
//           id: doctor.id,
//           name: doctor.name,
//           specialization: doctor.specialization,
//           hospital: doctor.hospital,
//           image: doctor.image,
//           rating: doctor.rating,
//           experience: doctor.experience,
//           addedAt: new Date().toISOString(),
//         };

//         setFavorites((prev) => [localFavorite, ...prev]);
//         addToast('Doctor added to favorites (local)', 'success');
//         return;
//       }

//       // Authenticated → Sync with backend
//       const response = await fetch(`/api/favorites/${doctor.id}`, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.ok) {
//         const newFavorite = await response.json();
//         const favoriteDoctor = {
//           doctor_id: doctor.id,
//           doctor_name: doctor.name,
//           specialization: doctor.specialization,
//           hospital: doctor.hospital,
//           experience: doctor.experience,
//           rating: doctor.rating,
//           favorited_at: newFavorite.favorite.created_at,
//         };

//         setFavorites((prev) => [favoriteDoctor, ...prev]);
//         addToast('Doctor added to favorites!', 'success');
//       } else {
//         const error = await response.json();
//         addToast(error.message || 'Failed to add favorite', 'error');
//       }
//     } catch (error) {
//       console.error('Error adding favorite:', error);
//       addToast('Failed to add doctor to favorites', 'error');
//     }
//   };

//   /**
//    * Remove a doctor from favorites (syncs with backend + local)
//    */
//   const removeFavorite = async (doctorId) => {
//     try {
//       const token = localStorage.getItem('token');

//       if (!token) {
//         // Offline removal
//         setFavorites((prev) => prev.filter((fav) => fav.id !== doctorId));
//         addToast('Doctor removed from favorites (local)', 'info');
//         return;
//       }

//       const response = await fetch(`/api/favorites/${doctorId}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.ok) {
//         setFavorites((prev) => prev.filter((fav) => fav.doctor_id !== doctorId));
//         addToast('Doctor removed from favorites', 'info');
//       } else {
//         const error = await response.json();
//         addToast(error.message || 'Failed to remove favorite', 'error');
//       }
//     } catch (error) {
//       console.error('Error removing favorite:', error);
//       addToast('Failed to remove doctor from favorites', 'error');
//     }
//   };

//   /**
//    * Check if a doctor is in favorites
//    */
//   const isFavorite = (doctorId) => {
//     return favorites.some(
//       (fav) => fav.id === doctorId || fav.doctor_id === doctorId
//     );
//   };

//   /**
//    * Clear all favorites (with backend and local fallback)
//    */
//   const clearFavorites = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         setFavorites([]);
//         addToast('All local favorites cleared', 'info');
//         return;
//       }

//       // If backend has a bulk delete route, call it here
//       // Otherwise remove each one
//       for (const favorite of favorites) {
//         await removeFavorite(favorite.doctor_id);
//       }
//       addToast('All favorites cleared', 'info');
//     } catch (error) {
//       console.error('Error clearing favorites:', error);
//       addToast('Failed to clear favorites', 'error');
//     }
//   };

//   /**
//    * Get total favorite count
//    */
//   const getFavoriteCount = () => favorites.length;

//   const value = {
//     favorites,
//     loading,
//     addFavorite,
//     removeFavorite,
//     isFavorite,
//     clearFavorites,
//     getFavoriteCount,
//   };

//   return (
//     <FavoritesContext.Provider value={value}>
//       {children}
//     </FavoritesContext.Provider>
//   );
// };


import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import { useToast } from './ToastContext';

const FavoritesContext = createContext(null);

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

  /* ======================================================
     Load favorites (backend if logged in, local fallback)
  ====================================================== */
  const loadFavorites = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');

      // Guest / logged-out user → localStorage
      if (!token || token === 'undefined') {
        const saved = localStorage.getItem('medilink_favorites');
        if (saved) {
          setFavorites(JSON.parse(saved));
        }
        setLoading(false);
        return;
      }

      // Logged-in user → backend
      const response = await fetch('/api/favorites', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }
const data = await response.json();

const normalized = data.map((f) => ({
  id: f.doctor_id,
  name: f.doctor_name,
  specialization: f.specialization,
  hospital: f.hospital,
  rating: f.rating,
  experience: f.experience,
  addedAt: f.favorited_at,
}));

setFavorites(normalized);

    } catch (error) {
      console.error('❌ Favorites load error:', error);
      addToast('Failed to load favorites', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  /* ======================================================
     Persist favorites locally (offline support)
  ====================================================== */
  useEffect(() => {
    localStorage.setItem('medilink_favorites', JSON.stringify(favorites));
  }, [favorites]);

  /* ======================================================
     Add favorite
  ====================================================== */
  const addFavorite = async (doctor) => {
    try {
      const token = localStorage.getItem('token');

      // Guest user → local only
      if (!token || token === 'undefined') {
        if (favorites.some((f) => f.id === doctor.id)) {
          addToast('Doctor already in favorites', 'info');
          return;
        }

        const localFavorite = {
          id: doctor.id,
          name: doctor.name,
          specialization: doctor.specialization,
          hospital: doctor.hospital,
          rating: doctor.rating,
          experience: doctor.experience,
          addedAt: new Date().toISOString(),
        };

        setFavorites((prev) => [localFavorite, ...prev]);
        addToast('Doctor added to favorites', 'success');
        return;
      }

      // Logged-in user → backend
      const response = await fetch(`/api/favorites/${doctor.id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Add favorite failed');
      }

      const { favorite } = await response.json();

      setFavorites((prev) => [
        {
          doctor_id: doctor.id,
          doctor_name: doctor.name,
          specialization: doctor.specialization,
          hospital: doctor.hospital,
          rating: doctor.rating,
          experience: doctor.experience,
          favorited_at: favorite.created_at,
        },
        ...prev,
      ]);

      addToast('Doctor added to favorites', 'success');
    } catch (error) {
      console.error('❌ Add favorite error:', error);
      addToast(error.message || 'Failed to add favorite', 'error');
    }
  };

  /* ======================================================
     Remove favorite
  ====================================================== */
 const removeFavorite = async (doctorIdOrFavorite) => {
  try {
    const token = localStorage.getItem('token');

    // 🔥 Normalize doctorId
    const doctorId =
      typeof doctorIdOrFavorite === 'object'
        ? doctorIdOrFavorite.doctor_id || doctorIdOrFavorite.id
        : doctorIdOrFavorite;

    if (!doctorId) {
      console.error('❌ removeFavorite called with invalid doctorId', doctorIdOrFavorite);
      return;
    }

    // Guest user → local only
    if (!token || token === 'undefined') {
      setFavorites((prev) =>
        prev.filter((f) => f.id !== doctorId)
      );
      addToast('Doctor removed from favorites', 'info');
      return;
    }

    const response = await fetch(`/api/favorites/${doctorId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Remove favorite failed');
    }

    setFavorites((prev) =>
      prev.filter(
        (f) => f.doctor_id !== doctorId && f.id !== doctorId
      )
    );

    addToast('Doctor removed from favorites', 'info');
  } catch (error) {
    console.error('❌ Remove favorite error:', error);
    addToast(error.message || 'Failed to remove favorite', 'error');
  }
};

  /* ======================================================
     Helpers
  ====================================================== */
  const isFavorite = (doctorId) =>
    favorites.some(
      (f) => f.id === doctorId || f.doctor_id === doctorId
    );

  const clearFavorites = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token || token === 'undefined') {
        setFavorites([]);
        addToast('Favorites cleared', 'info');
        return;
      }

     for (const fav of favorites) {
  await removeFavorite(fav);
}


      addToast('All favorites cleared', 'info');
    } catch (error) {
      console.error('❌ Clear favorites error:', error);
      addToast('Failed to clear favorites', 'error');
    }
  };

  const getFavoriteCount = () => favorites.length;

  /* ======================================================
     Provider
  ====================================================== */
  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loading,
        addFavorite,
        removeFavorite,
        isFavorite,
        clearFavorites,
        getFavoriteCount,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
