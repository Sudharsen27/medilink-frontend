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
        <div className="header-content">
          <h1>My Health Profile</h1>
          <p>Manage your personal and medical information</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setActiveTab('add-metric')}>
            + Add Health Metric
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
        >
          📊 Overview
        </button>
        <button
          onClick={() => setActiveTab('personal')}
          className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
        >
          👤 Personal
        </button>
        <button
          onClick={() => setActiveTab('medical')}
          className={`tab-btn ${activeTab === 'medical' ? 'active' : ''}`}
        >
          🏥 Medical
        </button>
        <button
          onClick={() => setActiveTab('metrics')}
          className={`tab-btn ${activeTab === 'metrics' ? 'active' : ''}`}
        >
          📈 Health Metrics
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
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
          />
        )}
        
        {activeTab === 'add-metric' && (
          <AddMetricTab 
            addHealthMetric={addHealthMetric}
            onComplete={() => setActiveTab('metrics')}
          />
        )}
      </div>
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

  return (
    <div className="overview-tab">
      {/* Health Summary Cards */}
      <div className="health-summary-cards">
        <div className="summary-card">
          <div className="summary-icon">👤</div>
          <div className="summary-content">
            <div className="summary-value">{age || 'N/A'}</div>
            <div className="summary-label">Age</div>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon">🩸</div>
          <div className="summary-content">
            <div className="summary-value">
              {patientProfile?.personal_info?.blood_type || 'N/A'}
            </div>
            <div className="summary-label">Blood Type</div>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon">⚖️</div>
          <div className="summary-content">
            <div className="summary-value">{bmi || 'N/A'}</div>
            <div className="summary-label">
              BMI {bmiCategory && (
                <span className={`bmi-category ${bmiCategory.color}`}>
                  ({bmiCategory.category})
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon">📊</div>
          <div className="summary-content">
            <div className="summary-value">{healthMetrics.length}</div>
            <div className="summary-label">Metrics Recorded</div>
          </div>
        </div>
      </div>

      {/* Recent Metrics */}
      <div className="recent-metrics-section">
        <h3>Recent Health Metrics</h3>
        
        <div className="metrics-grid">
          {latestBP && (
            <div className="metric-card">
              <h4>Blood Pressure</h4>
              <div className="metric-value">
                {latestBP.systolic}/{latestBP.diastolic} mmHg
              </div>
              <div className="metric-trend">
                Trend: {getMetricTrend('blood_pressure')}
              </div>
            </div>
          )}
          
          {latestWeight && (
            <div className="metric-card">
              <h4>Weight</h4>
              <div className="metric-value">
                {latestWeight.value} kg
              </div>
              <div className="metric-trend">
                Trend: {getMetricTrend('weight')}
              </div>
            </div>
          )}
          
          {patientProfile?.medical_history?.conditions?.length > 0 && (
            <div className="metric-card">
              <h4>Medical Conditions</h4>
              <div className="metric-value">
                {patientProfile.medical_history.conditions.length}
              </div>
              <div className="conditions-list">
                {patientProfile.medical_history.conditions.slice(0, 3).map(condition => (
                  <span key={condition} className="condition-tag">{condition}</span>
                ))}
              </div>
            </div>
          )}
          
          {patientProfile?.medical_history?.allergies?.length > 0 && (
            <div className="metric-card">
              <h4>Allergies</h4>
              <div className="metric-value">
                {patientProfile.medical_history.allergies.length}
              </div>
              <div className="allergies-list">
                {patientProfile.medical_history.allergies.slice(0, 3).map(allergy => (
                  <span key={allergy} className="allergy-tag">{allergy}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Emergency Contact */}
      {patientProfile?.personal_info?.emergency_contact && (
        <div className="emergency-contact-section">
          <h3>Emergency Contact</h3>
          <div className="emergency-contact-card">
            <div className="contact-name">
              {patientProfile.personal_info.emergency_contact.name}
            </div>
            <div className="contact-relationship">
              {patientProfile.personal_info.emergency_contact.relationship}
            </div>
            <div className="contact-phone">
              📞 {patientProfile.personal_info.emergency_contact.phone}
            </div>
          </div>
        </div>
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

  return (
    <div className="personal-info-tab">
      <div className="section-header">
        <h2>Personal Information</h2>
        {editingSection !== 'personal' ? (
          <button 
            onClick={() => setEditingSection('personal')}
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

      <div className="info-grid">
        <div className="info-group">
          <label>Full Name</label>
          {editingSection === 'personal' ? (
            <input
              type="text"
              value={formData.full_name || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
            />
          ) : (
            <div className="info-value">{patientProfile?.personal_info?.full_name || 'Not set'}</div>
          )}
        </div>

        <div className="info-group">
          <label>Date of Birth</label>
          {editingSection === 'personal' ? (
            <input
              type="date"
              value={formData.date_of_birth || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
            />
          ) : (
            <div className="info-value">
              {patientProfile?.personal_info?.date_of_birth 
                ? new Date(patientProfile.personal_info.date_of_birth).toLocaleDateString()
                : 'Not set'
              }
            </div>
          )}
        </div>

        <div className="info-group">
          <label>Gender</label>
          {editingSection === 'personal' ? (
            <select
              value={formData.gender || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          ) : (
            <div className="info-value">{patientProfile?.personal_info?.gender || 'Not set'}</div>
          )}
        </div>

        <div className="info-group">
          <label>Blood Type</label>
          {editingSection === 'personal' ? (
            <select
              value={formData.blood_type || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, blood_type: e.target.value }))}
            >
              <option value="">Select</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          ) : (
            <div className="info-value">{patientProfile?.personal_info?.blood_type || 'Not set'}</div>
          )}
        </div>

        <div className="info-group">
          <label>Height (cm)</label>
          {editingSection === 'personal' ? (
            <input
              type="number"
              value={formData.height || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value ? parseInt(e.target.value) : null }))}
            />
          ) : (
            <div className="info-value">
              {patientProfile?.personal_info?.height ? `${patientProfile.personal_info.height} cm` : 'Not set'}
            </div>
          )}
        </div>

        <div className="info-group">
          <label>Weight (kg)</label>
          {editingSection === 'personal' ? (
            <input
              type="number"
              step="0.1"
              value={formData.weight || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value ? parseFloat(e.target.value) : null }))}
            />
          ) : (
            <div className="info-value">
              {patientProfile?.personal_info?.weight ? `${patientProfile.personal_info.weight} kg` : 'Not set'}
            </div>
          )}
        </div>
      </div>

      {/* Emergency Contact Section */}
      <div className="emergency-contact-edit">
        <h3>Emergency Contact</h3>
        <div className="emergency-contact-form">
          <div className="form-row">
            <div className="info-group">
              <label>Name</label>
              <input
                type="text"
                value={formData.emergency_contact?.name || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  emergency_contact: {
                    ...prev.emergency_contact,
                    name: e.target.value
                  }
                }))}
                placeholder="Contact name"
              />
            </div>
            <div className="info-group">
              <label>Relationship</label>
              <input
                type="text"
                value={formData.emergency_contact?.relationship || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  emergency_contact: {
                    ...prev.emergency_contact,
                    relationship: e.target.value
                  }
                }))}
                placeholder="e.g., Spouse, Parent"
              />
            </div>
          </div>
          <div className="info-group">
            <label>Phone Number</label>
            <input
              type="tel"
              value={formData.emergency_contact?.phone || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                emergency_contact: {
                  ...prev.emergency_contact,
                  phone: e.target.value
                }
              }))}
              placeholder="+1234567890"
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