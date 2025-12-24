// import React, { useEffect, useState } from "react";
// import { useParams, useLocation, useNavigate } from "react-router-dom";
// import { useToast } from "../context/ToastContext";

// const BookAppointment = () => {
//   const { doctorId } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { addToast } = useToast();

//   const [doctor, setDoctor] = useState(null);
//   const [slot, setSlot] = useState(location.state?.slot || "");
//   const [consultationType, setConsultationType] = useState("video");
//   const [loading, setLoading] = useState(false);

//   // Fetch doctor summary
//   useEffect(() => {
//     const fetchDoctor = async () => {
//       const res = await fetch(`/api/doctors/${doctorId}`);
//       const data = await res.json();
//       setDoctor(data);
//     };
//     fetchDoctor();
//   }, [doctorId]);

//   const handleConfirm = async () => {
//     if (!slot) {
//       addToast("Please select a time slot", "error");
//       return;
//     }

//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       const res = await fetch("/api/appointments", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           doctorId,
//           slot,
//           consultationType,
//         }),
//       });

//       if (!res.ok) throw new Error("Booking failed");

//       addToast("Appointment booked successfully", "success");
//       navigate("/appointments");
//     } catch (err) {
//       addToast("Failed to book appointment", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!doctor) return <p className="text-center py-10">Loading...</p>;

//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
//         <h1 className="text-2xl font-bold mb-4">Confirm Appointment</h1>

//         {/* Doctor Summary */}
//         <div className="border rounded-lg p-4 mb-4">
//           <h2 className="font-semibold">{doctor.name}</h2>
//           <p className="text-blue-600">{doctor.specialization}</p>
//           <p className="text-sm text-gray-500">
//             Fee: ₹{doctor.fee}
//           </p>
//         </div>

//         {/* Slot */}
//         <div className="mb-4">
//           <label className="block font-medium mb-1">Selected Slot</label>
//           <input
//             value={slot}
//             onChange={(e) => setSlot(e.target.value)}
//             placeholder="Select from profile page"
//             className="w-full px-3 py-2 border rounded"
//           />
//         </div>

//         {/* Consultation Type */}
//         <div className="mb-4">
//           <label className="block font-medium mb-2">
//             Consultation Type
//           </label>
//           <div className="flex gap-4">
//             <label className="flex items-center gap-2">
//               <input
//                 type="radio"
//                 value="video"
//                 checked={consultationType === "video"}
//                 onChange={() => setConsultationType("video")}
//               />
//               Video
//             </label>

//             <label className="flex items-center gap-2">
//               <input
//                 type="radio"
//                 value="in-person"
//                 checked={consultationType === "in-person"}
//                 onChange={() => setConsultationType("in-person")}
//               />
//               In-Person
//             </label>
//           </div>
//         </div>

//         {/* Confirm */}
//         <button
//           onClick={handleConfirm}
//           disabled={loading}
//           className={`w-full py-2 rounded text-white ${
//             loading
//               ? "bg-gray-400"
//               : "bg-blue-600 hover:bg-blue-700"
//           }`}
//         >
//           {loading ? "Booking..." : "Confirm Appointment"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default BookAppointment;


// import React, { useEffect, useState } from "react";
// import { useParams, useLocation, useNavigate } from "react-router-dom";
// import { useToast } from "../context/ToastContext";

// const BookAppointment = () => {
//   const { doctorId } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { addToast } = useToast();

//   const [doctor, setDoctor] = useState(null);
//   const [slot, setSlot] = useState(location.state?.slot || "");
//   const [consultationType, setConsultationType] = useState("video");
//   const [loading, setLoading] = useState(false);

//   // Fetch doctor summary
//   useEffect(() => {
//     const fetchDoctor = async () => {
//       try {
//         const res = await fetch(`/api/doctors/${doctorId}`);
//         const data = await res.json();
//         setDoctor(data);
//       } catch (err) {
//         console.error("Failed to fetch doctor", err);
//       }
//     };
//     fetchDoctor();
//   }, [doctorId]);

//   const handleConfirm = async () => {
//     try {
//       setLoading(true);

//       const token = localStorage.getItem("token");
//       const user = JSON.parse(localStorage.getItem("user"));

//       if (!token) {
//         addToast("Please login again", "error");
//         return;
//       }

//       // 🔑 BACKEND EXPECTS THESE EXACT FIELDS
//       const payload = {
//         date: new Date().toISOString().split("T")[0], // today
//         time: slot || "To be confirmed",
//         doctorName: doctor.name,
//         patientName: user?.name || "Patient",
//         patientPhone: user?.phone || "9999999999",
//       };

//       const res = await fetch("/api/appointments", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const err = await res.json();
//         console.error("Backend error:", err);
//         throw new Error(err.error || "Booking failed");
//       }

//       addToast("Appointment booked successfully", "success");
//       navigate("/appointments");
//     } catch (err) {
//       console.error(err);
//       addToast("Failed to book appointment", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!doctor) {
//     return <p className="text-center py-10">Loading...</p>;
//   }

//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
//         <h1 className="text-2xl font-bold mb-4">Confirm Appointment</h1>

//         {/* Doctor Summary */}
//         <div className="border rounded-lg p-4 mb-4">
//           <h2 className="font-semibold">{doctor.name}</h2>
//           <p className="text-blue-600">{doctor.specialization}</p>
//           <p className="text-sm text-gray-500">
//             Fee: ₹{doctor.fee ?? "N/A"}
//           </p>
//         </div>

//         {/* Slot */}
//         <div className="mb-4">
//           <label className="block font-medium mb-1">Selected Slot</label>
//           <input
//             value={slot || "To be confirmed"}
//             onChange={(e) => setSlot(e.target.value)}
//             placeholder="Select from profile page"
//             className="w-full px-3 py-2 border rounded bg-gray-100"
//           />
//           {!slot && (
//             <p className="text-xs text-orange-500 mt-1">
//               Time will be confirmed by the clinic
//             </p>
//           )}
//         </div>

//         {/* Consultation Type (UI ONLY for now) */}
//         <div className="mb-4">
//           <label className="block font-medium mb-2">
//             Consultation Type
//           </label>
//           <div className="flex gap-4">
//             <label className="flex items-center gap-2">
//               <input
//                 type="radio"
//                 checked={consultationType === "video"}
//                 onChange={() => setConsultationType("video")}
//               />
//               Video
//             </label>

//             <label className="flex items-center gap-2">
//               <input
//                 type="radio"
//                 checked={consultationType === "in-person"}
//                 onChange={() => setConsultationType("in-person")}
//               />
//               In-Person
//             </label>
//           </div>
//         </div>

//         {/* Confirm */}
//         <button
//           onClick={handleConfirm}
//           disabled={loading}
//           className={`w-full py-2 rounded text-white ${
//             loading
//               ? "bg-gray-400"
//               : "bg-blue-600 hover:bg-blue-700"
//           }`}
//         >
//           {loading ? "Booking..." : "Confirm Appointment"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default BookAppointment;


// import React, { useEffect, useState } from "react";
// import { useParams, useLocation, useNavigate } from "react-router-dom";
// import { useToast } from "../context/ToastContext";

// const BookAppointment = () => {
//   const { doctorId } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { addToast } = useToast();

//   const [doctor, setDoctor] = useState(null);
//   const [slot, setSlot] = useState(location.state?.slot || "");
//   const [consultationType, setConsultationType] = useState("video");
//   const [loading, setLoading] = useState(false);

//   // 🔹 TEMP SLOT DATA (later from backend)
//   const availableSlots = [
//     "09:00 AM",
//     "10:00 AM",
//     "11:30 AM",
//     "02:00 PM",
//     "04:00 PM",
//     "06:00 PM",
//   ];

//   // Fetch doctor summary
//   useEffect(() => {
//     const fetchDoctor = async () => {
//       try {
//         const res = await fetch(`/api/doctors/${doctorId}`);
//         const data = await res.json();
//         setDoctor(data);
//       } catch (err) {
//         console.error("Failed to fetch doctor", err);
//       }
//     };
//     fetchDoctor();
//   }, [doctorId]);

//   const handleConfirm = async () => {
//     if (!slot) {
//       addToast("Please select a time slot", "error");
//       return;
//     }

//     try {
//       setLoading(true);

//       const token = localStorage.getItem("token");
//       const user = JSON.parse(localStorage.getItem("user"));

//       if (!token) {
//         addToast("Please login again", "error");
//         return;
//       }

//       // ✅ BACKEND-EXPECTED PAYLOAD
//       const payload = {
//         date: new Date().toISOString().split("T")[0],
//         time: slot,
//         doctorName: doctor.name,
//         patientName: user?.name || "Patient",
//         patientPhone: user?.phone || "9999999999",
//       };

//       const res = await fetch("/api/appointments", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const err = await res.json();
//         console.error("Backend error:", err);
//         throw new Error(err.error || "Booking failed");
//       }

//       addToast("Appointment booked successfully", "success");
//       navigate("/appointments");
//     } catch (err) {
//       console.error(err);
//       addToast("Failed to book appointment", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!doctor) {
//     return <p className="text-center py-10">Loading...</p>;
//   }

//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
//         <h1 className="text-2xl font-bold mb-4">Confirm Appointment</h1>

//         {/* Doctor Summary */}
//         <div className="border rounded-lg p-4 mb-6">
//           <h2 className="font-semibold">{doctor.name}</h2>
//           <p className="text-blue-600">{doctor.specialization}</p>
//           <p className="text-sm text-gray-500">
//             Fee: ₹{doctor.fee ?? "1000"}
//           </p>
//         </div>

//         {/* SLOT SELECTION */}
//         <div className="mb-6">
//           <label className="block font-medium mb-2">
//             Select Time Slot
//           </label>

//           <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//             {availableSlots.map((time) => (
//               <button
//                 key={time}
//                 type="button"
//                 onClick={() => setSlot(time)}
//                 className={`px-3 py-2 rounded border text-sm font-medium transition
//                   ${
//                     slot === time
//                       ? "bg-blue-600 text-white border-blue-600"
//                       : "bg-white hover:bg-blue-50 border-gray-300"
//                   }
//                 `}
//               >
//                 {time}
//               </button>
//             ))}
//           </div>

//           {!slot && (
//             <p className="text-xs text-orange-500 mt-2">
//               Please select a time slot
//             </p>
//           )}
//         </div>

//         {/* Consultation Type (UI ONLY) */}
//         <div className="mb-6">
//           <label className="block font-medium mb-2">
//             Consultation Type
//           </label>
//           <div className="flex gap-6">
//             <label className="flex items-center gap-2">
//               <input
//                 type="radio"
//                 checked={consultationType === "video"}
//                 onChange={() => setConsultationType("video")}
//               />
//               Video
//             </label>

//             <label className="flex items-center gap-2">
//               <input
//                 type="radio"
//                 checked={consultationType === "in-person"}
//                 onChange={() => setConsultationType("in-person")}
//               />
//               In-Person
//             </label>
//           </div>
//         </div>

//         {/* Confirm Button */}
//         <button
//           onClick={handleConfirm}
//           disabled={loading}
//           className={`w-full py-2 rounded text-white font-medium ${
//             loading
//               ? "bg-gray-400"
//               : "bg-blue-600 hover:bg-blue-700"
//           }`}
//         >
//           {loading ? "Booking..." : "Confirm Appointment"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default BookAppointment;


import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [doctor, setDoctor] = useState(null);
  const [slot, setSlot] = useState("");
  const [consultationType, setConsultationType] = useState("video");
  const [loading, setLoading] = useState(false);

  // TEMP slots (later from backend)
  const availableSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:30 AM",
    "02:00 PM",
    "04:00 PM",
    "06:00 PM",
  ];

  // ----------------------------------
  // Fetch doctor
  // ----------------------------------
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await fetch(`/api/doctors/${doctorId}`);
        const data = await res.json();
        setDoctor(data);
      } catch (err) {
        console.error("Failed to fetch doctor", err);
      }
    };
    fetchDoctor();
  }, [doctorId]);

  // ----------------------------------
  // Confirm booking
  // ----------------------------------
  const handleConfirm = async () => {
    if (!slot) {
      addToast("Please select a time slot", "error");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      if (!token || !user) {
        addToast("Please login again", "error");
        return;
      }

      // ✅ BACKEND-EXPECTED PAYLOAD
      const payload = {
        date: new Date().toISOString().split("T")[0],
        time: slot,
        doctorName: doctor.specialization, // 🔑 FIX
        patientName: user.name || "Patient",
        patientPhone: user.phone || "9999999999",
      };

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Backend error:", err);
        throw new Error(err.error || "Booking failed");
      }

      addToast("Appointment booked successfully", "success");
      navigate("/appointments");
    } catch (err) {
      console.error(err);
      addToast("Failed to book appointment", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!doctor) {
    return <p className="text-center py-10">Loading...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Confirm Appointment</h1>

        {/* Doctor Summary */}
        <div className="border rounded-lg p-4 mb-6">
          <h2 className="font-semibold">{doctor.specialization}</h2>
          <p className="text-sm text-gray-500">
            {doctor.experience} yrs experience
          </p>
          <p className="text-sm text-gray-500">
            Fee: ₹1000
          </p>
        </div>

        {/* Slot Selection */}
        <div className="mb-6">
          <label className="block font-medium mb-2">
            Select Time Slot
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {availableSlots.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => setSlot(time)}
                className={`px-3 py-2 rounded border text-sm font-medium transition
                  ${
                    slot === time
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white hover:bg-green-50 border-gray-300"
                  }
                `}
              >
                {time}
              </button>
            ))}
          </div>

          {!slot && (
            <p className="text-xs text-orange-500 mt-2">
              Please select a time slot
            </p>
          )}
        </div>

        {/* Consultation Type (UI only) */}
        <div className="mb-6">
          <label className="block font-medium mb-2">
            Consultation Type
          </label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={consultationType === "video"}
                onChange={() => setConsultationType("video")}
              />
              Video
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={consultationType === "in-person"}
                onChange={() => setConsultationType("in-person")}
              />
              In-Person
            </label>
          </div>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          disabled={loading}
          className={`w-full py-2 rounded text-white font-medium ${
            loading
              ? "bg-gray-400"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Booking..." : "Confirm Appointment"}
        </button>
      </div>
    </div>
  );
};

export default BookAppointment;
