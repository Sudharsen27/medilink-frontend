import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      const res = await fetch(`/api/doctors/${id}`);
      const data = await res.json();
      setDoctor(data);
    };
    fetchDoctor();
  }, [id]);

  if (!doctor) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow p-6 grid md:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="text-center">
          <div className="w-40 h-40 mx-auto bg-gray-200 rounded-full flex items-center justify-center text-4xl">
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
          <h2 className="mt-4 text-xl font-bold">{doctor.name}</h2>
          <p className="text-blue-600">{doctor.specialization}</p>
          <p className="text-gray-500">
            ⭐ {doctor.rating} | {doctor.experience}+ yrs
          </p>
        </div>

        {/* MIDDLE */}
        <div className="md:col-span-2">
          <h3 className="font-semibold mb-2">About Doctor</h3>
          <p className="text-gray-700 mb-4">{doctor.bio}</p>

          <p className="font-semibold mb-1">Clinic Address</p>
          <p className="text-gray-600">{doctor.clinic_address}</p>

          <p className="mt-4 text-lg font-bold">
            Consultation Fee: ₹1000{doctor.fee}
          </p>

          <h4 className="mt-6 font-semibold">Available Slots</h4>

          <div className="flex flex-wrap gap-2 mt-2">
            {doctor.availability?.length ? (
              doctor.availability.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`px-3 py-1 border rounded ${
                    selectedSlot === slot
                      ? "bg-green-600 text-white"
                      : ""
                  }`}
                >
                  {slot}
                </button>
              ))
            ) : (
              <p className="text-gray-500">No slots available</p>
            )}
          </div>

          <button
  onClick={() => navigate(`/appointments/book/${doctor.id}`)}
  className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
>
  Book Appointment
</button>

        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
