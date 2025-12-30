import { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch("/api/doctors", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setDoctors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch doctors", err);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  if (loading) return <LoadingSpinner text="Loading doctors..." />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Doctors</h1>

      {doctors.length === 0 ? (
        <p className="text-gray-500">No doctors found</p>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Specialization</th>
                <th className="text-left p-3">Experience</th>
                <th className="text-left p-3">Rating</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doc) => (
                <tr key={doc.id} className="border-t">
                  <td className="p-3">{doc.name || "Doctor"}</td>
                  <td className="p-3">{doc.specialization}</td>
                  <td className="p-3">{doc.experience} yrs</td>
                  <td className="p-3">{doc.rating ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDoctors;

