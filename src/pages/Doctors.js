import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DoctorCard from '../components/DoctorCard';
import axios from 'axios';

// Doctors List Page
export function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get('/api/doctors');
        setDoctors(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) return <p>Loading doctors...</p>;

  return (
    <div className="p-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {doctors.length === 0 ? (
        <p>No doctors available.</p>
      ) : (
        doctors.map((doctor) => <DoctorCard key={doctor.id} doctor={doctor} />)
      )}
    </div>
  );
}

// Doctor Profile Page
export function DoctorProfile() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await axios.get(`/api/doctors/${id}`);
        setDoctor(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDoctor();
  }, [id]);

  if (!doctor) return <p>Loading doctor details...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow">
      <h1 className="text-2xl font-bold">{doctor.name}</h1>
      <p className="text-gray-600">{doctor.specialization}</p>
      <p>Experience: {doctor.experience} years</p>
      <p>Rating: {doctor.rating}</p>
      <p className="mt-4">{doctor.bio}</p>
      <p className="mt-2 text-gray-500">{doctor.clinic_address}</p>

      <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Book Appointment
      </button>
    </div>
  );
}
