// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import DoctorCard from '../components/DoctorCard';
// import axios from 'axios';

// // Doctors List Page
// export function Doctors() {
//   const [doctors, setDoctors] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         const res = await axios.get('/api/doctors');
//         setDoctors(res.data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDoctors();
//   }, []);

//   if (loading) return <p>Loading doctors...</p>;

//   return (
//     <div className="p-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
//       {doctors.length === 0 ? (
//         <p>No doctors available.</p>
//       ) : (
//         doctors.map((doctor) => <DoctorCard key={doctor.id} doctor={doctor} />)
//       )}
//     </div>
//   );
// }

// // Doctor Profile Page
// export function DoctorProfile() {
//   const { id } = useParams();
//   const [doctor, setDoctor] = useState(null);

//   useEffect(() => {
//     const fetchDoctor = async () => {
//       try {
//         const res = await axios.get(`/api/doctors/${id}`);
//         setDoctor(res.data);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchDoctor();
//   }, [id]);

//   if (!doctor) return <p>Loading doctor details...</p>;

//   return (
//     <div className="p-6 max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow">
//       <h1 className="text-2xl font-bold">{doctor.name}</h1>
//       <p className="text-gray-600">{doctor.specialization}</p>
//       <p>Experience: {doctor.experience} years</p>
//       <p>Rating: {doctor.rating}</p>
//       <p className="mt-4">{doctor.bio}</p>
//       <p className="mt-2 text-gray-500">{doctor.clinic_address}</p>

//       <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
//         Book Appointment
//       </button>
//     </div>
//   );
// }

// import React, { useEffect, useMemo, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { useToast } from '../context/ToastContext';
// import LoadingSpinner from '../components/LoadingSpinner';
// import './Doctors.css';

// // Combined Doctors page + DoctorCard in a single file for convenience.
// // Exports default DoctorsPage component.

// export default function DoctorsPage() {
//   const [doctors, setDoctors] = useState([]);
//   const [filteredDoctors, setFilteredDoctors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [specializationFilter, setSpecializationFilter] = useState('all');
//   const [sortBy, setSortBy] = useState('name');
//   const { addToast } = useToast();

//   // Derived list of specializations (keeps 'all' at the front)
//   const specializations = useMemo(() => {
//     const setSpecs = new Set(doctors.map(d => d.specialization).filter(Boolean));
//     return ['all', ...Array.from(setSpecs)];
//   }, [doctors]);

//   useEffect(() => {
//     fetchDoctors();
//   }, []);

//   useEffect(() => {
//     filterAndSortDoctors();
//   }, [doctors, searchTerm, specializationFilter, sortBy]);

//   async function fetchDoctors() {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');
//       const res = await axios.get('/api/doctors', {
//         headers: token ? { Authorization: `Bearer ${token}` } : {},
//       });
//       setDoctors(res.data || []);
//     } catch (err) {
//       console.error('Failed to fetch doctors', err);
//       addToast && addToast('Failed to load doctors', 'error');
//     } finally {
//       setLoading(false);
//     }
//   }

//   function filterAndSortDoctors() {
//     let list = Array.isArray(doctors) ? [...doctors] : [];

//     if (searchTerm.trim()) {
//       const q = searchTerm.toLowerCase();
//       list = list.filter(d =>
//         (d.name || '').toLowerCase().includes(q) ||
//         (d.specialization || '').toLowerCase().includes(q) ||
//         (d.hospital || '').toLowerCase().includes(q)
//       );
//     }

//     if (specializationFilter !== 'all') {
//       list = list.filter(d => d.specialization === specializationFilter);
//     }

//     list.sort((a, b) => {
//       switch (sortBy) {
//         case 'name':
//           return (a.name || '').localeCompare(b.name || '');
//         case 'experience':
//           return (b.experience || 0) - (a.experience || 0);
//         case 'rating':
//           return (b.rating || 0) - (a.rating || 0);
//         default:
//           return 0;
//       }
//     });

//     setFilteredDoctors(list);
//   }

//   function clearFilters() {
//     setSearchTerm('');
//     setSpecializationFilter('all');
//     setSortBy('name');
//   }

//   if (loading) {
//     return (
//       <div className="container mx-auto py-8">
//         <h1 className="text-2xl font-bold mb-6">Our Doctors</h1>
//         <LoadingSpinner text="Loading doctors..." />
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto py-8">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Our Medical Team</h1>
//         <p className="text-gray-600 dark:text-gray-400">Find and book appointments with our specialized doctors</p>
//       </div>

//       <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           {/* Search */}
//           <div className="md:col-span-2">
//             <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search Doctors</label>
//             <div className="relative">
//               <input
//                 id="search"
//                 value={searchTerm}
//                 onChange={e => setSearchTerm(e.target.value)}
//                 placeholder="Search by name, specialization, or hospital..."
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
//               />
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
//                 </svg>
//               </div>
//             </div>
//           </div>

//           {/* Specialization */}
//           <div>
//             <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Specialization</label>
//             <select
//               id="specialization"
//               value={specializationFilter}
//               onChange={e => setSpecializationFilter(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
//             >
//               {specializations.map(spec => (
//                 <option key={spec} value={spec}>{spec === 'all' ? 'All Specializations' : spec}</option>
//               ))}
//             </select>
//           </div>

//           {/* Sort */}
//           <div>
//             <label htmlFor="sort" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort By</label>
//             <select
//               id="sort"
//               value={sortBy}
//               onChange={e => setSortBy(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
//             >
//               <option value="name">Name</option>
//               <option value="experience">Experience</option>
//               <option value="rating">Rating</option>
//             </select>
//           </div>
//         </div>

//         {(searchTerm || specializationFilter !== 'all') && (
//           <div className="mt-4 flex items-center justify-between">
//             <div className="flex items-center space-x-2">
//               <span className="text-sm text-gray-600 dark:text-gray-400">Showing {filteredDoctors.length} of {doctors.length} doctors</span>
//               {searchTerm && (
//                 <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Search: "{searchTerm}"</span>
//               )}
//               {specializationFilter !== 'all' && (
//                 <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">{specializationFilter}</span>
//               )}
//             </div>
//             <button onClick={clearFilters} className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium">Clear Filters</button>
//           </div>
//         )}
//       </div>

//       <div className="mb-4">
//         <p className="text-gray-600 dark:text-gray-400">
//           {filteredDoctors.length === doctors.length
//             ? `Showing all ${doctors.length} doctors`
//             : `Found ${filteredDoctors.length} doctor${filteredDoctors.length !== 1 ? 's' : ''} matching your criteria`
//           }
//         </p>
//       </div>

//       {filteredDoctors.length === 0 ? (
//         <div className="text-center py-12">
//           <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//           </svg>
//           <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No doctors found</h3>
//           <p className="mt-1 text-gray-500 dark:text-gray-400">Try adjusting your search or filters to find what you're looking for.</p>
//           <button onClick={clearFilters} className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Clear all filters</button>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredDoctors.map(d => (
//             <DoctorCard key={d.id || d._id} doctor={d} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// // -----------------------------
// // DoctorCard component (local)
// // -----------------------------
// function DoctorCard({ doctor }) {
//   const navigate = useNavigate();

//   const handleBookAppointment = () => {
//     navigate(`/doctors/${doctor.id || doctor._id}`);
//   };

//   return (
//     <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
//       <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
//         {doctor.image ? (
//           <img src={doctor.image.startsWith('http') ? doctor.image : `/uploads/${doctor.image}`} alt={doctor.name} className="w-full h-full object-cover" />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center">
//             <svg className="h-16 w-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
//             </svg>
//           </div>
//         )}

//         {doctor.rating != null && (
//           <div className="absolute top-3 right-3 bg-white dark:bg-gray-800 rounded-full px-2 py-1 flex items-center space-x-1 shadow-sm">
//             <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
//               <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//             </svg>
//             <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{doctor.rating}</span>
//           </div>
//         )}
//       </div>

//       <div className="p-6">
//         <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{doctor.name}</h3>
//         <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">{doctor.specialization}</p>
//         {doctor.hospital && <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{doctor.hospital}</p>}
//         {doctor.experience != null && <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{doctor.experience} years of experience</p>}
//         {doctor.availability && (
//           <p className={`text-sm mb-4 ${doctor.availability === 'Available' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{doctor.availability}</p>
//         )}

//         <button onClick={handleBookAppointment} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">View Profile & Book</button>
//       </div>
//     </div>
//   );
// }

// import React, { useEffect, useMemo, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { useToast } from '../context/ToastContext';
// import LoadingSpinner from '../components/LoadingSpinner';
// import './Doctors.css';

// // ==============================
// // ✅ Doctors List Page
// // ==============================
// export function Doctors() {
//   const [doctors, setDoctors] = useState([]);
//   const [filteredDoctors, setFilteredDoctors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [specializationFilter, setSpecializationFilter] = useState('all');
//   const [sortBy, setSortBy] = useState('name');
//   const { addToast } = useToast();

//   // Derived list of specializations
//   const specializations = useMemo(() => {
//     const setSpecs = new Set(doctors.map(d => d.specialization).filter(Boolean));
//     return ['all', ...Array.from(setSpecs)];
//   }, [doctors]);

//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         setLoading(true);
//         const token = localStorage.getItem('token');
//         const res = await axios.get('/api/doctors', {
//           headers: token ? { Authorization: `Bearer ${token}` } : {},
//         });
//         setDoctors(res.data || []);
//       } catch (err) {
//         console.error('Failed to fetch doctors', err);
//         addToast && addToast('Failed to load doctors', 'error');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDoctors();
//   }, []); // eslint-disable-line react-hooks/exhaustive-deps

//   useEffect(() => {
//     const filterAndSortDoctors = () => {
//       let list = [...doctors];

//       if (searchTerm.trim()) {
//         const q = searchTerm.toLowerCase();
//         list = list.filter(d =>
//           (d.name || '').toLowerCase().includes(q) ||
//           (d.specialization || '').toLowerCase().includes(q) ||
//           (d.hospital || '').toLowerCase().includes(q)
//         );
//       }

//       if (specializationFilter !== 'all') {
//         list = list.filter(d => d.specialization === specializationFilter);
//       }

//       list.sort((a, b) => {
//         switch (sortBy) {
//           case 'name':
//             return (a.name || '').localeCompare(b.name || '');
//           case 'experience':
//             return (b.experience || 0) - (a.experience || 0);
//           case 'rating':
//             return (b.rating || 0) - (a.rating || 0);
//           default:
//             return 0;
//         }
//       });

//       setFilteredDoctors(list);
//     };

//     filterAndSortDoctors();
//   }, [doctors, searchTerm, specializationFilter, sortBy]); // eslint-disable-line react-hooks/exhaustive-deps

//   const clearFilters = () => {
//     setSearchTerm('');
//     setSpecializationFilter('all');
//     setSortBy('name');
//   };

//   if (loading) {
//     return (
//       <div className="container mx-auto py-8">
//         <h1 className="text-2xl font-bold mb-6">Our Doctors</h1>
//         <LoadingSpinner text="Loading doctors..." />
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto py-8">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
//           Our Medical Team
//         </h1>
//         <p className="text-gray-600 dark:text-gray-400">
//           Find and book appointments with our specialized doctors
//         </p>
//       </div>

//       {/* Filter Section */}
//       <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           {/* Search */}
//           <div className="md:col-span-2">
//             <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               Search Doctors
//             </label>
//             <div className="relative">
//               <input
//                 id="search"
//                 value={searchTerm}
//                 onChange={e => setSearchTerm(e.target.value)}
//                 placeholder="Search by name, specialization, or hospital..."
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
//               />
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
//                   <path
//                     fillRule="evenodd"
//                     d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </div>
//             </div>
//           </div>

//           {/* Specialization */}
//           <div>
//             <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               Specialization
//             </label>
//             <select
//               id="specialization"
//               value={specializationFilter}
//               onChange={e => setSpecializationFilter(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
//             >
//               {specializations.map(spec => (
//                 <option key={spec} value={spec}>
//                   {spec === 'all' ? 'All Specializations' : spec}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Sort */}
//           <div>
//             <label htmlFor="sort" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               Sort By
//             </label>
//             <select
//               id="sort"
//               value={sortBy}
//               onChange={e => setSortBy(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
//             >
//               <option value="name">Name</option>
//               <option value="experience">Experience</option>
//               <option value="rating">Rating</option>
//             </select>
//           </div>
//         </div>

//         {(searchTerm || specializationFilter !== 'all') && (
//           <div className="mt-4 flex items-center justify-between">
//             <div className="flex items-center space-x-2">
//               <span className="text-sm text-gray-600 dark:text-gray-400">
//                 Showing {filteredDoctors.length} of {doctors.length} doctors
//               </span>
//               {searchTerm && (
//                 <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
//                   Search: "{searchTerm}"
//                 </span>
//               )}
//               {specializationFilter !== 'all' && (
//                 <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
//                   {specializationFilter}
//                 </span>
//               )}
//             </div>
//             <button
//               onClick={clearFilters}
//               className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium"
//             >
//               Clear Filters
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Doctors Grid */}
//       {filteredDoctors.length === 0 ? (
//         <div className="text-center py-12">
//           <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//           </svg>
//           <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No doctors found</h3>
//           <p className="mt-1 text-gray-500 dark:text-gray-400">
//             Try adjusting your search or filters to find what you're looking for.
//           </p>
//           <button
//             onClick={clearFilters}
//             className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//           >
//             Clear all filters
//           </button>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredDoctors.map(d => (
//             <DoctorCard key={d.id || d._id} doctor={d} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// // ==============================
// // ✅ Doctor Card Component
// // ==============================
// function DoctorCard({ doctor }) {
//   const navigate = useNavigate();

//   return (
//     <div
//       className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
//       onClick={() => navigate(`/doctors/${doctor.id || doctor._id}`)}
//     >
//       <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
//         {doctor.image ? (
//           <img
//             src={doctor.image.startsWith('http') ? doctor.image : `/uploads/${doctor.image}`}
//             alt={doctor.name}
//             className="w-full h-full object-cover"
//           />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center text-gray-400">
//             <svg className="h-16 w-16" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
//             </svg>
//           </div>
//         )}
//       </div>
//       <div className="p-6">
//         <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{doctor.name}</h3>
//         <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">{doctor.specialization}</p>
//         {doctor.hospital && <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{doctor.hospital}</p>}
//         {doctor.experience != null && <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{doctor.experience} years of experience</p>}
//       </div>
//     </div>
//   );
// }

// // ==============================
// // ✅ Doctor Profile Page
// // ==============================
// export function DoctorProfile() {
//   const { id } = useParams();
//   const [doctor, setDoctor] = useState(null);

//   useEffect(() => {
//     const fetchDoctor = async () => {
//       try {
//         const res = await axios.get(`/api/doctors/${id}`);
//         setDoctor(res.data);
//       } catch (err) {
//         console.error('Error fetching doctor details:', err);
//       }
//     };
//     fetchDoctor();
//   }, [id]);

//   if (!doctor) return <p>Loading doctor details...</p>;

//   return (
//     <div className="p-6 max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow">
//       <h1 className="text-2xl font-bold">{doctor.name}</h1>
//       <p className="text-gray-600">{doctor.specialization}</p>
//       <p>Experience: {doctor.experience} years</p>
//       <p>Rating: {doctor.rating}</p>
//       <p className="mt-4">{doctor.bio}</p>
//       <p className="mt-2 text-gray-500">{doctor.clinic_address}</p>
//       <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
//         Book Appointment
//       </button>
//     </div>
//   );
// }

// export default Doctors;

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import './Doctors.css';

// ==============================
// ✅ Doctors List Page (Responsive)
// ==============================
export function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const { addToast } = useToast();

  const specializations = useMemo(() => {
    const specs = new Set(doctors.map((d) => d.specialization).filter(Boolean));
    return ['all', ...Array.from(specs)];
  }, [doctors]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/doctors', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setDoctors(res.data || []);
      } catch (err) {
        console.error('Failed to fetch doctors', err);
        addToast && addToast('Failed to load doctors', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const filterAndSortDoctors = () => {
      let list = [...doctors];

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        list = list.filter(
          (d) =>
            (d.name || '').toLowerCase().includes(q) ||
            (d.specialization || '').toLowerCase().includes(q) ||
            (d.hospital || '').toLowerCase().includes(q)
        );
      }

      if (specializationFilter !== 'all') {
        list = list.filter((d) => d.specialization === specializationFilter);
      }

      list.sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return (a.name || '').localeCompare(b.name || '');
          case 'experience':
            return (b.experience || 0) - (a.experience || 0);
          case 'rating':
            return (b.rating || 0) - (a.rating || 0);
          default:
            return 0;
        }
      });

      setFilteredDoctors(list);
    };
    filterAndSortDoctors();
  }, [doctors, searchTerm, specializationFilter, sortBy]); // eslint-disable-line react-hooks/exhaustive-deps

  const clearFilters = () => {
    setSearchTerm('');
    setSpecializationFilter('all');
    setSortBy('name');
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <h1 className="text-2xl font-bold mb-6">Our Doctors</h1>
        <LoadingSpinner text="Loading doctors..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Our Medical Team
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Find and book appointments with our specialized doctors
        </p>
      </div>

      {/* Filter Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Search Doctors
            </label>
            <div className="relative">
              <input
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, specialization, or hospital..."
                className="search-input w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Specialization */}
          <div>
            <label
              htmlFor="specialization"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Specialization
            </label>
            <select
              id="specialization"
              value={specializationFilter}
              onChange={(e) => setSpecializationFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {specializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec === 'all' ? 'All Specializations' : spec}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label
              htmlFor="sort"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Sort By
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="name">Name</option>
              <option value="experience">Experience</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>

        {/* Filters active summary */}
        {(searchTerm || specializationFilter !== 'all') && (
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredDoctors.length} of {doctors.length} doctors
              </span>
              {searchTerm && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium 
                                bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Search: "{searchTerm}"
                </span>
              )}
              {specializationFilter !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium 
                                bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {specializationFilter}
                </span>
              )}
            </div>
            <button
              onClick={clearFilters}
              className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Doctors Grid (Responsive) */}
      {filteredDoctors.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
            No doctors found
          </h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Try adjusting your search or filters to find what you're looking
            for.
          </p>
          <button
            onClick={clearFilters}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium 
                       rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((d) => (
            <DoctorCard key={d.id || d._id} doctor={d} />
          ))}
        </div>
      )}
    </div>
  );
}

// ==============================
// ✅ Doctor Card (Responsive)
// ==============================
function DoctorCard({ doctor }) {
  const navigate = useNavigate();

  return (
    <div
      className="doctor-card bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden 
                 hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={() => navigate(`/doctors/${doctor.id || doctor._id}`)}
    >
      <div className="h-56 sm:h-64 md:h-52 bg-gray-200 dark:bg-gray-700 relative">
        {doctor.image ? (
          <img
            src={doctor.image.startsWith('http') ? doctor.image : `/uploads/${doctor.image}`}
            alt={doctor.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="h-16 w-16" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
      <div className="p-5 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
          {doctor.name}
        </h3>
        <p className="text-blue-600 dark:text-blue-400 font-medium mb-2 text-sm sm:text-base">
          {doctor.specialization}
        </p>
        {doctor.hospital && (
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
            {doctor.hospital}
          </p>
        )}
        {doctor.experience != null && (
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {doctor.experience} years of experience
          </p>
        )}
      </div>
    </div>
  );
}

// ==============================
// ✅ Doctor Profile Page (Responsive)
// ==============================
export function DoctorProfile() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await axios.get(`/api/doctors/${id}`);
        setDoctor(res.data);
      } catch (err) {
        console.error('Error fetching doctor details:', err);
      }
    };
    fetchDoctor();
  }, [id]);

  if (!doctor) return <p className="text-center py-10">Loading doctor details...</p>;

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 mb-6">
        {doctor.image && (
          <img
            src={doctor.image.startsWith('http') ? doctor.image : `/uploads/${doctor.image}`}
            alt={doctor.name}
            className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover mx-auto sm:mx-0 mb-4 sm:mb-0"
          />
        )}
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold">{doctor.name}</h1>
          <p className="text-gray-600 dark:text-gray-400">{doctor.specialization}</p>
          <p className="text-gray-500 mt-1">Experience: {doctor.experience} years</p>
          <p className="text-gray-500">Rating: {doctor.rating}</p>
        </div>
      </div>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{doctor.bio}</p>
      <p className="mt-3 text-gray-500 dark:text-gray-400">{doctor.clinic_address}</p>

      <button
        className="mt-6 w-full sm:w-auto px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white 
                   font-medium rounded-lg transition-colors duration-200"
      >
        Book Appointment
      </button>
    </div>
  );
}

export default Doctors;
