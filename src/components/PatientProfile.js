
import React, { useState } from 'react';
import { usePatientProfile } from '../context/PatientProfileContext';
import LoadingSpinner from './LoadingSpinner';
import './PatientProfile.css';

const PatientProfile = ({ user }) => {
  const {
    patientProfile,
    healthMetrics,
    loading,
    updateProfile,
    addHealthMetric,
    getBMI,
    getBMICategory,
    getAge
  } = usePatientProfile();

  const [activeTab, setActiveTab] = useState('overview');
  const [editingSection, setEditingSection] = useState(null);

  if (loading) {
    return (
      <div className="patient-profile-container">
        <LoadingSpinner text="Loading your profile..." />
      </div>
    );
  }

  const bmi = getBMI();
  const bmiCategory = getBMICategory(bmi);
  const age = getAge();

  return (
    <div className="patient-profile-container">
      {/* Header */}
      <div className="profile-header">
        <div className="header-main">
          <div className="header-text">
            <h1>Health Profile</h1>
            <p className="header-subtitle">Welcome back, {user?.name || 'Patient'}</p>
          </div>
          <div className="header-date">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
        
        <button 
          className="primary-button"
          onClick={() => setActiveTab('add-metric')}
        >
          <span className="button-icon">+</span>
          Record Health Data
        </button>
      </div>

      {/* Navigation Tabs */}
      <nav className="profile-nav">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'personal', label: 'Personal', icon: '👤' },
          { id: 'medical', label: 'Medical', icon: '🏥' },
          { id: 'metrics', label: 'Metrics', icon: '📈' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
          >
            <span className="nav-icon">{tab.icon}</span>
            <span className="nav-label">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="profile-content">
        {activeTab === 'overview' && (
          <OverviewTab 
            patientProfile={patientProfile}
            bmi={bmi}
            bmiCategory={bmiCategory}
            age={age}
            healthMetrics={healthMetrics}
          />
        )}
        
        {activeTab === 'personal' && (
          <PersonalInfoTab 
            patientProfile={patientProfile}
            editingSection={editingSection}
            setEditingSection={setEditingSection}
            updateProfile={updateProfile}
          />
        )}
        
        {activeTab === 'medical' && (
          <MedicalInfoTab 
            patientProfile={patientProfile}
            editingSection={editingSection}
            setEditingSection={setEditingSection}
            updateProfile={updateProfile}
          />
        )}
        
        {activeTab === 'metrics' && (
          <HealthMetricsTab 
            healthMetrics={healthMetrics}
            addHealthMetric={addHealthMetric}
            setActiveTab={setActiveTab}
          />
        )}
        
        {activeTab === 'add-metric' && (
          <AddMetricTab 
            addHealthMetric={addHealthMetric}
            onComplete={() => setActiveTab('metrics')}
          />
        )}
      </main>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ patientProfile, bmi, bmiCategory, age, healthMetrics }) => {
  const { getRecentMetrics, getMetricTrend } = usePatientProfile();

  const bloodPressureMetrics = getRecentMetrics('blood_pressure');
  const latestBP = bloodPressureMetrics[0];
  const weightMetrics = getRecentMetrics('weight');
  const latestWeight = weightMetrics[0];

  const StatCard = ({ icon, value, label, trend, className = '' }) => (
    <div className={`stat-card ${className}`}>
      <div className="stat-header">
        <div className="stat-icon">{icon}</div>
        {trend && <div className={`stat-trend ${trend}`}>{trend}</div>}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );

  return (
    <div className="overview-tab">
      {/* Key Health Stats */}
      <section className="stats-grid">
        <StatCard 
          icon="👤"
          value={age || 'N/A'}
          label="Age"
          className="age-card"
        />
        <StatCard 
          icon="🩸"
          value={patientProfile?.personal_info?.blood_type || 'N/A'}
          label="Blood Type"
          className="blood-card"
        />
        <StatCard 
          icon="⚖️"
          value={bmi || 'N/A'}
          label={
            <span>
              BMI {bmiCategory && (
                <span className={`bmi-badge ${bmiCategory.color}`}>
                  {bmiCategory.category}
                </span>
              )}
            </span>
          }
          className="bmi-card"
        />
        <StatCard 
          icon="📊"
          value={healthMetrics.length}
          label="Records"
          className="records-card"
        />
      </section>

      {/* Current Health Status */}
      <section className="health-status">
        <h2>Current Health Status</h2>
        <div className="status-grid">
          {latestBP && (
            <div className="status-card">
              <div className="status-header">
                <span className="status-icon">🩸</span>
                <h3>Blood Pressure</h3>
              </div>
              <div className="status-value">{latestBP.systolic}/{latestBP.diastolic}</div>
              <div className="status-unit">mmHg</div>
              <div className="status-trend">
                {getMetricTrend('blood_pressure')}
              </div>
            </div>
          )}
          
          {latestWeight && (
            <div className="status-card">
              <div className="status-header">
                <span className="status-icon">⚖️</span>
                <h3>Weight</h3>
              </div>
              <div className="status-value">{latestWeight.value}</div>
              <div className="status-unit">kg</div>
              <div className="status-trend">
                {getMetricTrend('weight')}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Medical Summary */}
      <div className="medical-summary">
        <div className="summary-column">
          <h3>Medical Conditions</h3>
          <div className="conditions-list">
            {patientProfile?.medical_history?.conditions?.length > 0 ? (
              patientProfile.medical_history.conditions.slice(0, 4).map(condition => (
                <span key={condition} className="medical-tag condition">
                  {condition}
                </span>
              ))
            ) : (
              <p className="no-data">No conditions recorded</p>
            )}
          </div>
        </div>
        
        <div className="summary-column">
          <h3>Allergies</h3>
          <div className="allergies-list">
            {patientProfile?.medical_history?.allergies?.length > 0 ? (
              patientProfile.medical_history.allergies.slice(0, 4).map(allergy => (
                <span key={allergy} className="medical-tag allergy">
                  {allergy}
                </span>
              ))
            ) : (
              <p className="no-data">No allergies recorded</p>
            )}
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      {patientProfile?.personal_info?.emergency_contact && (
        <section className="emergency-contact">
          <h2>Emergency Contact</h2>
          <div className="contact-card">
            <div className="contact-avatar">
              {patientProfile.personal_info.emergency_contact.name.charAt(0)}
            </div>
            <div className="contact-details">
              <div className="contact-name">
                {patientProfile.personal_info.emergency_contact.name}
              </div>
              <div className="contact-relationship">
                {patientProfile.personal_info.emergency_contact.relationship}
              </div>
              <div className="contact-phone">
                {patientProfile.personal_info.emergency_contact.phone}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

// Personal Information Tab
const PersonalInfoTab = ({ patientProfile, editingSection, setEditingSection, updateProfile }) => {
  const [formData, setFormData] = useState(patientProfile?.personal_info || {});

  const handleSave = async () => {
    try {
      await updateProfile({
        personal_info: formData
      });
      setEditingSection(null);
    } catch (error) {
      // Error handled in context
    }
  };

  const handleCancel = () => {
    setFormData(patientProfile?.personal_info || {});
    setEditingSection(null);
  };

  const personalFields = [
    { key: 'full_name', label: 'Full Name', type: 'text' },
    { key: 'date_of_birth', label: 'Date of Birth', type: 'date' },
    { 
      key: 'gender', 
      label: 'Gender', 
      type: 'select',
      options: ['', 'male', 'female', 'other', 'prefer_not_to_say']
    },
    { 
      key: 'blood_type', 
      label: 'Blood Type', 
      type: 'select',
      options: ['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    { key: 'height', label: 'Height (cm)', type: 'number' },
    { key: 'weight', label: 'Weight (kg)', type: 'number', step: '0.1' }
  ];

  return (
    <div className="personal-info-tab">
      <div className="section-header">
        <h2>Personal Information</h2>
        <div className="section-actions">
          {editingSection !== 'personal' ? (
            <button 
              onClick={() => setEditingSection('personal')}
              className="edit-button"
            >
              Edit
            </button>
          ) : (
            <>
              <button onClick={handleCancel} className="secondary-button">Cancel</button>
              <button onClick={handleSave} className="primary-button">Save Changes</button>
            </>
          )}
        </div>
      </div>

      <div className="form-grid">
        {personalFields.map(field => (
          <div key={field.key} className="form-field">
            <label className="field-label">{field.label}</label>
            {editingSection === 'personal' ? (
              field.type === 'select' ? (
                <select
                  value={formData[field.key] || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                  className="field-input"
                >
                  {field.options.map(option => (
                    <option key={option} value={option}>
                      {option === '' ? 'Select' : option.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  step={field.step}
                  value={formData[field.key] || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    [field.key]: field.type === 'number' ? 
                      (e.target.value ? parseFloat(e.target.value) : null) : 
                      e.target.value 
                  }))}
                  className="field-input"
                />
              )
            ) : (
              <div className="field-value">
                {field.key === 'date_of_birth' && patientProfile?.personal_info?.date_of_birth 
                  ? new Date(patientProfile.personal_info.date_of_birth).toLocaleDateString()
                  : field.key === 'height' && patientProfile?.personal_info?.height
                  ? `${patientProfile.personal_info.height} cm`
                  : field.key === 'weight' && patientProfile?.personal_info?.weight
                  ? `${patientProfile.personal_info.weight} kg`
                  : patientProfile?.personal_info?.[field.key] || 'Not set'
                }
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Emergency Contact */}
      <div className="emergency-section">
        <h3>Emergency Contact</h3>
        <div className="emergency-form">
          <div className="form-row">
            <div className="form-field">
              <label>Name</label>
              <input
                type="text"
                value={formData.emergency_contact?.name || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  emergency_contact: { ...prev.emergency_contact, name: e.target.value }
                }))}
                className="field-input"
                disabled={editingSection !== 'personal'}
              />
            </div>
            <div className="form-field">
              <label>Relationship</label>
              <input
                type="text"
                value={formData.emergency_contact?.relationship || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  emergency_contact: { ...prev.emergency_contact, relationship: e.target.value }
                }))}
                className="field-input"
                disabled={editingSection !== 'personal'}
              />
            </div>
          </div>
          <div className="form-field">
            <label>Phone Number</label>
            <input
              type="tel"
              value={formData.emergency_contact?.phone || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                emergency_contact: { ...prev.emergency_contact, phone: e.target.value }
              }))}
              className="field-input"
              disabled={editingSection !== 'personal'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};


// Medical Information Tab
const MedicalInfoTab = ({ patientProfile, editingSection, setEditingSection, updateProfile }) => {
  const [formData, setFormData] = useState({
    conditions: patientProfile?.medical_history?.conditions?.join(', ') || '',
    allergies: patientProfile?.medical_history?.allergies?.join(', ') || '',
    medications: patientProfile?.medical_history?.medications?.join(', ') || '',
    surgeries: patientProfile?.medical_history?.surgeries?.join(', ') || ''
  });

  const handleSave = async () => {
    try {
      const medicalHistory = {
        conditions: formData.conditions.split(',').map(item => item.trim()).filter(item => item),
        allergies: formData.allergies.split(',').map(item => item.trim()).filter(item => item),
        medications: formData.medications.split(',').map(item => item.trim()).filter(item => item),
        surgeries: formData.surgeries.split(',').map(item => item.trim()).filter(item => item)
      };

      await updateProfile({
        medical_history: medicalHistory
      });
      setEditingSection(null);
    } catch (error) {
      // Error handled in context
    }
  };

  const handleCancel = () => {
    setFormData({
      conditions: patientProfile?.medical_history?.conditions?.join(', ') || '',
      allergies: patientProfile?.medical_history?.allergies?.join(', ') || '',
      medications: patientProfile?.medical_history?.medications?.join(', ') || '',
      surgeries: patientProfile?.medical_history?.surgeries?.join(', ') || ''
    });
    setEditingSection(null);
  };

  return (
    <div className="medical-info-tab">
      <div className="section-header">
        <h2>Medical History</h2>
        {editingSection !== 'medical' ? (
          <button 
            onClick={() => setEditingSection('medical')}
            className="btn-edit"
          >
            ✏️ Edit
          </button>
        ) : (
          <div className="edit-actions">
            <button onClick={handleCancel} className="btn-cancel">Cancel</button>
            <button onClick={handleSave} className="btn-save">Save</button>
          </div>
        )}
      </div>

      <div className="medical-sections">
        <div className="medical-section">
          <h3>Medical Conditions</h3>
          {editingSection === 'medical' ? (
            <textarea
              value={formData.conditions}
              onChange={(e) => setFormData(prev => ({ ...prev, conditions: e.target.value }))}
              placeholder="Enter conditions separated by commas (e.g., Diabetes, Hypertension)"
              rows="3"
            />
          ) : (
            <div className="tags-list">
              {patientProfile?.medical_history?.conditions?.map(condition => (
                <span key={condition} className="medical-tag">{condition}</span>
              )) || <div className="no-data">No conditions recorded</div>}
            </div>
          )}
        </div>

        <div className="medical-section">
          <h3>Allergies</h3>
          {editingSection === 'medical' ? (
            <textarea
              value={formData.allergies}
              onChange={(e) => setFormData(prev => ({ ...prev, allergies: e.target.value }))}
              placeholder="Enter allergies separated by commas (e.g., Penicillin, Peanuts)"
              rows="3"
            />
          ) : (
            <div className="tags-list">
              {patientProfile?.medical_history?.allergies?.map(allergy => (
                <span key={allergy} className="medical-tag allergy">{allergy}</span>
              )) || <div className="no-data">No allergies recorded</div>}
            </div>
          )}
        </div>

        <div className="medical-section">
          <h3>Current Medications</h3>
          {editingSection === 'medical' ? (
            <textarea
              value={formData.medications}
              onChange={(e) => setFormData(prev => ({ ...prev, medications: e.target.value }))}
              placeholder="Enter medications separated by commas (e.g., Metformin, Lisinopril)"
              rows="3"
            />
          ) : (
            <div className="tags-list">
              {patientProfile?.medical_history?.medications?.map(medication => (
                <span key={medication} className="medical-tag medication">{medication}</span>
              )) || <div className="no-data">No medications recorded</div>}
            </div>
          )}
        </div>

        <div className="medical-section">
          <h3>Past Surgeries</h3>
          {editingSection === 'medical' ? (
            <textarea
              value={formData.surgeries}
              onChange={(e) => setFormData(prev => ({ ...prev, surgeries: e.target.value }))}
              placeholder="Enter surgeries separated by commas (e.g., Appendectomy, Knee Replacement)"
              rows="3"
            />
          ) : (
            <div className="tags-list">
              {patientProfile?.medical_history?.surgeries?.map(surgery => (
                <span key={surgery} className="medical-tag surgery">{surgery}</span>
              )) || <div className="no-data">No surgeries recorded</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Health Metrics Tab
const HealthMetricsTab = ({ healthMetrics, addHealthMetric }) => {
  const { getRecentMetrics } = usePatientProfile();

  const metricTypes = {
    blood_pressure: { label: 'Blood Pressure', unit: 'mmHg', icon: '🩸' },
    weight: { label: 'Weight', unit: 'kg', icon: '⚖️' },
    heart_rate: { label: 'Heart Rate', unit: 'bpm', icon: '💓' },
    blood_sugar: { label: 'Blood Sugar', unit: 'mg/dL', icon: '🩸' },
    temperature: { label: 'Temperature', unit: '°C', icon: '🌡️' }
  };

  return (
    <div className="health-metrics-tab">
      <div className="metrics-header">
        <h2>Health Metrics History</h2>
        <button 
          onClick={() => window.location.hash = 'add-metric'}
          className="btn-primary"
        >
          + Add New Metric
        </button>
      </div>

      <div className="metrics-overview">
        {Object.entries(metricTypes).map(([type, info]) => {
          const recentMetrics = getRecentMetrics(type, 1);
          const latestMetric = recentMetrics[0];
          
          return (
            <div key={type} className="metric-overview-card">
              <div className="metric-icon">{info.icon}</div>
              <div className="metric-info">
                <h4>{info.label}</h4>
                {latestMetric ? (
                  <>
                    <div className="metric-value">
                      {type === 'blood_pressure' 
                        ? `${latestMetric.systolic}/${latestMetric.diastolic}`
                        : latestMetric.value
                      } {info.unit}
                    </div>
                    <div className="metric-date">
                      {new Date(latestMetric.recorded_at).toLocaleDateString()}
                    </div>
                  </>
                ) : (
                  <div className="no-data">No data recorded</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="metrics-history">
        <h3>Recent Records</h3>
        {healthMetrics.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h4>No health metrics recorded</h4>
            <p>Start tracking your health by adding your first metric</p>
          </div>
        ) : (
          <div className="metrics-table">
            {healthMetrics.slice(0, 10).map(metric => (
              <div key={metric.id} className="metric-row">
                <div className="metric-type">
                  <span className="metric-icon-small">
                    {metricTypes[metric.metric_type]?.icon || '📊'}
                  </span>
                  {metricTypes[metric.metric_type]?.label || metric.metric_type}
                </div>
                <div className="metric-value-display">
                  {metric.metric_type === 'blood_pressure' 
                    ? `${metric.systolic}/${metric.diastolic} mmHg`
                    : `${metric.value} ${metricTypes[metric.metric_type]?.unit || ''}`
                  }
                </div>
                <div className="metric-date">
                  {new Date(metric.recorded_at).toLocaleDateString()}
                </div>
                <div className="metric-notes">
                  {metric.notes || '-'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Add Metric Tab
const AddMetricTab = ({ addHealthMetric, onComplete }) => {
  const [formData, setFormData] = useState({
    metric_type: 'blood_pressure',
    value: '',
    systolic: '',
    diastolic: '',
    unit: '',
    notes: '',
    recorded_at: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let metricData = {
        metric_type: formData.metric_type,
        notes: formData.notes,
        recorded_at: formData.recorded_at
      };

      if (formData.metric_type === 'blood_pressure') {
        metricData.systolic = parseInt(formData.systolic);
        metricData.diastolic = parseInt(formData.diastolic);
      } else {
        metricData.value = parseFloat(formData.value);
        metricData.unit = formData.unit;
      }

      await addHealthMetric(metricData);
      onComplete();
    } catch (error) {
      // Error handled in context
    }
  };

  const metricTypes = [
    { value: 'blood_pressure', label: 'Blood Pressure', unit: 'mmHg' },
    { value: 'weight', label: 'Weight', unit: 'kg' },
    { value: 'heart_rate', label: 'Heart Rate', unit: 'bpm' },
    { value: 'blood_sugar', label: 'Blood Sugar', unit: 'mg/dL' },
    { value: 'temperature', label: 'Temperature', unit: '°C' }
  ];

  return (
    <div className="add-metric-tab">
      <div className="section-header">
        <h2>Add Health Metric</h2>
        <button onClick={onComplete} className="btn-cancel">
          ← Back to Metrics
        </button>
      </div>

      <form onSubmit={handleSubmit} className="metric-form">
        <div className="form-group">
          <label>Metric Type</label>
          <select
            value={formData.metric_type}
            onChange={(e) => setFormData(prev => ({ ...prev, metric_type: e.target.value }))}
            required
          >
            {metricTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Date Recorded</label>
          <input
            type="date"
            value={formData.recorded_at}
            onChange={(e) => setFormData(prev => ({ ...prev, recorded_at: e.target.value }))}
            required
          />
        </div>

        {formData.metric_type === 'blood_pressure' ? (
          <div className="form-row">
            <div className="form-group">
              <label>Systolic (mm/Hg)</label>
              <input
                type="number"
                value={formData.systolic}
                onChange={(e) => setFormData(prev => ({ ...prev, systolic: e.target.value }))}
                placeholder="120"
                required
              />
            </div>
            <div className="form-group">
              <label>Diastolic (mm/Hg)</label>
              <input
                type="number"
                value={formData.diastolic}
                onChange={(e) => setFormData(prev => ({ ...prev, diastolic: e.target.value }))}
                placeholder="80"
                required
              />
            </div>
          </div>
        ) : (
          <div className="form-row">
            <div className="form-group">
              <label>Value</label>
              <input
                type="number"
                step="0.1"
                value={formData.value}
                onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                placeholder="Enter value"
                required
              />
            </div>
            <div className="form-group">
              <label>Unit</label>
              <input
                type="text"
                value={formData.unit || metricTypes.find(t => t.value === formData.metric_type)?.unit || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                placeholder="Unit"
                required
              />
            </div>
          </div>
        )}

        <div className="form-group">
          <label>Notes (Optional)</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Any additional notes..."
            rows="3"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Save Metric
          </button>
          <button type="button" onClick={onComplete} className="btn-cancel">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientProfile;