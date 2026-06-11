import { useEffect, useState } from "react";
import { apiUrl } from "../config/api";
import LoadingSpinner from "../components/LoadingSpinner";

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(apiUrl("/api/doctors"), {
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
      <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Manage Doctors</h1>

      {doctors.length === 0 ? (
        <p className="text-slate-500 dark:text-slate-400">No doctors found</p>
      ) : (
        <div className="health-card shadow-soft dark:shadow-soft-dark rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800/80">
              <tr>
                <th className="text-left p-3 text-slate-700 dark:text-slate-300">Name</th>
                <th className="text-left p-3 text-slate-700 dark:text-slate-300">Specialization</th>
                <th className="text-left p-3 text-slate-700 dark:text-slate-300">Experience</th>
                <th className="text-left p-3 text-slate-700 dark:text-slate-300">Rating</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doc) => (
                <tr key={doc.id} className="border-t border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
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

