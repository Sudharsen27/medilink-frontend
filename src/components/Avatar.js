// src/components/Avatar.jsx
import React from "react";

const Avatar = ({ name, src, size = 40 }) => {
  const avatarUrl = src || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=${size}`;

  return (
    <img
      src={avatarUrl}
      alt={name}
      className={`w-[${size}px] h-[${size}px] rounded-full object-cover`}
    />
  );
};

export default Avatar;
