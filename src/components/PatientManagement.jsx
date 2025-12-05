// // PatientManagement.jsx
// import React, { useState, useEffect } from 'react';
// import './PatientManagement.css';

// const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

// const getAuthHeaders = () => {
//   const token = localStorage.getItem('token');
//   return {
//     'Content-Type': 'application/json',
//     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//   };
// };

// const PatientManagement = () => {
//   const [patients, setPatients] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('all');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showAddPatient, setShowAddPatient] = useState(false);
//   const [selectedPatient, setSelectedPatient] = useState(null);
//   const [showMedicalHistory, setShowMedicalHistory] = useState(false);

//   // Fetch patients data
//   const fetchPatients = async () => {
//     try {
//       const response = await fetch(`${API_BASE}/api/patients`, {
//         method: 'GET',
//         headers: getAuthHeaders(),
//       });
      
//       const result = await response.json();
//       if (result.success) {
//         setPatients(result.data);
//       }
//     } catch (error) {
//       console.error('Error fetching patients:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPatients();
//   }, []);

//   // Filter patients based on active tab and search term
//   const filteredPatients = patients.filter(patient => {
//     const matchesSearch = 
//       patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       patient.phone?.includes(searchTerm);
    
//     if (activeTab === 'all') return matchesSearch;
//     if (activeTab === 'recent') {
//       const lastVisit = patient.last_visit ? new Date(patient.last_visit) : null;
//       const thirtyDaysAgo = new Date();
//       thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
//       return matchesSearch && lastVisit && lastVisit > thirtyDaysAgo;
//     }
//     return matchesSearch;
//   });

//   if (loading) {
//     return (
//       <div className="patient-management-container">
//         <div className="loading-spinner">Loading patients...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="patient-management-container">
//       {/* Header */}
//       <div className="patient-header">
//         <div className="header-content">
//           <h1>Patient Management</h1>
//           <p>Manage patient records and medical history</p>
//         </div>
//         <div className="header-actions">
//           <button 
//             className="btn-primary"
//             onClick={() => setShowAddPatient(true)}
//           >
//             + Add New Patient
//           </button>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="patient-stats">
//         <div className="stat-card">
//           <div className="stat-icon">👥</div>
//           <div className="stat-content">
//             <div className="stat-value">{patients.length}</div>
//             <div className="stat-label">Total Patients</div>
//           </div>
//         </div>
//         <div className="stat-card">
//           <div className="stat-icon">📅</div>
//           <div className="stat-content">
//             <div className="stat-value">
//               {patients.filter(p => {
//                 const lastVisit = p.last_visit ? new Date(p.last_visit) : null;
//                 const thirtyDaysAgo = new Date();
//                 thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
//                 return lastVisit && lastVisit > thirtyDaysAgo;
//               }).length}
//             </div>
//             <div className="stat-label">Active (30 days)</div>
//           </div>
//         </div>
//         <div className="stat-card">
//           <div className="stat-icon">🆕</div>
//           <div className="stat-content">
//             <div className="stat-value">
//               {patients.filter(p => {
//                 const created = p.created_at ? new Date(p.created_at) : null;
//                 const thirtyDaysAgo = new Date();
//                 thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
//                 return created && created > thirtyDaysAgo;
//               }).length}
//             </div>
//             <div className="stat-label">New This Month</div>
//           </div>
//         </div>
//       </div>

//       {/* Controls */}
//       <div className="patient-controls">
//         <div className="search-box">
//           <input
//             type="text"
//             placeholder="Search patients by name, email, or phone..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//         <div className="filter-tabs">
//           <button
//             className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
//             onClick={() => setActiveTab('all')}
//           >
//             All Patients
//           </button>
//           <button
//             className={`tab-btn ${activeTab === 'recent' ? 'active' : ''}`}
//             onClick={() => setActiveTab('recent')}
//           >
//             Recent Visits
//           </button>
//         </div>
//       </div>

//       {/* Patients Grid */}
//       <div className="patients-grid">
//         {filteredPatients.length === 0 ? (
//           <div className="empty-state">
//             <div className="empty-icon">👥</div>
//             <h3>No patients found</h3>
//             <p>{searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first patient'}</p>
//             <button 
//               className="btn-primary"
//               onClick={() => setShowAddPatient(true)}
//             >
//               + Add First Patient
//             </button>
//           </div>
//         ) : (
//           filteredPatients.map(patient => (
//             <PatientCard
//               key={patient.id}
//               patient={patient}
//               onViewDetails={() => setSelectedPatient(patient)}
//               onViewMedicalHistory={() => {
//                 setSelectedPatient(patient);
//                 setShowMedicalHistory(true);
//               }}
//             />
//           ))
//         )}
//       </div>

//       {/* Modals */}
//       {showAddPatient && (
//         <AddPatientModal
//           onClose={() => setShowAddPatient(false)}
//           onSuccess={() => {
//             setShowAddPatient(false);
//             fetchPatients();
//           }}
//         />
//       )}

//       {selectedPatient && !showMedicalHistory && (
//         <PatientDetailsModal
//           patient={selectedPatient}
//           onClose={() => setSelectedPatient(null)}
//           onEdit={() => {
//             // Implement edit functionality
//           }}
//           onViewMedicalHistory={() => {
//             setShowMedicalHistory(true);
//           }}
//         />
//       )}

//       {selectedPatient && showMedicalHistory && (
//         <MedicalHistoryModal
//           patient={selectedPatient}
//           onClose={() => {
//             setShowMedicalHistory(false);
//             setSelectedPatient(null);
//           }}
//         />
//       )}
//     </div>
//   );
// };

// // Patient Card Component
// const PatientCard = ({ patient, onViewDetails, onViewMedicalHistory }) => {
//   return (
//     <div className="patient-card">
//       <div className="patient-card-header">
//         <div className="patient-avatar">
//           {patient.name ? patient.name.charAt(0).toUpperCase() : 'P'}
//         </div>
//         <div className="patient-basic-info">
//           <h3 className="patient-name">{patient.name || 'Unnamed Patient'}</h3>
//           <p className="patient-age-gender">
//             {patient.age ? `${patient.age} yrs` : 'Age not set'} • {patient.gender || 'Not specified'}
//           </p>
//         </div>
//       </div>

//       <div className="patient-contact-info">
//         <div className="contact-item">
//           <span className="icon">📞</span>
//           <span>{patient.phone || 'No phone'}</span>
//         </div>
//         <div className="contact-item">
//           <span className="icon">📧</span>
//           <span>{patient.email || 'No email'}</span>
//         </div>
//       </div>

//       <div className="patient-meta">
//         <div className="meta-item">
//           <span className="label">Last Visit:</span>
//           <span className="value">
//             {patient.last_visit 
//               ? new Date(patient.last_visit).toLocaleDateString() 
//               : 'Never'
//             }
//           </span>
//         </div>
//         <div className="meta-item">
//           <span className="label">Blood Type:</span>
//           <span className="value">{patient.blood_type || 'Not set'}</span>
//         </div>
//       </div>

//       <div className="patient-card-actions">
//         <button 
//           className="btn-outline"
//           onClick={onViewDetails}
//         >
//           View Details
//         </button>
//         <button 
//           className="btn-primary"
//           onClick={onViewMedicalHistory}
//         >
//           Medical History
//         </button>
//       </div>
//     </div>
//   );
// };

// // Add Patient Modal Component
// const AddPatientModal = ({ onClose, onSuccess }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     date_of_birth: '',
//     gender: '',
//     blood_type: '',
//     allergies: '',
//     medical_conditions: '',
//     emergency_contact_name: '',
//     emergency_contact_phone: ''
//   });
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await fetch(`${API_BASE}/api/patients`, {
//         method: 'POST',
//         headers: getAuthHeaders(),
//         body: JSON.stringify(formData),
//       });

//       const result = await response.json();
      
//       if (result.success) {
//         onSuccess();
//       } else {
//         alert(result.message || 'Failed to add patient');
//       }
//     } catch (error) {
//       console.error('Error adding patient:', error);
//       alert('Failed to add patient');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <div className="modal-header">
//           <h2>Add New Patient</h2>
//           <button className="modal-close" onClick={onClose}>×</button>
//         </div>

//         <form onSubmit={handleSubmit} className="patient-form">
//           <div className="form-grid">
//             <div className="form-group">
//               <label>Full Name *</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label>Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="form-group">
//               <label>Phone *</label>
//               <input
//                 type="tel"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label>Date of Birth</label>
//               <input
//                 type="date"
//                 name="date_of_birth"
//                 value={formData.date_of_birth}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="form-group">
//               <label>Gender</label>
//               <select
//                 name="gender"
//                 value={formData.gender}
//                 onChange={handleChange}
//               >
//                 <option value="">Select Gender</option>
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>

//             <div className="form-group">
//               <label>Blood Type</label>
//               <select
//                 name="blood_type"
//                 value={formData.blood_type}
//                 onChange={handleChange}
//               >
//                 <option value="">Select Blood Type</option>
//                 <option value="A+">A+</option>
//                 <option value="A-">A-</option>
//                 <option value="B+">B+</option>
//                 <option value="B-">B-</option>
//                 <option value="AB+">AB+</option>
//                 <option value="AB-">AB-</option>
//                 <option value="O+">O+</option>
//                 <option value="O-">O-</option>
//               </select>
//             </div>
//           </div>

//           <div className="form-group">
//             <label>Allergies</label>
//             <textarea
//               name="allergies"
//               value={formData.allergies}
//               onChange={handleChange}
//               placeholder="List any known allergies..."
//               rows="3"
//             />
//           </div>

//           <div className="form-group">
//             <label>Medical Conditions</label>
//             <textarea
//               name="medical_conditions"
//               value={formData.medical_conditions}
//               onChange={handleChange}
//               placeholder="List any existing medical conditions..."
//               rows="3"
//             />
//           </div>

//           <div className="form-grid">
//             <div className="form-group">
//               <label>Emergency Contact Name</label>
//               <input
//                 type="text"
//                 name="emergency_contact_name"
//                 value={formData.emergency_contact_name}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="form-group">
//               <label>Emergency Contact Phone</label>
//               <input
//                 type="tel"
//                 name="emergency_contact_phone"
//                 value={formData.emergency_contact_phone}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           <div className="form-actions">
//             <button type="button" onClick={onClose} className="btn-cancel">
//               Cancel
//             </button>
//             <button type="submit" className="btn-primary" disabled={loading}>
//               {loading ? 'Adding...' : 'Add Patient'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// // Patient Details Modal Component
// const PatientDetailsModal = ({ patient, onClose, onEdit, onViewMedicalHistory }) => {
//   return (
//     <div className="modal-overlay">
//       <div className="modal-content large">
//         <div className="modal-header">
//           <h2>Patient Details</h2>
//           <button className="modal-close" onClick={onClose}>×</button>
//         </div>

//         <div className="patient-details">
//           <div className="details-section">
//             <h3>Personal Information</h3>
//             <div className="details-grid">
//               <div className="detail-item">
//                 <span className="label">Full Name:</span>
//                 <span className="value">{patient.name}</span>
//               </div>
//               <div className="detail-item">
//                 <span className="label">Age:</span>
//                 <span className="value">{patient.age ? `${patient.age} years` : 'Not specified'}</span>
//               </div>
//               <div className="detail-item">
//                 <span className="label">Gender:</span>
//                 <span className="value">{patient.gender || 'Not specified'}</span>
//               </div>
//               <div className="detail-item">
//                 <span className="label">Blood Type:</span>
//                 <span className="value">{patient.blood_type || 'Not specified'}</span>
//               </div>
//             </div>
//           </div>

//           <div className="details-section">
//             <h3>Contact Information</h3>
//             <div className="details-grid">
//               <div className="detail-item">
//                 <span className="label">Phone:</span>
//                 <span className="value">{patient.phone || 'Not provided'}</span>
//               </div>
//               <div className="detail-item">
//                 <span className="label">Email:</span>
//                 <span className="value">{patient.email || 'Not provided'}</span>
//               </div>
//             </div>
//           </div>

//           <div className="details-section">
//             <h3>Medical Information</h3>
//             <div className="details-grid full-width">
//               <div className="detail-item">
//                 <span className="label">Allergies:</span>
//                 <span className="value">{patient.allergies || 'None recorded'}</span>
//               </div>
//               <div className="detail-item">
//                 <span className="label">Medical Conditions:</span>
//                 <span className="value">{patient.medical_conditions || 'None recorded'}</span>
//               </div>
//             </div>
//           </div>

//           {patient.emergency_contact_name && (
//             <div className="details-section">
//               <h3>Emergency Contact</h3>
//               <div className="details-grid">
//                 <div className="detail-item">
//                   <span className="label">Name:</span>
//                   <span className="value">{patient.emergency_contact_name}</span>
//                 </div>
//                 <div className="detail-item">
//                   <span className="label">Phone:</span>
//                   <span className="value">{patient.emergency_contact_phone}</span>
//                 </div>
//               </div>
//             </div>
//           )}

//           <div className="details-section">
//             <h3>Visit History</h3>
//             <div className="details-grid">
//               <div className="detail-item">
//                 <span className="label">Last Visit:</span>
//                 <span className="value">
//                   {patient.last_visit 
//                     ? new Date(patient.last_visit).toLocaleDateString() 
//                     : 'No visits recorded'
//                   }
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="modal-actions">
//           <button className="btn-outline" onClick={onClose}>
//             Close
//           </button>
//           <button className="btn-primary" onClick={onViewMedicalHistory}>
//             View Medical History
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Medical History Modal Component
// const MedicalHistoryModal = ({ patient, onClose }) => {
//   const [medicalHistory, setMedicalHistory] = useState([]);
//   const [showAddRecord, setShowAddRecord] = useState(false);

//   useEffect(() => {
//     // Fetch medical history for this patient
//     const fetchMedicalHistory = async () => {
//       try {
//         const response = await fetch(`${API_BASE}/api/patients/${patient.id}/medical-history`, {
//           headers: getAuthHeaders(),
//         });
//         const result = await response.json();
//         if (result.success) {
//           setMedicalHistory(result.data);
//         }
//       } catch (error) {
//         console.error('Error fetching medical history:', error);
//       }
//     };

//     fetchMedicalHistory();
//   }, [patient.id]);

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content x-large">
//         <div className="modal-header">
//           <h2>Medical History - {patient.name}</h2>
//           <button className="modal-close" onClick={onClose}>×</button>
//         </div>

//         <div className="medical-history-header">
//           <button 
//             className="btn-primary"
//             onClick={() => setShowAddRecord(true)}
//           >
//             + Add Medical Record
//           </button>
//         </div>

//         <div className="medical-history-list">
//           {medicalHistory.length === 0 ? (
//             <div className="empty-state">
//               <p>No medical records found</p>
//             </div>
//           ) : (
//             medicalHistory.map(record => (
//               <div key={record.id} className="medical-record">
//                 <div className="record-header">
//                   <h4>{record.visit_date ? new Date(record.visit_date).toLocaleDateString() : 'Undated'}</h4>
//                   <span className={`record-type ${record.record_type}`}>
//                     {record.record_type}
//                   </span>
//                 </div>
//                 <div className="record-content">
//                   <p><strong>Diagnosis:</strong> {record.diagnosis || 'Not specified'}</p>
//                   <p><strong>Treatment:</strong> {record.treatment || 'Not specified'}</p>
//                   <p><strong>Notes:</strong> {record.notes || 'No additional notes'}</p>
//                   {record.prescriptions && record.prescriptions.length > 0 && (
//                     <div className="prescriptions">
//                       <strong>Prescriptions:</strong>
//                       <ul>
//                         {record.prescriptions.map((prescription, index) => (
//                           <li key={index}>
//                             {prescription.medicine} - {prescription.dosage} ({prescription.frequency})
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         {showAddRecord && (
//           <AddMedicalRecordModal
//             patient={patient}
//             onClose={() => setShowAddRecord(false)}
//             onSuccess={() => {
//               setShowAddRecord(false);
//               setMedicalHistory();
//             }}
//           />
//         )}

//         <div className="modal-actions">
//           <button className="btn-primary" onClick={onClose}>
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Add Medical Record Modal Component
// const AddMedicalRecordModal = ({ patient, onClose, onSuccess }) => {
//   const [formData, setFormData] = useState({
//     visit_date: '',
//     record_type: '',
//     diagnosis: '',
//     treatment: '',
//     notes: '',
//     prescriptions: []
//   });
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await fetch(`${API_BASE}/api/patients/${patient.id}/medical-history`, {
//         method: 'POST',
//         headers: getAuthHeaders(),
//         body: JSON.stringify(formData),
//       });

//       const result = await response.json();
      
//       if (result.success) {
//         onSuccess();
//       } else {
//         alert(result.message || 'Failed to add medical record');
//       }
//     } catch (error) {
//       console.error('Error adding medical record:', error);
//       alert('Failed to add medical record');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <div className="modal-header">
//           <h2>Add Medical Record</h2>
//           <button className="modal-close" onClick={onClose}>×</button>
//         </div>

//         <form onSubmit={handleSubmit} className="patient-form">
//           <div className="form-grid">
//             <div className="form-group">
//               <label>Visit Date *</label>
//               <input
//                 type="date"
//                 name="visit_date"
//                 value={formData.visit_date}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label>Record Type *</label>
//               <select
//                 name="record_type"
//                 value={formData.record_type}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="">Select Type</option>
//                 <option value="Consultation">Consultation</option>
//                 <option value="Lab Test">Lab Test</option>
//                 <option value="Diagnosis">Diagnosis</option>
//                 <option value="Treatment">Treatment</option>
//               </select>
//             </div>
//           </div>

//           <div className="form-group">
//             <label>Diagnosis</label>
//             <textarea
//               name="diagnosis"
//               value={formData.diagnosis}
//               onChange={handleChange}
//               placeholder="Enter diagnosis..."
//               rows="3"
//             />
//           </div>

//           <div className="form-group">
//             <label>Treatment</label>
//             <textarea
//               name="treatment"
//               value={formData.treatment}
//               onChange={handleChange}
//               placeholder="Enter treatment details..."
//               rows="3"
//             />
//           </div>

//           <div className="form-group">
//             <label>Notes</label>
//             <textarea
//               name="notes"
//               value={formData.notes}
//               onChange={handleChange}
//               placeholder="Additional notes..."
//               rows="3"
//             />
//           </div>

//           <div className="form-actions">
//             <button type="button" onClick={onClose} className="btn-cancel">
//               Cancel
//             </button>
//             <button type="submit" className="btn-primary" disabled={loading}>
//               {loading ? 'Adding...' : 'Add Record'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PatientManagement;

// import React, { useState, useEffect } from "react";
// import "./PatientManagement.css";

// const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

// const getAuthHeaders = () => {
//   const token = localStorage.getItem("token");
//   return {
//     "Content-Type": "application/json",
//     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//   };
// };

// /* ===========================================================
//    MAIN COMPONENT
// =========================================================== */
// const PatientManagement = () => {
//   const [patients, setPatients] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showAddPatient, setShowAddPatient] = useState(false);
//   const [selectedPatient, setSelectedPatient] = useState(null);
//   const [showMedicalHistory, setShowMedicalHistory] = useState(false);

//   const fetchPatients = async () => {
//     try {
//       const req = await fetch(`${API_BASE}/api/patients`, {
//         headers: getAuthHeaders(),
//       });

//       const res = await req.json();
//       if (res.success) setPatients(res.data);
//     } catch (error) {
//       console.error("Error fetching patients:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPatients();
//   }, []);

//   const filteredPatients = patients.filter((p) => {
//     const search = searchTerm.toLowerCase();
//     return (
//       p.first_name?.toLowerCase().includes(search) ||
//       p.last_name?.toLowerCase().includes(search) ||
//       p.email?.toLowerCase().includes(search) ||
//       p.phone?.includes(search)
//     );
//   });

//   if (loading) return <div className="loading-spinner">Loading patients...</div>;

//   return (
//     <div className="patient-management-container">
//       <div className="patient-header">
//         <h1>Patient Management</h1>
//         <button className="btn-primary" onClick={() => setShowAddPatient(true)}>
//           + Add New Patient
//         </button>
//       </div>

//       <div className="patient-controls">
//         <input
//           type="text"
//           placeholder="Search patients..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       <div className="patients-grid">
//         {filteredPatients.length === 0 ? (
//           <p>No patients found</p>
//         ) : (
//           filteredPatients.map((patient) => (
//             <PatientCard
//               key={patient.id}
//               patient={patient}
//               onViewDetails={() => setSelectedPatient(patient)}
//               onViewMedicalHistory={() => {
//                 setSelectedPatient(patient);
//                 setShowMedicalHistory(true);
//               }}
//             />
//           ))
//         )}
//       </div>

//       {showAddPatient && (
//         <AddPatientModal
//           onClose={() => setShowAddPatient(false)}
//           onSuccess={() => {
//             setShowAddPatient(false);
//             fetchPatients();
//           }}
//         />
//       )}

//       {selectedPatient && !showMedicalHistory && (
//         <PatientDetailsModal
//           patient={selectedPatient}
//           onClose={() => setSelectedPatient(null)}
//           onViewMedicalHistory={() => setShowMedicalHistory(true)}
//         />
//       )}

//       {selectedPatient && showMedicalHistory && (
//         <MedicalHistoryModal
//           patient={selectedPatient}
//           onClose={() => {
//             setSelectedPatient(null);
//             setShowMedicalHistory(false);
//           }}
//         />
//       )}
//     </div>
//   );
// };

// /* ===========================================================
//    PATIENT CARD
// =========================================================== */
// const PatientCard = ({ patient, onViewDetails, onViewMedicalHistory }) => {
//   return (
//     <div className="patient-card">
//       <h3>
//         {patient.first_name} {patient.last_name}
//       </h3>
//       <p>Phone: {patient.phone}</p>
//       <p>Email: {patient.email || "No email"}</p>
//       <p>Blood Group: {patient.blood_group || "Not set"}</p>

//       <button className="btn-outline" onClick={onViewDetails}>
//         View Details
//       </button>
//       <button className="btn-primary" onClick={onViewMedicalHistory}>
//         Medical History
//       </button>
//     </div>
//   );
// };

// /* ===========================================================
//    ADD PATIENT MODAL
// =========================================================== */
// const AddPatientModal = ({ onClose, onSuccess }) => {
//   const [form, setForm] = useState({
//     first_name: "",
//     last_name: "",
//     phone: "",
//     email: "",
//     dob: "",
//     gender: "",
//     address: "",
//     blood_group: "",
//     allergies: "",
//     medical_history: "",
//     emergency_contact_name: "",
//     emergency_contact_phone: "",
//     emergency_contact_relation: "",
//     insurance_provider: "",
//     insurance_policy_number: "",
//   });

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const submit = async (e) => {
//     e.preventDefault();
//     const req = await fetch(`${API_BASE}/api/patients`, {
//       method: "POST",
//       headers: getAuthHeaders(),
//       body: JSON.stringify(form),
//     });
//     const res = await req.json();

//     if (res.success) onSuccess();
//     else alert(res.message || "Failed to add patient");
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <h2>Add Patient</h2>

//         <form onSubmit={submit}>
//           <input name="first_name" placeholder="First Name *" value={form.first_name} onChange={handleChange} required />
//           <input name="last_name" placeholder="Last Name *" value={form.last_name} onChange={handleChange} required />
//           <input name="phone" placeholder="Phone *" value={form.phone} onChange={handleChange} required />
//           <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />

//           <input type="date" name="dob" value={form.dob} onChange={handleChange} />

//           <select name="gender" value={form.gender} onChange={handleChange}>
//             <option value="">Select gender</option>
//             <option>Male</option>
//             <option>Female</option>
//             <option>Other</option>
//           </select>

//           <input name="blood_group" placeholder="Blood Group" value={form.blood_group} onChange={handleChange} />

//           <textarea name="allergies" placeholder="Allergies" value={form.allergies} onChange={handleChange} />
//           <textarea name="medical_history" placeholder="Medical History" value={form.medical_history} onChange={handleChange} />

//           <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />

//           <h4>Emergency Contact</h4>
//           <input name="emergency_contact_name" placeholder="Name" value={form.emergency_contact_name} onChange={handleChange} />
//           <input name="emergency_contact_phone" placeholder="Phone" value={form.emergency_contact_phone} onChange={handleChange} />
//           <input name="emergency_contact_relation" placeholder="Relation" value={form.emergency_contact_relation} onChange={handleChange} />

//           <h4>Insurance</h4>
//           <input name="insurance_provider" placeholder="Provider" value={form.insurance_provider} onChange={handleChange} />
//           <input name="insurance_policy_number" placeholder="Policy Number" value={form.insurance_policy_number} onChange={handleChange} />

//           <button className="btn-primary" type="submit">Add Patient</button>
//           <button className="btn-cancel" type="button" onClick={onClose}>Cancel</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// /* ===========================================================
//    PATIENT DETAILS MODAL
// =========================================================== */
// const PatientDetailsModal = ({ patient, onClose, onViewMedicalHistory }) => {
//   return (
//     <div className="modal-overlay">
//       <div className="modal-content large">
//         <h2>Patient Details</h2>

//         <p><strong>Name:</strong> {patient.first_name} {patient.last_name}</p>
//         <p><strong>Phone:</strong> {patient.phone}</p>
//         <p><strong>Email:</strong> {patient.email || "None"}</p>
//         <p><strong>Gender:</strong> {patient.gender || "Not set"}</p>
//         <p><strong>DOB:</strong> {patient.dob || "Not set"}</p>
//         <p><strong>Blood Group:</strong> {patient.blood_group}</p>
//         <p><strong>Allergies:</strong> {patient.allergies || "None"}</p>
//         <p><strong>Medical History:</strong> {patient.medical_history || "None"}</p>

//         <button className="btn-primary" onClick={onViewMedicalHistory}>View Medical History</button>
//         <button className="btn-cancel" onClick={onClose}>Close</button>
//       </div>
//     </div>
//   );
// };

// /* ===========================================================
//    MEDICAL HISTORY MODAL
// =========================================================== */
// const MedicalHistoryModal = ({ patient, onClose }) => {
//   const [records, setRecords] = useState([]);
//   const [showAdd, setShowAdd] = useState(false);

//   const fetchHistory = async () => {
//     const req = await fetch(`${API_BASE}/api/patients/${patient.id}/medical-history`, {
//       headers: getAuthHeaders(),
//     });

//     const res = await req.json();
//     if (res.success) setRecords(res.data);
//   };

//   useEffect(() => {
//     fetchHistory();
//   }, []);

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content x-large">
//         <h2>Medical History – {patient.first_name}</h2>

//         <button className="btn-primary" onClick={() => setShowAdd(true)}>
//           + Add Record
//         </button>

//         {records.length === 0 ? (
//           <p>No medical history found</p>
//         ) : (
//           records.map((rec) => (
//             <div key={rec.id} className="medical-record">
//               <h4>{rec.visit_date}</h4>
//               <p><strong>Type:</strong> {rec.record_type}</p>
//               <p><strong>Diagnosis:</strong> {rec.diagnosis}</p>
//               <p><strong>Treatment:</strong> {rec.treatment}</p>
//               <p><strong>Notes:</strong> {rec.notes}</p>
//             </div>
//           ))
//         )}

//         {showAdd && (
//           <AddMedicalRecordModal
//             patient={patient}
//             onSuccess={() => {
//               setShowAdd(false);
//               fetchHistory();
//             }}
//             onClose={() => setShowAdd(false)}
//           />
//         )}

//         <button className="btn-cancel" onClick={onClose}>Close</button>
//       </div>
//     </div>
//   );
// };

// /* ===========================================================
//    ADD MEDICAL RECORD MODAL
// =========================================================== */
// const AddMedicalRecordModal = ({ patient, onClose, onSuccess }) => {
//   const [form, setForm] = useState({
//     visit_date: "",
//     record_type: "",
//     diagnosis: "",
//     treatment: "",
//     notes: "",
//   });

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const submit = async (e) => {
//     e.preventDefault();

//     const req = await fetch(`${API_BASE}/api/patients/${patient.id}/medical-history`, {
//       method: "POST",
//       headers: getAuthHeaders(),
//       body: JSON.stringify(form),
//     });

//     const res = await req.json();

//     if (res.success) onSuccess();
//     else alert(res.message || "Failed to add record");
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <h2>Add Medical Record</h2>

//         <form onSubmit={submit}>
//           <input type="date" name="visit_date" value={form.visit_date} onChange={handleChange} required />
//           <input name="record_type" placeholder="Record Type" value={form.record_type} onChange={handleChange} required />
//           <textarea name="diagnosis" placeholder="Diagnosis" value={form.diagnosis} onChange={handleChange} />
//           <textarea name="treatment" placeholder="Treatment" value={form.treatment} onChange={handleChange} />
//           <textarea name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} />

//           <button className="btn-primary" type="submit">Add Record</button>
//           <button className="btn-cancel" onClick={onClose} type="button">Cancel</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PatientManagement;

import React, { useEffect, useState } from "react";
import "./PatientManagement.css";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/* ===========================================================
   MAIN COMPONENT
=========================================================== */
const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showMedicalHistory, setShowMedicalHistory] = useState(false);

  const fetchPatients = async () => {
    try {
      const req = await fetch(`${API_BASE}/api/patients`, {
        headers: getAuthHeaders(),
      });

      const res = await req.json();
      if (res.success) setPatients(res.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter((p) => {
    const search = searchTerm.toLowerCase();
    return (
      p.first_name?.toLowerCase().includes(search) ||
      p.last_name?.toLowerCase().includes(search) ||
      p.email?.toLowerCase().includes(search) ||
      p.phone?.includes(search)
    );
  });

  if (loading) return <div className="loading-spinner">Loading patients...</div>;

  return (
    <div className="patient-management-container">
      <div className="patient-header">
        <h1>Patient Management</h1>
        <button className="btn-primary" onClick={() => setShowAddPatient(true)}>
          + Add New Patient
        </button>
      </div>

      <div className="patient-controls">
        <input
          type="text"
          placeholder="Search patients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="patients-grid">
        {filteredPatients.length === 0 ? (
          <p>No patients found</p>
        ) : (
          filteredPatients.map((patient) => (
            <PatientCard
              key={patient.id}
              patient={patient}
              onViewDetails={() => setSelectedPatient(patient)}
              onViewMedicalHistory={() => {
                setSelectedPatient(patient);
                setShowMedicalHistory(true);
              }}
            />
          ))
        )}
      </div>

      {showAddPatient && (
        <AddPatientModal
          onClose={() => setShowAddPatient(false)}
          onSuccess={() => {
            setShowAddPatient(false);
            fetchPatients();
          }}
        />
      )}

      {selectedPatient && !showMedicalHistory && (
        <PatientDetailsModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
          onViewMedicalHistory={() => setShowMedicalHistory(true)}
        />
      )}

      {selectedPatient && showMedicalHistory && (
        <MedicalHistoryModal
          patient={selectedPatient}
          onClose={() => {
            setSelectedPatient(null);
            setShowMedicalHistory(false);
          }}
        />
      )}
    </div>
  );
};

/* ===========================================================
   PATIENT CARD
=========================================================== */
const PatientCard = ({ patient, onViewDetails, onViewMedicalHistory }) => {
  return (
    <div className="patient-card">
      <h3>
        {patient.first_name} {patient.last_name}
      </h3>
      <p>Phone: {patient.phone}</p>
      <p>Email: {patient.email || "No email"}</p>
      <p>Blood Group: {patient.blood_group || "Not set"}</p>

      <button className="btn-outline" onClick={onViewDetails}>
        View Details
      </button>
      <button className="btn-primary" onClick={onViewMedicalHistory}>
        Medical History
      </button>
    </div>
  );
};

/* ===========================================================
   ADD PATIENT MODAL
=========================================================== */
const AddPatientModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    dob: "",
    gender: "",
    address: "",
    blood_group: "",
    allergies: "",
    medical_history: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    emergency_contact_relation: "",
    insurance_provider: "",
    insurance_policy_number: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();

    const req = await fetch(`${API_BASE}/api/patients`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(form),
    });

    const res = await req.json();

    if (res.success) onSuccess();
    else alert(res.message || "Failed to add patient");
  };

  return (
    <Modal title="Add Patient" onClose={onClose}>
      <form onSubmit={submit} className="modal-form">
        <input name="first_name" placeholder="First Name *" value={form.first_name} onChange={handleChange} required />
        <input name="last_name" placeholder="Last Name *" value={form.last_name} onChange={handleChange} required />
        <input name="phone" placeholder="Phone *" value={form.phone} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />

        <input type="date" name="dob" value={form.dob} onChange={handleChange} />

        <select name="gender" value={form.gender} onChange={handleChange}>
          <option value="">Select gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <input name="blood_group" placeholder="Blood Group" value={form.blood_group} onChange={handleChange} />

        <textarea name="allergies" placeholder="Allergies" value={form.allergies} onChange={handleChange} />
        <textarea name="medical_history" placeholder="Medical History" value={form.medical_history} onChange={handleChange} />

        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />

        <h4>Emergency Contact</h4>
        <input name="emergency_contact_name" placeholder="Name" value={form.emergency_contact_name} onChange={handleChange} />
        <input name="emergency_contact_phone" placeholder="Phone" value={form.emergency_contact_phone} onChange={handleChange} />
        <input name="emergency_contact_relation" placeholder="Relation" value={form.emergency_contact_relation} onChange={handleChange} />

        <h4>Insurance</h4>
        <input name="insurance_provider" placeholder="Provider" value={form.insurance_provider} onChange={handleChange} />
        <input name="insurance_policy_number" placeholder="Policy Number" value={form.insurance_policy_number} onChange={handleChange} />

        <div className="modal-actions">
          <button className="btn-primary" type="submit">Add Patient</button>
          <button className="btn-cancel" type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </Modal>
  );
};

/* ===========================================================
   PATIENT DETAILS MODAL
=========================================================== */
const PatientDetailsModal = ({ patient, onClose, onViewMedicalHistory }) => {
  return (
    <Modal title="Patient Details" onClose={onClose}>
      <p><strong>Name:</strong> {patient.first_name} {patient.last_name}</p>
      <p><strong>Phone:</strong> {patient.phone}</p>
      <p><strong>Email:</strong> {patient.email || "None"}</p>
      <p><strong>Gender:</strong> {patient.gender || "Not set"}</p>
      <p><strong>DOB:</strong> {patient.dob || "Not set"}</p>
      <p><strong>Blood Group:</strong> {patient.blood_group}</p>
      <p><strong>Allergies:</strong> {patient.allergies || "None"}</p>
      <p><strong>Medical History:</strong> {patient.medical_history || "None"}</p>

      <div className="modal-actions">
        <button className="btn-primary" onClick={onViewMedicalHistory}>View Medical History</button>
        <button className="btn-cancel" onClick={onClose}>Close</button>
      </div>
    </Modal>
  );
};

/* ===========================================================
   MEDICAL HISTORY MODAL
=========================================================== */
const MedicalHistoryModal = ({ patient, onClose }) => {
  const [records, setRecords] = useState([]);
  const [showAdd, setShowAdd] = useState(false);

  const fetchHistory = async () => {
    const req = await fetch(`${API_BASE}/api/patients/${patient.id}/medical-history`, {
      headers: getAuthHeaders(),
    });

    const res = await req.json();
    if (res.success) setRecords(res.data);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <Modal title={`Medical History – ${patient.first_name}`} onClose={onClose}>
      <button className="btn-primary" onClick={() => setShowAdd(true)}>
        + Add Record
      </button>

      {records.length === 0 ? (
        <p>No medical history found</p>
      ) : (
        records.map((rec) => (
          <div key={rec.id} className="medical-record">
            <h4>{rec.record_date}</h4>
            <p><strong>Type:</strong> {rec.record_type}</p>
            <p><strong>Description:</strong> {rec.description}</p>
            <p><strong>Diagnosis:</strong> {rec.diagnosis}</p>
            <p><strong>Treatment:</strong> {rec.treatment}</p>
            <p><strong>Notes:</strong> {rec.notes}</p>
          </div>
        ))
      )}

      {showAdd && (
        <AddMedicalRecordModal
          patient={patient}
          onSuccess={() => {
            setShowAdd(false);
            fetchHistory();
          }}
          onClose={() => setShowAdd(false)}
        />
      )}

      <button className="btn-cancel" onClick={onClose}>Close</button>
    </Modal>
  );
};

/* ===========================================================
   ADD MEDICAL RECORD MODAL
=========================================================== */
const AddMedicalRecordModal = ({ patient, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    record_date: "",
    record_type: "",
    description: "",
    diagnosis: "",
    treatment: "",
    notes: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();

    const req = await fetch(`${API_BASE}/api/patients/${patient.id}/medical-history`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(form),
    });

    const res = await req.json();

    if (res.success) onSuccess();
    else alert(res.message || "Failed to add record");
  };

  return (
    <Modal title="Add Medical Record" onClose={onClose}>
      <form onSubmit={submit} className="modal-form">
        <input type="date" name="record_date" value={form.record_date} onChange={handleChange} required />

        <input name="record_type" placeholder="Record Type" value={form.record_type} onChange={handleChange} required />

        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required />

        <textarea name="diagnosis" placeholder="Diagnosis" value={form.diagnosis} onChange={handleChange} />

        <textarea name="treatment" placeholder="Treatment" value={form.treatment} onChange={handleChange} />

        <textarea name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} />

        <div className="modal-actions">
          <button className="btn-primary" type="submit">Add Record</button>
          <button className="btn-cancel" type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </Modal>
  );
};

/* ===========================================================
   GENERIC MODAL COMPONENT
=========================================================== */
const Modal = ({ title, children, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content large">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default PatientManagement;
