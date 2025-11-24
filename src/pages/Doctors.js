

// src/pages/Doctors.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useFavorites } from '../context/FavoritesContext';
import LoadingSpinner from '../components/LoadingSpinner';
import FavoriteButton from '../components/FavoriteButton';
import './Doctors.css';

// ==============================
// ✅ Doctors List Page
// ==============================
export function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [view, setView] = useState('grid');

  const { addToast } = useToast();
  const { favorites, isFavorite } = useFavorites();

  const specializations = ['all', ...new Set(doctors.map((d) => d.specialization))];

  // ✅ Fetch doctors data
  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/doctors', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch doctors');
      const data = await response.json();
      setDoctors(data);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      addToast('Failed to load doctors', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  // ✅ Filter and sort doctors
  const filterAndSortDoctors = useCallback(() => {
    let filtered = [...doctors];

    if (searchTerm) {
      filtered = filtered.filter(
        (d) =>
          d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.hospital?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (specializationFilter !== 'all') {
      filtered = filtered.filter((d) => d.specialization === specializationFilter);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'experience':
          return b.experience - a.experience;
        case 'rating':
          return b.rating - a.rating;
        case 'favorites':
          return isFavorite(a.id) === isFavorite(b.id)
            ? 0
            : isFavorite(a.id)
            ? -1
            : 1;
        default:
          return 0;
      }
    });

    setFilteredDoctors(filtered);
  }, [doctors, searchTerm, specializationFilter, sortBy, isFavorite]);

  // ✅ Run once on mount
  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // ✅ Update filtered list on changes
  useEffect(() => {
    filterAndSortDoctors();
  }, [filterAndSortDoctors]);

  const clearFilters = () => {
    setSearchTerm('');
    setSpecializationFilter('all');
    setSortBy('name');
  };

  const handleViewFavorites = () => {
    setSortBy('favorites');
    addToast('Showing your favorite doctors', 'info');
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Our Doctors</h1>
        <LoadingSpinner text="Loading doctors..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Our Medical Team
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find and book appointments with our specialized doctors
          </p>
        </div>

        {/* Favorites & View Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleViewFavorites}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800 dark:hover:bg-red-900/30"
          >
            <span>❤️</span> My Favorites ({favorites.length})
          </button>
          <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <button
              onClick={() => setView('grid')}
              className={`p-2 ${
                view === 'grid'
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              ⏹️
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 ${
                view === 'list'
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search Doctors
            </label>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, specialization, or hospital..."
              className="w-full pl-4 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Specialization */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Specialization
            </label>
            <select
              value={specializationFilter}
              onChange={(e) => setSpecializationFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Specializations</option>
              {specializations
                .filter((spec) => spec !== 'all')
                .map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="name">Name</option>
              <option value="experience">Experience</option>
              <option value="rating">Rating</option>
              <option value="favorites">Favorites First</option>
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {(searchTerm || specializationFilter !== 'all' || sortBy === 'favorites') && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredDoctors.length} of {doctors.length} doctors
            </div>
            <button
              onClick={clearFilters}
              className="text-sm text-red-600 hover:text-red-800 dark:text-red-400"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Doctors Grid/List */}
      {filteredDoctors.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            No doctors found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <div
          className={
            view === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          {filteredDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} view={view} />
          ))}
        </div>
      )}
    </div>
  );
}

// ==============================
// ✅ Doctor Card
// ==============================
const DoctorCard = ({ doctor, view }) => {
  const navigate = useNavigate();

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all ${
        view === 'list' ? 'flex items-center gap-4 p-4' : ''
      }`}
    >
      <div
        className={`${
          view === 'grid' ? 'h-48' : 'w-24 h-24 flex-shrink-0'
        } bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden`}
      >
        {doctor.image ? (
          <img
            src={`/uploads/${doctor.image}`}
            alt={doctor.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="h-10 w-10" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>

      <div className={`p-4 ${view === 'list' ? 'flex-1' : ''}`}>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {doctor.name}
        </h3>
        <p className="text-blue-600 dark:text-blue-400 font-medium">
          {doctor.specialization}
        </p>
        {doctor.hospital && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {doctor.hospital}
          </p>
        )}
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {doctor.experience} years of experience
        </p>
        <div className="mt-2 flex items-center justify-between">
          <FavoriteButton doctor={doctor} />
          <button
            onClick={() => navigate(`/doctors/${doctor.id}`)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

// ==============================
// ✅ Doctor Profile Page
// ==============================
export function DoctorProfile() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await fetch(`/api/doctors/${id}`);
        const data = await res.json();
        setDoctor(data);
      } catch (err) {
        console.error('Error fetching doctor details:', err);
      }
    };
    fetchDoctor();
  }, [id]);

  if (!doctor)
    return <p className="text-center py-10">Loading doctor details...</p>;

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 mb-6">
        {doctor.image && (
          <img
            src={`/uploads/${doctor.image}`}
            alt={doctor.name}
            className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover mx-auto sm:mx-0 mb-4 sm:mb-0"
          />
        )}
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold">{doctor.name}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {doctor.specialization}
          </p>
          <p className="text-gray-500 mt-1">
            Experience: {doctor.experience} years
          </p>
          <p className="text-gray-500">Rating: {doctor.rating}</p>
        </div>
      </div>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        {doctor.bio}
      </p>
      <p className="mt-3 text-gray-500 dark:text-gray-400">
        {doctor.clinic_address}
      </p>

      <button className="mt-6 w-full sm:w-auto px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg">
        Book Appointment
      </button>
    </div>
  );
}

export default Doctors;
