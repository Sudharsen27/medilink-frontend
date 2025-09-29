import React from 'react';
import { useNavigate } from 'react-router-dom';

function DoctorCard({ doctor }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/doctors/${doctor.id}`)}
      className="cursor-pointer border p-4 rounded-lg shadow hover:shadow-lg transition"
    >
      <h2 className="text-xl font-bold">{doctor.name}</h2>
      <p className="text-gray-600">{doctor.specialization}</p>
      <p className="text-gray-500">Experience: {doctor.experience} years</p>
      <p className="text-gray-500">Rating: {doctor.rating}</p>
      <p className="mt-2 text-gray-700">{doctor.bio}</p>
      <p className="mt-1 text-gray-500">{doctor.clinic_address}</p>
    </div>
  );
}

export default DoctorCard;
