// PatientManagement.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Users,
  CalendarCheck,
  UserPlus,
  Phone,
  Mail,
  Plus,
} from 'lucide-react';
import { API_BASE_URL } from '../config/api';
import { useToast } from '../context/ToastContext';
import PageContainer from '../ui/PageContainer';
import Card from '../ui/Card';
import Button from '../ui/Button';
import SearchInput from '../ui/SearchInput';
import EmptyState from '../ui/EmptyState';
import './PatientManagement.css';

const API_BASE = API_BASE_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const getPatientName = (patient) => {
  const fromParts = [patient.first_name, patient.last_name].filter(Boolean).join(' ').trim();
  return fromParts || patient.name || 'Unknown patient';
};

const getPatientInitial = (patient) => getPatientName(patient).charAt(0).toUpperCase();

const getPatientAge = (patient) => {
  if (patient.age != null && patient.age !== '') return `${patient.age} yrs`;
  const dob = patient.date_of_birth || patient.dob;
  if (!dob) return null;
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
  return `${age} yrs`;
};

const matchesPatientSearch = (patient, term) => {
  if (!term) return true;
  const q = term.toLowerCase();
  return (
    getPatientName(patient).toLowerCase().includes(q) ||
    patient.email?.toLowerCase().includes(q) ||
    patient.phone?.includes(term)
  );
};

const StatCard = ({ icon: Icon, label, value, accent }) => {
  const accents = {
    violet: 'from-violet-500/15 via-violet-500/5 to-transparent border-violet-200/50 dark:border-violet-800/40',
    blue: 'from-blue-500/15 via-blue-500/5 to-transparent border-blue-200/50 dark:border-blue-800/40',
    health: 'from-health-500/15 via-health-500/5 to-transparent border-health-200/50 dark:border-health-800/40',
  };
  const iconColors = {
    violet: 'bg-clinical-violet text-white',
    blue: 'bg-clinical-blue text-white',
    health: 'bg-health-600 text-white',
  };

  return (
    <div className={`rounded-2xl border bg-gradient-to-br p-5 ${accents[accent]}`}>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-soft ${iconColors[accent]}`}>
        <Icon className="w-5 h-5" aria-hidden="true" />
      </div>
      <p className="mt-4 text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">{label}</p>
    </div>
  );
};

const FilterTab = ({ label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
      active
        ? 'bg-health-600 text-white shadow-soft'
        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-health-300 dark:hover:border-health-700'
    }`}
    aria-pressed={active}
  >
    {label}
  </button>
);

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showMedicalHistory, setShowMedicalHistory] = useState(false);

  const fetchPatients = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/api/patients`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const result = await response.json();
      if (result.success) {
        setPatients(result.data);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const thirtyDaysAgo = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d;
  }, []);

  const activeCount = useMemo(
    () =>
      patients.filter((p) => {
        const lastVisit = p.last_visit ? new Date(p.last_visit) : null;
        return lastVisit && lastVisit > thirtyDaysAgo;
      }).length,
    [patients, thirtyDaysAgo]
  );

  const newThisMonth = useMemo(
    () =>
      patients.filter((p) => {
        const created = p.created_at ? new Date(p.created_at) : null;
        return created && created > thirtyDaysAgo;
      }).length,
    [patients, thirtyDaysAgo]
  );

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      if (!matchesPatientSearch(patient, searchTerm)) return false;
      if (activeTab === 'recent') {
        const lastVisit = patient.last_visit ? new Date(patient.last_visit) : null;
        return lastVisit && lastVisit > thirtyDaysAgo;
      }
      return true;
    });
  }, [patients, searchTerm, activeTab, thirtyDaysAgo]);

  if (loading) {
    return (
      <PageContainer className="pb-12">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-64 bg-slate-200 dark:bg-slate-700 rounded-xl" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
            ))}
          </div>
          <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-56 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
            ))}
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="pb-12">
      <div className="mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-health-600 dark:text-health-400 uppercase tracking-wide mb-1">
            Staff portal
          </p>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-slate-900 dark:text-white">
            Patient Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xl">
            Manage patient records, contact details, and medical history in one place.
          </p>
        </div>
        <Button onClick={() => setShowAddPatient(true)} icon={Plus}>
          Add New Patient
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon={Users} label="Total Patients" value={patients.length} accent="violet" />
        <StatCard icon={CalendarCheck} label="Active (30 days)" value={activeCount} accent="blue" />
        <StatCard icon={UserPlus} label="New This Month" value={newThisMonth} accent="health" />
      </div>

      <Card glass padding="md" className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <SearchInput
            placeholder="Search by name, email, or phone..."
            onSearch={setSearchTerm}
            className="flex-1 w-full"
          />
          <div className="flex flex-wrap gap-2 shrink-0">
            <FilterTab
              label="All Patients"
              active={activeTab === 'all'}
              onClick={() => setActiveTab('all')}
            />
            <FilterTab
              label="Recent Visits"
              active={activeTab === 'recent'}
              onClick={() => setActiveTab('recent')}
            />
          </div>
        </div>
      </Card>

      {filteredPatients.length === 0 ? (
        <Card padding="lg">
          <EmptyState
            icon={Users}
            title="No patients found"
            description={
              searchTerm || activeTab === 'recent'
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by adding your first patient.'
            }
            actionLabel={searchTerm || activeTab === 'recent' ? undefined : 'Add First Patient'}
            onAction={searchTerm || activeTab === 'recent' ? undefined : () => setShowAddPatient(true)}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredPatients.map((patient) => (
            <PatientCard
              key={patient.id}
              patient={patient}
              onViewDetails={() => setSelectedPatient(patient)}
              onViewMedicalHistory={() => {
                setSelectedPatient(patient);
                setShowMedicalHistory(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Modals */}
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
          onEdit={() => {
            // Implement edit functionality
          }}
          onViewMedicalHistory={() => {
            setShowMedicalHistory(true);
          }}
        />
      )}

      {selectedPatient && showMedicalHistory && (
        <MedicalHistoryModal
          patient={selectedPatient}
          onClose={() => {
            setShowMedicalHistory(false);
            setSelectedPatient(null);
          }}
        />
      )}
    </PageContainer>
  );
};

const PatientCard = ({ patient, onViewDetails, onViewMedicalHistory }) => {
  const name = getPatientName(patient);
  const age = getPatientAge(patient);

  return (
    <Card padding="md" hover className="flex flex-col h-full">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-health-600 text-white flex items-center justify-center text-lg font-bold shrink-0">
          {getPatientInitial(patient)}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-slate-900 dark:text-white truncate">{name}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {age || 'Age not set'} · {patient.gender || 'Not specified'}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-2 min-w-0">
          <Phone className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
          <span className="truncate">{patient.phone || 'No phone'}</span>
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <Mail className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
          <span className="truncate">{patient.email || 'No email'}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/60 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wide">Last visit</p>
          <p className="font-medium text-slate-700 dark:text-slate-200">
            {patient.last_visit ? new Date(patient.last_visit).toLocaleDateString() : 'Never'}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wide">Blood type</p>
          <p className="font-medium text-slate-700 dark:text-slate-200">
            {patient.blood_type || 'Not set'}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row gap-2 mt-auto pt-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={onViewDetails}>
          View Details
        </Button>
        <Button size="sm" className="flex-1" onClick={onViewMedicalHistory}>
          Medical History
        </Button>
      </div>
    </Card>
  );
};

// Add Patient Modal Component
const AddPatientModal = ({ onClose, onSuccess }) => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    blood_type: '',
    allergies: '',
    medical_conditions: '',
    emergency_contact_name: '',
    emergency_contact_phone: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/patients`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      if (result.success) {
        onSuccess();
      } else {
        addToast(result.message || 'Failed to add patient', 'error');
      }
    } catch (error) {
      console.error('Error adding patient:', error);
      addToast('Failed to add patient', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Patient</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="patient-form">
          <div className="form-grid">
            <div className="form-group">
              <label>First Name *</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Blood Type</label>
              <select
                name="blood_type"
                value={formData.blood_type}
                onChange={handleChange}
              >
                <option value="">Select Blood Type</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Allergies</label>
            <textarea
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              placeholder="List any known allergies..."
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Medical Conditions</label>
            <textarea
              name="medical_conditions"
              value={formData.medical_conditions}
              onChange={handleChange}
              placeholder="List any existing medical conditions..."
              rows="3"
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Emergency Contact Name</label>
              <input
                type="text"
                name="emergency_contact_name"
                value={formData.emergency_contact_name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Emergency Contact Phone</label>
              <input
                type="tel"
                name="emergency_contact_phone"
                value={formData.emergency_contact_phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Adding...' : 'Add Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Patient Details Modal Component
const PatientDetailsModal = ({ patient, onClose, onEdit, onViewMedicalHistory }) => {
  const name = getPatientName(patient);
  const age = getPatientAge(patient);

  return (
    <div className="modal-overlay">
      <div className="modal-content large">
        <div className="modal-header">
          <h2>Patient Details</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="patient-details">
          <div className="details-section">
            <h3>Personal Information</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="label">Full Name:</span>
                <span className="value">{name}</span>
              </div>
              <div className="detail-item">
                <span className="label">Age:</span>
                <span className="value">{age || 'Not specified'}</span>
              </div>
              <div className="detail-item">
                <span className="label">Gender:</span>
                <span className="value">{patient.gender || 'Not specified'}</span>
              </div>
              <div className="detail-item">
                <span className="label">Blood Type:</span>
                <span className="value">{patient.blood_type || 'Not specified'}</span>
              </div>
            </div>
          </div>

          <div className="details-section">
            <h3>Contact Information</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="label">Phone:</span>
                <span className="value">{patient.phone || 'Not provided'}</span>
              </div>
              <div className="detail-item">
                <span className="label">Email:</span>
                <span className="value">{patient.email || 'Not provided'}</span>
              </div>
            </div>
          </div>

          <div className="details-section">
            <h3>Medical Information</h3>
            <div className="details-grid full-width">
              <div className="detail-item">
                <span className="label">Allergies:</span>
                <span className="value">{patient.allergies || 'None recorded'}</span>
              </div>
              <div className="detail-item">
                <span className="label">Medical Conditions:</span>
                <span className="value">{patient.medical_conditions || 'None recorded'}</span>
              </div>
            </div>
          </div>

          {patient.emergency_contact_name && (
            <div className="details-section">
              <h3>Emergency Contact</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="label">Name:</span>
                  <span className="value">{patient.emergency_contact_name}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Phone:</span>
                  <span className="value">{patient.emergency_contact_phone}</span>
                </div>
              </div>
            </div>
          )}

          <div className="details-section">
            <h3>Visit History</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="label">Last Visit:</span>
                <span className="value">
                  {patient.last_visit 
                    ? new Date(patient.last_visit).toLocaleDateString() 
                    : 'No visits recorded'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-outline" onClick={onClose}>
            Close
          </button>
          <button className="btn-primary" onClick={onViewMedicalHistory}>
            View Medical History
          </button>
        </div>
      </div>
    </div>
  );
};

// Medical History Modal Component
const MedicalHistoryModal = ({ patient, onClose }) => {
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [showAddRecord, setShowAddRecord] = useState(false);

  const fetchMedicalHistory = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/api/patients/${patient.id}/medical-history`, {
        headers: getAuthHeaders(),
      });
      const result = await response.json();
      if (result.success) {
        setMedicalHistory(result.data);
      }
    } catch (error) {
      console.error('Error fetching medical history:', error);
    }
  }, [patient.id]);

  useEffect(() => {
    fetchMedicalHistory();
  }, [fetchMedicalHistory]);

  return (
    <div className="modal-overlay">
      <div className="modal-content x-large">
        <div className="modal-header">
          <h2>Medical History — {getPatientName(patient)}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="medical-history-header">
          <button 
            className="btn-primary"
            onClick={() => setShowAddRecord(true)}
          >
            + Add Medical Record
          </button>
        </div>

        <div className="medical-history-list">
          {medicalHistory.length === 0 ? (
            <div className="empty-state">
              <p>No medical records found</p>
            </div>
          ) : (
            medicalHistory.map(record => (
              <div key={record.id} className="medical-record">
                <div className="record-header">
                  <h4>{record.visit_date ? new Date(record.visit_date).toLocaleDateString() : 'Undated'}</h4>
                  <span className={`record-type ${record.record_type}`}>
                    {record.record_type}
                  </span>
                </div>
                <div className="record-content">
                  <p><strong>Diagnosis:</strong> {record.diagnosis || 'Not specified'}</p>
                  <p><strong>Treatment:</strong> {record.treatment || 'Not specified'}</p>
                  <p><strong>Notes:</strong> {record.notes || 'No additional notes'}</p>
                  {record.prescriptions && record.prescriptions.length > 0 && (
                    <div className="prescriptions">
                      <strong>Prescriptions:</strong>
                      <ul>
                        {record.prescriptions.map((prescription, index) => (
                          <li key={index}>
                            {prescription.medicine} - {prescription.dosage} ({prescription.frequency})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {showAddRecord && (
          <AddMedicalRecordModal
            patient={patient}
            onClose={() => setShowAddRecord(false)}
            onSuccess={() => {
              setShowAddRecord(false);
              fetchMedicalHistory();
            }}
          />
        )}

        <div className="modal-actions">
          <button className="btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Add Medical Record Modal Component
const AddMedicalRecordModal = ({ patient, onClose, onSuccess }) => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    visit_date: '',
    record_type: '',
    diagnosis: '',
    treatment: '',
    notes: '',
    prescriptions: []
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/patients/${patient.id}/medical-history`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      if (result.success) {
        onSuccess();
      } else {
        addToast(result.message || 'Failed to add medical record', 'error');
      }
    } catch (error) {
      console.error('Error adding medical record:', error);
      addToast('Failed to add medical record', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add Medical Record</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="patient-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Visit Date *</label>
              <input
                type="date"
                name="visit_date"
                value={formData.visit_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Record Type *</label>
              <select
                name="record_type"
                value={formData.record_type}
                onChange={handleChange}
                required
              >
                <option value="">Select Type</option>
                <option value="Consultation">Consultation</option>
                <option value="Lab Test">Lab Test</option>
                <option value="Diagnosis">Diagnosis</option>
                <option value="Treatment">Treatment</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Diagnosis</label>
            <textarea
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              placeholder="Enter diagnosis..."
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Treatment</label>
            <textarea
              name="treatment"
              value={formData.treatment}
              onChange={handleChange}
              placeholder="Enter treatment details..."
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes..."
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Adding...' : 'Add Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientManagement;