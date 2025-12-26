
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { useFavorites } from "../context/FavoritesContext";
import LoadingSpinner from "../components/LoadingSpinner";
import FavoriteButton from "../components/FavoriteButton";
import "./Doctors.css";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 6;

  const { addToast } = useToast();
  const { isFavorite } = useFavorites();
  const navigate = useNavigate();

  const specializations = [
    "all",
    ...new Set(doctors.map((d) => d.specialization)),
  ];

  // -------------------------------
  // Fetch doctors (SAFE)
  // -------------------------------
  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const res = await fetch("/api/doctors", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) throw new Error("Failed to fetch doctors");

      const data = await res.json();

      if (!Array.isArray(data)) {
        console.error("Doctors API returned non-array:", data);
        setDoctors([]);
        return;
      }

      setDoctors(data);
    } catch (err) {
      console.error(err);
      setDoctors([]);
      addToast("Failed to load doctors", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // -------------------------------
  // Filter + sort
  // -------------------------------
  useEffect(() => {
    let filtered = [...doctors];

    if (searchTerm) {
      filtered = filtered.filter(
        (d) =>
          (d.name || "Doctor")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          d.specialization.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (specializationFilter !== "all") {
      filtered = filtered.filter(
        (d) =>
          d.specialization.toLowerCase() ===
          specializationFilter.toLowerCase()
      );
    }

    filtered.sort((a, b) => {
      if (sortBy === "experience") return b.experience - a.experience;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "favorites")
        return isFavorite(a.id) === isFavorite(b.id)
          ? 0
          : isFavorite(a.id)
          ? -1
          : 1;
      return (a.name || "Doctor").localeCompare(b.name || "Doctor");
    });

    setFilteredDoctors(filtered);
    setCurrentPage(1);
  }, [doctors, searchTerm, specializationFilter, sortBy, isFavorite]);

  // -------------------------------
  // Pagination
  // -------------------------------
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(
    indexOfFirstDoctor,
    indexOfLastDoctor
  );

  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

  if (loading) return <LoadingSpinner text="Loading doctors..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Our Doctors</h1>
        <p className="text-gray-500 mt-1">
          Choose the right specialist and book instantly
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name or specialization"
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={specializationFilter}
          onChange={(e) => setSpecializationFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Specializations</option>
          {specializations
            .filter((spec) => spec !== "all")
            .map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="name">Name</option>
          <option value="experience">Experience</option>
          <option value="rating">Rating</option>
          <option value="favorites">Favorites First</option>
        </select>
      </div>

      <p className="text-sm text-gray-500 mb-6">
        Showing {filteredDoctors.length} doctors
      </p>

      {/* Doctors Grid */}
      {currentDoctors.length === 0 ? (
        <div className="text-center py-20">
          <h3 className="text-lg font-semibold">No doctors found</h3>
          <p className="text-gray-500">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-2xl shadow hover:shadow-xl transition"
            >
              {/* Avatar */}
              <div className="h-44 bg-blue-50 flex items-center justify-center rounded-t-2xl">
                <span className="text-6xl">👨‍⚕️</span>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {doctor.name || "Doctor"}
                  </h3>
                  <FavoriteButton doctor={doctor} />
                </div>

                <p className="text-blue-600 font-medium text-sm">
                  {doctor.specialization}
                </p>

                <div className="flex items-center gap-3 text-sm text-gray-600 mt-2">
                  <span>⭐ {doctor.rating ?? "4.5"}</span>
                  <span>•</span>
                  <span>{doctor.experience} yrs experience</span>
                </div>

                <p className="text-sm text-gray-500 mt-3 line-clamp-2">
                  {doctor.bio || "Experienced medical professional"}
                </p>

                <button
                  onClick={() => navigate(`/doctors/${doctor.id}`)}
                  className="mt-5 w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition"
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Previous
          </button>

          <span className="font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Doctors;
