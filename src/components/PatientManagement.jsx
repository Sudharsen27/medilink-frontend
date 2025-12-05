
// import React, { useEffect, useState } from "react";
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
//     <Modal title="Add Patient" onClose={onClose}>
//       <form onSubmit={submit} className="modal-form">
//         <input name="first_name" placeholder="First Name *" value={form.first_name} onChange={handleChange} required />
//         <input name="last_name" placeholder="Last Name *" value={form.last_name} onChange={handleChange} required />
//         <input name="phone" placeholder="Phone *" value={form.phone} onChange={handleChange} required />
//         <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />

//         <input type="date" name="dob" value={form.dob} onChange={handleChange} />

//         <select name="gender" value={form.gender} onChange={handleChange}>
//           <option value="">Select gender</option>
//           <option>Male</option>
//           <option>Female</option>
//           <option>Other</option>
//         </select>

//         <input name="blood_group" placeholder="Blood Group" value={form.blood_group} onChange={handleChange} />

//         <textarea name="allergies" placeholder="Allergies" value={form.allergies} onChange={handleChange} />
//         <textarea name="medical_history" placeholder="Medical History" value={form.medical_history} onChange={handleChange} />

//         <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />

//         <h4>Emergency Contact</h4>
//         <input name="emergency_contact_name" placeholder="Name" value={form.emergency_contact_name} onChange={handleChange} />
//         <input name="emergency_contact_phone" placeholder="Phone" value={form.emergency_contact_phone} onChange={handleChange} />
//         <input name="emergency_contact_relation" placeholder="Relation" value={form.emergency_contact_relation} onChange={handleChange} />

//         <h4>Insurance</h4>
//         <input name="insurance_provider" placeholder="Provider" value={form.insurance_provider} onChange={handleChange} />
//         <input name="insurance_policy_number" placeholder="Policy Number" value={form.insurance_policy_number} onChange={handleChange} />

//         <div className="modal-actions">
//           <button className="btn-primary" type="submit">Add Patient</button>
//           <button className="btn-cancel" type="button" onClick={onClose}>Cancel</button>
//         </div>
//       </form>
//     </Modal>
//   );
// };

// /* ===========================================================
//    PATIENT DETAILS MODAL
// =========================================================== */
// const PatientDetailsModal = ({ patient, onClose, onViewMedicalHistory }) => {
//   return (
//     <Modal title="Patient Details" onClose={onClose}>
//       <p><strong>Name:</strong> {patient.first_name} {patient.last_name}</p>
//       <p><strong>Phone:</strong> {patient.phone}</p>
//       <p><strong>Email:</strong> {patient.email || "None"}</p>
//       <p><strong>Gender:</strong> {patient.gender || "Not set"}</p>
//       <p><strong>DOB:</strong> {patient.dob || "Not set"}</p>
//       <p><strong>Blood Group:</strong> {patient.blood_group}</p>
//       <p><strong>Allergies:</strong> {patient.allergies || "None"}</p>
//       <p><strong>Medical History:</strong> {patient.medical_history || "None"}</p>

//       <div className="modal-actions">
//         <button className="btn-primary" onClick={onViewMedicalHistory}>View Medical History</button>
//         <button className="btn-cancel" onClick={onClose}>Close</button>
//       </div>
//     </Modal>
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
//     <Modal title={`Medical History – ${patient.first_name}`} onClose={onClose}>
//       <button className="btn-primary" onClick={() => setShowAdd(true)}>
//         + Add Record
//       </button>

//       {records.length === 0 ? (
//         <p>No medical history found</p>
//       ) : (
//         records.map((rec) => (
//           <div key={rec.id} className="medical-record">
//             <h4>{rec.record_date}</h4>
//             <p><strong>Type:</strong> {rec.record_type}</p>
//             <p><strong>Description:</strong> {rec.description}</p>
//             <p><strong>Diagnosis:</strong> {rec.diagnosis}</p>
//             <p><strong>Treatment:</strong> {rec.treatment}</p>
//             <p><strong>Notes:</strong> {rec.notes}</p>
//           </div>
//         ))
//       )}

//       {showAdd && (
//         <AddMedicalRecordModal
//           patient={patient}
//           onSuccess={() => {
//             setShowAdd(false);
//             fetchHistory();
//           }}
//           onClose={() => setShowAdd(false)}
//         />
//       )}

//       <button className="btn-cancel" onClick={onClose}>Close</button>
//     </Modal>
//   );
// };

// /* ===========================================================
//    ADD MEDICAL RECORD MODAL
// =========================================================== */
// const AddMedicalRecordModal = ({ patient, onClose, onSuccess }) => {
//   const [form, setForm] = useState({
//     record_date: "",
//     record_type: "",
//     description: "",
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
//     <Modal title="Add Medical Record" onClose={onClose}>
//       <form onSubmit={submit} className="modal-form">
//         <input type="date" name="record_date" value={form.record_date} onChange={handleChange} required />

//         <input name="record_type" placeholder="Record Type" value={form.record_type} onChange={handleChange} required />

//         <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required />

//         <textarea name="diagnosis" placeholder="Diagnosis" value={form.diagnosis} onChange={handleChange} />

//         <textarea name="treatment" placeholder="Treatment" value={form.treatment} onChange={handleChange} />

//         <textarea name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} />

//         <div className="modal-actions">
//           <button className="btn-primary" type="submit">Add Record</button>
//           <button className="btn-cancel" type="button" onClick={onClose}>Cancel</button>
//         </div>
//       </form>
//     </Modal>
//   );
// };

// /* ===========================================================
//    GENERIC MODAL COMPONENT
// =========================================================== */
// const Modal = ({ title, children, onClose }) => {
//   return (
//     <div className="modal-overlay">
//       <div className="modal-content large">
//         <div className="modal-header">
//           <h2>{title}</h2>
//           <button className="modal-close" onClick={onClose}>×</button>
//         </div>
//         <div>{children}</div>
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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading patients...</p>
      </div>
    );
  }

  return (
    <div className="patient-management-container">
      <div className="patient-header">
        <div className="header-content">
          <h1>Patient Management</h1>
          <p className="subtitle">{patients.length} Total Patients</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddPatient(true)}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Add New Patient
        </button>
      </div>

      <div className="patient-controls">
        <div className="search-box">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="patients-grid">
        {filteredPatients.length === 0 ? (
          <div className="empty-state">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="38" stroke="#e0e0e0" strokeWidth="4"/>
              <path d="M40 25v30M25 40h30" stroke="#e0e0e0" strokeWidth="4" strokeLinecap="round"/>
            </svg>
            <h3>No patients found</h3>
            <p>Try adjusting your search or add a new patient</p>
          </div>
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
      <div className="card-header-section">
        <div className="patient-avatar">
          {patient.first_name?.charAt(0)}{patient.last_name?.charAt(0)}
        </div>
        <div className="patient-name-section">
          <h3>{patient.first_name} {patient.last_name}</h3>
          <span className="blood-badge">{patient.blood_group || "N/A"}</span>
        </div>
      </div>

      <div className="patient-details">
        <div className="detail-item">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="3" y="3" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M6 6h6M6 9h6M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <div className="detail-text">
            <span className="detail-label">Phone</span>
            <span className="detail-value">{patient.phone}</span>
          </div>
        </div>

        <div className="detail-item">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M3 5l6 4 6-4M3 5v8a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V5M3 5l6-2 6 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className="detail-text">
            <span className="detail-label">Email</span>
            <span className="detail-value">{patient.email || "Not provided"}</span>
          </div>
        </div>
      </div>

      <div className="card-actions">
        <button className="btn-outline" onClick={onViewDetails}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="8" cy="8" r="2" fill="currentColor"/>
          </svg>
          View Details
        </button>
        <button className="btn-primary" onClick={onViewMedicalHistory}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M8 5v6M5 8h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Medical History
        </button>
      </div>
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
    <Modal title="Add New Patient" onClose={onClose}>
      <form onSubmit={submit} className="modal-form">
        <div className="form-section">
          <h4>Personal Information</h4>
          <div className="form-row">
            <div className="form-group">
              <label>First Name *</label>
              <input name="first_name" value={form.first_name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Last Name *</label>
              <input name="last_name" value={form.last_name} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Phone *</label>
              <input name="phone" value={form.phone} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Date of Birth</label>
              <input type="date" name="dob" value={form.dob} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange}>
                <option value="">Select gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Address</label>
            <input name="address" value={form.address} onChange={handleChange} />
          </div>
        </div>

        <div className="form-section">
          <h4>Medical Information</h4>
          <div className="form-group">
            <label>Blood Group</label>
            <input name="blood_group" value={form.blood_group} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Allergies</label>
            <textarea name="allergies" rows="2" value={form.allergies} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Medical History</label>
            <textarea name="medical_history" rows="3" value={form.medical_history} onChange={handleChange} />
          </div>
        </div>

        <div className="form-section">
          <h4>Emergency Contact</h4>
          <div className="form-row">
            <div className="form-group">
              <label>Contact Name</label>
              <input name="emergency_contact_name" value={form.emergency_contact_name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Contact Phone</label>
              <input name="emergency_contact_phone" value={form.emergency_contact_phone} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label>Relation</label>
            <input name="emergency_contact_relation" value={form.emergency_contact_relation} onChange={handleChange} />
          </div>
        </div>

        <div className="form-section">
          <h4>Insurance Information</h4>
          <div className="form-row">
            <div className="form-group">
              <label>Provider</label>
              <input name="insurance_provider" value={form.insurance_provider} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Policy Number</label>
              <input name="insurance_policy_number" value={form.insurance_policy_number} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" type="button" onClick={onClose}>Cancel</button>
          <button className="btn-primary" type="submit">Add Patient</button>
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
      <div className="patient-details-content">
        <div className="detail-section">
          <h4>Personal Information</h4>
          <div className="detail-grid">
            <div className="detail-row">
              <span className="label">Full Name</span>
              <span className="value">{patient.first_name} {patient.last_name}</span>
            </div>
            <div className="detail-row">
              <span className="label">Phone</span>
              <span className="value">{patient.phone}</span>
            </div>
            <div className="detail-row">
              <span className="label">Email</span>
              <span className="value">{patient.email || "None"}</span>
            </div>
            <div className="detail-row">
              <span className="label">Gender</span>
              <span className="value">{patient.gender || "Not set"}</span>
            </div>
            <div className="detail-row">
              <span className="label">Date of Birth</span>
              <span className="value">{patient.dob || "Not set"}</span>
            </div>
            <div className="detail-row">
              <span className="label">Blood Group</span>
              <span className="value">{patient.blood_group || "Not set"}</span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h4>Medical Information</h4>
          <div className="detail-row">
            <span className="label">Allergies</span>
            <span className="value">{patient.allergies || "None"}</span>
          </div>
          <div className="detail-row">
            <span className="label">Medical History</span>
            <span className="value">{patient.medical_history || "None"}</span>
          </div>
        </div>
      </div>

      <div className="modal-actions">
        <button className="btn-cancel" onClick={onClose}>Close</button>
        <button className="btn-primary" onClick={onViewMedicalHistory}>View Medical History</button>
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
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const req = await fetch(`${API_BASE}/api/patients/${patient.id}/medical-history`, {
        headers: getAuthHeaders(),
      });

      const res = await req.json();
      if (res.success) setRecords(res.data);
    } catch (error) {
      console.error("Error fetching medical history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <Modal title={`Medical History – ${patient.first_name} ${patient.last_name}`} onClose={onClose}>
      <div className="medical-history-header">
        <button className="btn-primary" onClick={() => setShowAdd(true)}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Add Record
        </button>
      </div>

      {loading ? (
        <div className="loading-small">Loading records...</div>
      ) : records.length === 0 ? (
        <div className="empty-state-small">
          <p>No medical history found</p>
        </div>
      ) : (
        <div className="medical-records-list">
          {records.map((rec) => (
            <div key={rec.id} className="medical-record">
              <div className="record-header">
                <span className="record-date">{rec.record_date}</span>
                <span className="record-type">{rec.record_type}</span>
              </div>
              <div className="record-content">
                {rec.description && (
                  <div className="record-field">
                    <strong>Description:</strong>
                    <p>{rec.description}</p>
                  </div>
                )}
                {rec.diagnosis && (
                  <div className="record-field">
                    <strong>Diagnosis:</strong>
                    <p>{rec.diagnosis}</p>
                  </div>
                )}
                {rec.treatment && (
                  <div className="record-field">
                    <strong>Treatment:</strong>
                    <p>{rec.treatment}</p>
                  </div>
                )}
                {rec.notes && (
                  <div className="record-field">
                    <strong>Notes:</strong>
                    <p>{rec.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
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

      <div className="modal-actions">
        <button className="btn-cancel" onClick={onClose}>Close</button>
      </div>
    </Modal>
  );
};

/* ===========================================================
   ADD MEDICAL RECORD MODAL
=========================================================== */
const AddMedicalRecordModal = ({ patient, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    record_date: new Date().toISOString().split('T')[0],
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
        <div className="form-row">
          <div className="form-group">
            <label>Date *</label>
            <input type="date" name="record_date" value={form.record_date} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Record Type *</label>
            <input name="record_type" placeholder="e.g., Consultation, Lab Test" value={form.record_type} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea name="description" rows="3" placeholder="Describe the visit or condition..." value={form.description} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Diagnosis</label>
          <textarea name="diagnosis" rows="2" placeholder="Enter diagnosis if applicable..." value={form.diagnosis} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Treatment</label>
          <textarea name="treatment" rows="2" placeholder="Enter treatment plan..." value={form.treatment} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Additional Notes</label>
          <textarea name="notes" rows="2" placeholder="Any additional notes..." value={form.notes} onChange={handleChange} />
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" type="button" onClick={onClose}>Cancel</button>
          <button className="btn-primary" type="submit">Add Record</button>
        </div>
      </form>
    </Modal>
  );
};

/* ===========================================================
   GENERIC MODAL COMPONENT
=========================================================== */
const Modal = ({ title, children, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default PatientManagement;