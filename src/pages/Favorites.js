import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import LoadingSpinner from '../components/LoadingSpinner';
import FavoriteButton from '../components/FavoriteButton';
import './Favorites.css';

const Favorites = () => {
  const { favorites, loading, clearFavorites } = useFavorites();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">My Favorite Doctors</h1>
        <LoadingSpinner text="Loading your favorites..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              My Favorite Doctors
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Your saved doctors for quick access
            </p>
          </div>
          
          {favorites.length > 0 && (
            <button
              onClick={clearFavorites}
              className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800 dark:hover:bg-red-900/30 transition-colors"
            >
              Clear All Favorites
            </button>
          )}
        </div>
      </div>

      {/* Favorites Count */}
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-400">
          {favorites.length === 0 
            ? "You haven't added any doctors to favorites yet."
            : `You have ${favorites.length} favorite doctor${favorites.length !== 1 ? 's' : ''}`
          }
        </p>
      </div>

      {/* Favorites Grid */}
      {favorites.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="text-6xl mb-4">🤍</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No favorites yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Start exploring our doctors and add your favorites for quick access to their profiles and easy appointment booking.
          </p>
          <button
            onClick={() => navigate('/doctors')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
          >
            Browse Doctors
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(doctor => (
            <FavoriteDoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      )}
    </div>
  );
};

// Favorite Doctor Card Component
const FavoriteDoctorCard = ({ doctor }) => {
  const navigate = useNavigate();

  const handleBookAppointment = () => {
    navigate(`/doctors/${doctor.id}`);
  };

  const formatAddedDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border-2 border-red-100 dark:border-red-900">
      {/* Doctor Image */}
      <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
        {doctor.image ? (
          <img
            src={`/uploads/${doctor.image}`}
            alt={doctor.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="h-16 w-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        
        {/* Favorite Badge */}
        <div className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-2 shadow-lg">
          ❤️
        </div>
        
        {/* Added Date */}
        {doctor.addedAt && (
          <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            Added {formatAddedDate(doctor.addedAt)}
          </div>
        )}
      </div>

      {/* Doctor Info */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {doctor.name}
        </h3>
        
        <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">
          {doctor.specialization}
        </p>
        
        {doctor.hospital && (
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
            {doctor.hospital}
          </p>
        )}
        
        {doctor.experience && (
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
            {doctor.experience} years of experience
          </p>
        )}
        
        {doctor.rating && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            ⭐ {doctor.rating} Rating
          </p>
        )}

        <div className="flex items-center gap-2">
          <FavoriteButton 
            doctor={doctor} 
            size="medium" 
            showLabel={true}
          />
          <button
            onClick={handleBookAppointment}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Favorites;