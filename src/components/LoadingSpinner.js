
import React from 'react';
 // Optional for custom animations or fallback styles

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div className="flex flex-col justify-center items-center p-4 space-y-2">
      <div
        className={`${sizes[size]} border-blue-200 border-t-blue-600 rounded-full animate-spin`}
      ></div>
      {text && <p className="text-gray-600 text-sm font-medium">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
