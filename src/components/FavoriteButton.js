import React, { useState } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import './FavoriteButton.css';

const FavoriteButton = ({ doctor, size = 'medium', showLabel = false }) => {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [animating, setAnimating] = useState(false);

  const favorite = isFavorite(doctor.id);

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setAnimating(true);

    if (favorite) {
      removeFavorite(doctor.id);
    } else {
      addFavorite(doctor);
    }

    // Reset animation after a short delay
    setTimeout(() => setAnimating(false), 600);
  };

  return (
    <button
      onClick={handleToggleFavorite}
      className={`favorite-button ${favorite ? 'favorite-button--active' : ''} ${
        animating ? 'favorite-button--animating' : ''
      } favorite-button--${size}`}
      aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
      title={favorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <span className="favorite-button__icon">
        {favorite ? '❤️' : '🤍'}
      </span>
      
      {showLabel && (
        <span className="favorite-button__label">
          {favorite ? 'Favorited' : 'Add to Favorites'}
        </span>
      )}
    </button>
  );
};

export default FavoriteButton;