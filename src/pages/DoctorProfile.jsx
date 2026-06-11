import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiUrl } from "../config/api";

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      const res = await fetch(apiUrl(`/api/doctors/${id}`));
      const data = await res.json();
      setDoctor(data);
    };
    fetchDoctor();
  }, [id]);

  if (!doctor) return <p className="text-center py-10 text-slate-600 dark:text-slate-400">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="health-card rounded-xl shadow-soft dark:shadow-soft-dark p-6 grid md:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="text-center">
          <div className="w-40 h-40 mx-auto bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-4xl">
            {doctor.image ? (
              <img
                src={`/uploads/${doctor.image}`}
                alt={doctor.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              "👨‍⚕️"
            )}
          </div>
          <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-slate-100">{doctor.name}</h2>
          <p className="text-health-600 dark:text-health-400">{doctor.specialization}</p>
          <p className="text-slate-500 dark:text-slate-400">
            ⭐ {doctor.rating} | {doctor.experience}+ yrs
          </p>
        </div>

        {/* MIDDLE */}
        <div className="md:col-span-2">
          <h3 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">About Doctor</h3>
          <p className="text-slate-700 dark:text-slate-300 mb-4">{doctor.bio}</p>

          <p className="font-semibold mb-1 text-slate-900 dark:text-slate-100">Clinic Address</p>
          <p className="text-slate-600 dark:text-slate-400">{doctor.clinic_address}</p>

          <p className="mt-4 text-lg font-bold text-slate-900 dark:text-slate-100">
            Consultation Fee: ₹1000{doctor.fee}
          </p>

          <h4 className="mt-6 font-semibold text-slate-900 dark:text-slate-100">Available Slots</h4>

          <div className="flex flex-wrap gap-2 mt-2">
            {doctor.availability?.length ? (
              doctor.availability.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`px-3 py-1 border rounded transition-colors ${
                    selectedSlot === slot
                      ? "bg-health-600 text-white border-health-600"
                      : "border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-health-400 dark:hover:border-health-500"
                  }`}
                >
                  {slot}
                </button>
              ))
            ) : (
              <p className="text-slate-500 dark:text-slate-400">No slots available</p>
            )}
          </div>

          <button
  onClick={() => navigate(`/appointments/book/${doctor.id}`)}
  className="mt-6 w-full bg-health-600 hover:bg-health-700 dark:bg-health-500 dark:hover:bg-health-600 text-white py-2 rounded-xl font-medium transition-colors"
>
  Book Appointment
</button>

        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
