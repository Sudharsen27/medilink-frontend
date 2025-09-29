import React, { useEffect, useState } from 'react';
import DoctorCard from '../components/DoctorCard';
import axios from 'axios';

function Doctors() {
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

export default Doctors;
