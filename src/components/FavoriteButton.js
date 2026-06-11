import React, { useState } from "react";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useFavorites } from "../context/FavoritesContext";

const sizeClasses = {
  small: "p-2 rounded-xl",
  medium: "p-2.5 rounded-xl",
  large: "p-3 rounded-xl",
};

const iconSizes = {
  small: "w-4 h-4",
  medium: "w-5 h-5",
  large: "w-6 h-6",
};

const FavoriteButton = ({ doctor, size = "medium", showLabel = false }) => {
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

    setTimeout(() => setAnimating(false), 500);
  };

  return (
    <motion.button
      type="button"
      onClick={handleToggleFavorite}
      whileTap={{ scale: 0.9 }}
      animate={animating ? { scale: [1, 1.25, 1] } : {}}
      className={`
        inline-flex items-center gap-1.5 font-medium transition-all duration-200
        border backdrop-blur-sm shadow-soft
        ${sizeClasses[size] || sizeClasses.medium}
        ${
          favorite
            ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-400"
            : "bg-white/90 border-slate-200 text-slate-500 hover:border-rose-200 hover:text-rose-500 dark:bg-slate-900/90 dark:border-slate-700"
        }
      `}
      aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={favorite}
    >
      <Heart
        className={`${iconSizes[size] || iconSizes.medium} ${favorite ? "fill-current" : ""}`}
        aria-hidden="true"
      />
      {showLabel && (
        <span className="text-xs">{favorite ? "Saved" : "Save"}</span>
      )}
    </motion.button>
  );
};

export default FavoriteButton;
