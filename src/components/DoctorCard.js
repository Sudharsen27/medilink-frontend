

import React from 'react';
import { useNavigate } from 'react-router-dom';

function DoctorCard({ doctor }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/doctors/${doctor.id}`)}
      className="cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 flex flex-col gap-2"
    >
      {/* Name & Specialization */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{doctor.name}</h2>
        <p className="text-sm text-green-600 dark:text-green-400 font-medium">
          {doctor.specialization}
        </p>
      </div>

      {/* Experience & Rating */}
      <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300 text-sm">
        <span>Experience: {doctor.experience} yrs</span>
        <span>⭐ {doctor.rating}</span>
      </div>

      {/* Bio */}
      <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3">
        {doctor.bio}
      </p>

      {/* Clinic Address */}
      <p className="text-gray-500 dark:text-gray-400 text-xs">{doctor.clinic_address}</p>
    </div>
  );
}

export default DoctorCard;
