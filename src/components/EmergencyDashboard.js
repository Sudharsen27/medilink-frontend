import React, { useState, useEffect } from 'react';
import { useEmergency } from '../context/EmergencyContext';
import LoadingSpinner from './LoadingSpinner';
import './EmergencyDashboard.css';

const EmergencyDashboard = ({ user }) => {
  const {
    emergencyContacts,
    medicalInfo,
    emergencyMode,
    currentLocation,
    emergencyServices,
    loading,
    countdown,
    countdownActive,
    startEmergencyCountdown,
    cancelEmergency,
    triggerEmergency,
    connectEmergencyDoctor,
    dispatchAmbulance,
    updateMedicalInfo,
    updateEmergencyContacts,
    getNearbyHospitals
  } = useEmergency();

  const [activeTab, setActiveTab] = useState('sos');
  const [showMedicalInfoModal, setShowMedicalInfoModal] = useState(false);
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [nearbyHospitals, setNearbyHospitals] = useState([]);
  const [editingMedicalInfo, setEditingMedicalInfo] = useState(false);
  const [medicalInfoForm, setMedicalInfoForm] = useState(medicalInfo || {});

  useEffect(() => {
    if (currentLocation) {
      loadNearbyHospitals();
    }
  }, [currentLocation]);

  const loadNearbyHospitals = async () => {
    const hospitals = await getNearbyHospitals();
    setNearbyHospitals(hospitals);
  };

  if (loading) {
    return (
      <div className="emergency-dashboard-container">
        <LoadingSpinner text="Loading emergency services..." />
      </div>
    );
  }

  if (countdownActive) {
    return (
      <div className="emergency-countdown">
        <div className="countdown-content">
          <div className="countdown-circle">
            <div className="countdown-number">{countdown}</div>
          </div>
          <h2>Emergency SOS Activated</h2>
          <p className="warning-text">
            Emergency services will be contacted in {countdown} seconds
          </p>
          <p className="instructions">
            Move to a safe location if possible. Help is on the way.
          </p>
          <button onClick={cancelEmergency} className="btn-cancel-emergency">
            ❌ CANCEL EMERGENCY
          </button>
          <div className="emergency-contacts-preview">
            <p>Your emergency contacts will be notified:</p>
            <div className="contacts-list-mini">
              {emergencyContacts
                .filter(c => c.is_primary)
                .map(contact => (
                  <div key={contact.id} className="contact-mini">
                    <span className="contact-name">{contact.name}</span>
                    <span className="contact-relationship">({contact.relationship})</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (emergencyMode) {
    return (
      <EmergencyInProgress
        currentLocation={currentLocation}
        medicalInfo={medicalInfo}
        onConnectDoctor={connectEmergencyDoctor}
        onDispatchAmbulance={dispatchAmbulance}
        nearbyHospitals={nearbyHospitals}
      />
    );
  }

  return (
    <div className="emergency-dashboard-container">
      {/* Header with Emergency Status */}
      <div className="emergency-status-bar">
        <div className="status-indicator">
          <div className="status-dot safe"></div>
          <span className="status-text">System Ready</span>
        </div>
        <div className="location-status">
          <span className="location-icon">📍</span>
          <span className="location-text">
            {currentLocation ? 'Location Available' : 'Location Required'}
          </span>
        </div>
      </div>

      {/* Emergency SOS Button */}
      <div className="sos-section">
        <div className="sos-header">
          <h2>Emergency SOS</h2>
          <p className="sos-description">
            Press and hold for 3 seconds or tap to activate emergency mode
          </p>
        </div>
        
        <div className="sos-button-container">
          <button
            onClick={startEmergencyCountdown}
            className="sos-button"
            onTouchStart={(e) => {
              e.preventDefault();
              startEmergencyCountdown();
            }}
          >
            <div className="sos-inner">
              <span className="sos-text">SOS</span>
              <span className="sos-subtext">EMERGENCY</span>
            </div>
            <div className="sos-pulse"></div>
          </button>
          
          <div className="sos-instructions">
            <div className="instruction-item">
              <span className="instruction-icon">1️⃣</span>
              <span className="instruction-text">Press SOS button</span>
            </div>
            <div className="instruction-item">
              <span className="instruction-icon">2️⃣</span>
              <span className="instruction-text">Countdown starts (5 seconds)</span>
            </div>
            <div className="instruction-item">
              <span className="instruction-icon">3️⃣</span>
              <span className="instruction-text">Emergency services alerted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-emergency-actions">
        <h3>Quick Emergency Access</h3>
        <div className="actions-grid">
          <button onClick={connectEmergencyDoctor} className="action-card emergency">
            <span className="action-icon">👨‍⚕️</span>
            <span className="action-text">Emergency Doctor</span>
            <span className="action-subtext">Video consult</span>
          </button>
          
          <button onClick={() => dispatchAmbulance()} className="action-card ambulance">
            <span className="action-icon">🚑</span>
            <span className="action-text">Call Ambulance</span>
            <span className="action-subtext">108 / Direct call</span>
          </button>
          
          <button className="action-card police">
            <span className="action-icon">🚓</span>
            <span className="action-text">Police</span>
            <span className="action-subtext">100</span>
          </button>
          
          <button className="action-card fire">
            <span className="action-icon">🚒</span>
            <span className="action-text">Fire Department</span>
            <span className="action-subtext">101</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="emergency-tabs">
        <button
          onClick={() => setActiveTab('medical')}
          className={`tab-btn ${activeTab === 'medical' ? 'active' : ''}`}
        >
          🏥 Medical Info
        </button>
        <button
          onClick={() => setActiveTab('contacts')}
          className={`tab-btn ${activeTab === 'contacts' ? 'active' : ''}`}
        >
          👥 Emergency Contacts
        </button>
        <button
          onClick={() => setActiveTab('hospitals')}
          className={`tab-btn ${activeTab === 'hospitals' ? 'active' : ''}`}
        >
          🏨 Nearby Hospitals
        </button>
      </div>

      {/* Tab Content */}
      <div className="emergency-content">
        {activeTab === 'medical' && (
          <MedicalInfoTab 
            medicalInfo={medicalInfo}
            onEdit={() => setShowMedicalInfoModal(true)}
          />
        )}
        
        {activeTab === 'contacts' && (
          <EmergencyContactsTab 
            contacts={emergencyContacts}
            onEdit={() => setShowContactsModal(true)}
          />
        )}
        
        {activeTab === 'hospitals' && (
          <NearbyHospitalsTab 
            hospitals={nearbyHospitals}
            currentLocation={currentLocation}
            onDispatchAmbulance={dispatchAmbulance}
          />
        )}
      </div>

      {/* Emergency Services */}
      <div className="emergency-services-section">
        <h3>Emergency Services</h3>
        <div className="services-list">
          {emergencyServices.map(service => (
            <div key={service.id} className="service-card">
             <div className="service-type">
  {(service.type || 'service').toUpperCase()}
</div>

              <div className="service-name">{service.name}</div>
              <div className="service-number">{service.number}</div>
              <button 
                onClick={() => window.location.href = `tel:${service.number}`}
                className="btn-call"
              >
                📞 Call
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {showMedicalInfoModal && (
        <MedicalInfoModal
          medicalInfo={medicalInfo}
          formData={medicalInfoForm}
          editing={editingMedicalInfo}
          onClose={() => {
            setShowMedicalInfoModal(false);
            setEditingMedicalInfo(false);
          }}
          onEdit={() => setEditingMedicalInfo(true)}
          onSave={async (data) => {
            await updateMedicalInfo(data);
            setEditingMedicalInfo(false);
          }}
          onChange={setMedicalInfoForm}
        />
      )}

      {showContactsModal && (
        <EmergencyContactsModal
          contacts={emergencyContacts}
          onClose={() => setShowContactsModal(false)}
          onSave={updateEmergencyContacts}
        />
      )}
    </div>
  );
};

// Emergency In Progress Component
const EmergencyInProgress = ({ currentLocation, medicalInfo, onConnectDoctor, onDispatchAmbulance, nearbyHospitals }) => {
  const [showLocationMap, setShowLocationMap] = useState(false);

  return (
    <div className="emergency-in-progress">
      <div className="emergency-header">
        <h1 className="emergency-title">🚨 EMERGENCY IN PROGRESS 🚨</h1>
        <p className="emergency-subtitle">Help is on the way. Stay calm.</p>
      </div>

      {/* Emergency Actions */}
      <div className="emergency-actions-container">
        <div className="emergency-action-card">
          <div className="action-header">
            <span className="action-icon">👨‍⚕️</span>
            <span className="action-title">Emergency Doctor</span>
          </div>
          <p className="action-description">
            Connect with a doctor immediately via video call
          </p>
          <button onClick={onConnectDoctor} className="btn-emergency-action">
            Connect Now
          </button>
        </div>

        <div className="emergency-action-card">
          <div className="action-header">
            <span className="action-icon">🚑</span>
            <span className="action-title">Ambulance</span>
          </div>
          <p className="action-description">
            Dispatch ambulance to your location
          </p>
          <button onClick={() => onDispatchAmbulance()} className="btn-emergency-action">
            Dispatch Ambulance
          </button>
        </div>

        <div className="emergency-action-card">
          <div className="action-header">
            <span className="action-icon">📍</span>
            <span className="action-title">Share Location</span>
          </div>
          <p className="action-description">
            Share your real-time location with emergency services
          </p>
          <button 
            onClick={() => setShowLocationMap(!showLocationMap)}
            className="btn-emergency-action"
          >
            {showLocationMap ? 'Hide Location' : 'Show Location'}
          </button>
        </div>
      </div>

      {/* Location & Medical Info */}
      <div className="emergency-info-grid">
        <div className="info-card">
          <h3>📍 Your Location</h3>
          {currentLocation ? (
            <>
              <div className="coordinates">
                <span>Lat: {currentLocation.latitude.toFixed(6)}</span>
                <span>Lng: {currentLocation.longitude.toFixed(6)}</span>
              </div>
              <a 
                href={`https://maps.google.com/?q=${currentLocation.latitude},${currentLocation.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="location-link"
              >
                Open in Google Maps
              </a>
            </>
          ) : (
            <p className="location-unavailable">Location not available</p>
          )}
        </div>

        <div className="info-card">
          <h3>🏥 Medical Information</h3>
          <div className="medical-details">
            <div className="medical-row">
              <span className="medical-label">Blood Type:</span>
              <span className="medical-value">{medicalInfo?.blood_type || 'Not specified'}</span>
            </div>
            <div className="medical-row">
              <span className="medical-label">Allergies:</span>
              <span className="medical-value">
                {medicalInfo?.allergies?.length > 0 
                  ? medicalInfo.allergies.join(', ') 
                  : 'None'}
              </span>
            </div>
            <div className="medical-row">
              <span className="medical-label">Conditions:</span>
              <span className="medical-value">
                {medicalInfo?.conditions?.length > 0 
                  ? medicalInfo.conditions.join(', ') 
                  : 'None'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Nearby Hospitals */}
      <div className="nearby-hospitals-section">
        <h3>🏨 Nearby Hospitals</h3>
        <div className="hospitals-list">
          {nearbyHospitals.slice(0, 3).map((hospital, index) => (
            <div key={index} className="hospital-card">
              <div className="hospital-name">{hospital.name.split(',')[0]}</div>
              <div className="hospital-distance">{hospital.distance} km away</div>
              <button 
                onClick={() => onDispatchAmbulance()}
                className="btn-hospital-action"
              >
                Send Ambulance Here
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Instructions */}
      <div className="emergency-instructions">
        <h3>📋 What to do now:</h3>
        <ol className="instructions-list">
          <li>Stay where you are if it's safe</li>
          <li>Keep your phone nearby and charged</li>
          <li>If possible, unlock your door for emergency services</li>
          <li>Have your ID and insurance information ready</li>
          <li>If alone, try to contact a neighbor or friend</li>
        </ol>
      </div>
    </div>
  );
};

// Medical Info Tab Component
const MedicalInfoTab = ({ medicalInfo, onEdit }) => {
  return (
    <div className="medical-info-tab">
      <div className="tab-header">
        <h3>Medical Information for Emergency</h3>
        <button onClick={onEdit} className="btn-edit">
          ✏️ Edit
        </button>
      </div>

      <div className="medical-info-grid">
        <div className="info-section">
          <h4>Basic Information</h4>
          <div className="info-item">
            <span className="info-label">Blood Type:</span>
            <span className="info-value">{medicalInfo?.blood_type || 'Not specified'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Primary Doctor:</span>
            <span className="info-value">{medicalInfo?.doctor_name || 'Not specified'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Doctor Phone:</span>
            <span className="info-value">{medicalInfo?.doctor_phone || 'Not specified'}</span>
          </div>
        </div>

        <div className="info-section">
          <h4>Health Conditions</h4>
          {medicalInfo?.conditions?.length > 0 ? (
            <ul className="conditions-list">
              {medicalInfo.conditions.map((condition, index) => (
                <li key={index}>{condition}</li>
              ))}
            </ul>
          ) : (
            <p className="no-info">No conditions specified</p>
          )}
        </div>

        <div className="info-section">
          <h4>Allergies</h4>
          {medicalInfo?.allergies?.length > 0 ? (
            <ul className="allergies-list">
              {medicalInfo.allergies.map((allergy, index) => (
                <li key={index} className="allergy-item">
                  <span className="allergy-name">{allergy}</span>
                  <span className="allergy-severity">Severe</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-info">No allergies specified</p>
          )}
        </div>

        <div className="info-section">
          <h4>Current Medications</h4>
          {medicalInfo?.medications?.length > 0 ? (
            <ul className="medications-list">
              {medicalInfo.medications.map((medication, index) => (
                <li key={index}>{medication}</li>
              ))}
            </ul>
          ) : (
            <p className="no-info">No medications listed</p>
          )}
        </div>

        <div className="info-section full-width">
          <h4>Emergency Notes</h4>
          <div className="emergency-notes">
            {medicalInfo?.emergency_notes || 'No emergency notes provided'}
          </div>
        </div>

        <div className="info-section">
          <h4>Insurance Information</h4>
          <div className="info-item">
            <span className="info-label">Provider:</span>
            <span className="info-value">{medicalInfo?.insurance_provider || 'Not specified'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Policy Number:</span>
            <span className="info-value">{medicalInfo?.insurance_id || 'Not specified'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Emergency Contacts Tab Component
const EmergencyContactsTab = ({ contacts, onEdit }) => {
  return (
    <div className="emergency-contacts-tab">
      <div className="tab-header">
        <h3>Emergency Contacts</h3>
        <button onClick={onEdit} className="btn-edit">
          ✏️ Edit
        </button>
      </div>

      <div className="contacts-grid">
        {contacts.map(contact => (
          <div key={contact.id} className={`contact-card ${contact.is_primary ? 'primary' : ''}`}>
            <div className="contact-header">
              <div className="contact-avatar">
                {contact.name.charAt(0)}
              </div>
              <div className="contact-info">
                <div className="contact-name">{contact.name}</div>
                <div className="contact-relationship">{contact.relationship}</div>
              </div>
              {contact.is_primary && (
                <div className="primary-badge">Primary</div>
              )}
            </div>
            
            <div className="contact-details">
              <div className="contact-phone">
                <span className="phone-label">Phone:</span>
                <span className="phone-number">
                  {contact.phone || 'Not set'}
                </span>
              </div>
              {contact.email && (
                <div className="contact-email">
                  <span className="email-label">Email:</span>
                  <span className="email-address">{contact.email}</span>
                </div>
              )}
            </div>

            <div className="contact-actions">
              {contact.phone && (
                <button 
                  onClick={() => window.location.href = `tel:${contact.phone}`}
                  className="btn-call-contact"
                >
                  📞 Call
                </button>
              )}
              {contact.phone && (
                <button 
                  onClick={() => window.location.href = `sms:${contact.phone}`}
                  className="btn-sms-contact"
                >
                  💬 SMS
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="contacts-info">
        <p className="info-text">
          <strong>Note:</strong> Primary contacts will be notified immediately when you trigger an emergency SOS.
          Make sure at least one contact has a valid phone number.
        </p>
      </div>
    </div>
  );
};

// Nearby Hospitals Tab Component
const NearbyHospitalsTab = ({ hospitals, currentLocation, onDispatchAmbulance }) => {
  return (
    <div className="nearby-hospitals-tab">
      <div className="tab-header">
        <h3>Nearby Hospitals & Medical Facilities</h3>
        <p className="location-status">
          {currentLocation 
            ? `Showing hospitals near your location` 
            : 'Location access required to find nearby hospitals'}
        </p>
      </div>

      {!currentLocation ? (
        <div className="location-required">
          <div className="location-icon">📍</div>
          <h4>Location Access Required</h4>
          <p>Enable location services to find hospitals near you</p>
          <button className="btn-enable-location">
            Enable Location
          </button>
        </div>
      ) : hospitals.length === 0 ? (
        <div className="no-hospitals">
          <div className="search-icon">🔍</div>
          <h4>Searching for hospitals...</h4>
          <p>Please wait while we find medical facilities near you</p>
        </div>
      ) : (
        <>
          <div className="hospitals-list-detailed">
            {hospitals.map((hospital, index) => (
              <div key={index} className="hospital-card-detailed">
                <div className="hospital-header">
                  <div className="hospital-rank">{index + 1}</div>
                  <div className="hospital-name-detailed">
                    {hospital.name.split(',').slice(0, 2).join(',')}
                  </div>
                  <div className="hospital-distance-detailed">
                    {hospital.distance} km
                  </div>
                </div>
                
                <div className="hospital-address">
                  {hospital.name.split(',').slice(2).join(',').trim()}
                </div>
                
                <div className="hospital-actions">
                  <button 
                    onClick={() => onDispatchAmbulance()}
                    className="btn-ambulance"
                  >
                    🚑 Dispatch Ambulance
                  </button>
                  <a
                    href={`https://maps.google.com/?q=${hospital.latitude},${hospital.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-directions"
                  >
                    📍 Get Directions
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="hospital-notes">
            <p><strong>Important:</strong> In a medical emergency, call 108 or your local emergency number immediately.</p>
            <p>This list shows approximate locations and distances. Verify hospital services and availability before visiting.</p>
          </div>
        </>
      )}
    </div>
  );
};

// Medical Info Modal Component
const MedicalInfoModal = ({ medicalInfo, formData, editing, onClose, onEdit, onSave, onChange }) => {
  const handleSave = async () => {
    await onSave(formData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content large">
        <div className="modal-header">
          <h2>Medical Information for Emergencies</h2>
          <button onClick={onClose} className="modal-close">×</button>
        </div>

        <div className="modal-body">
          {!editing ? (
            <div className="medical-info-view">
              <div className="info-section-modal">
                <h4>Basic Information</h4>
                <div className="info-row">
                  <span className="info-label">Blood Type:</span>
                  <span className="info-value">{medicalInfo?.blood_type}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Primary Doctor:</span>
                  <span className="info-value">{medicalInfo?.doctor_name}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Doctor Phone:</span>
                  <span className="info-value">{medicalInfo?.doctor_phone}</span>
                </div>
              </div>

              <div className="info-section-modal">
                <h4>Health Information</h4>
                <div className="info-row">
                  <span className="info-label">Allergies:</span>
                  <span className="info-value">
                    {medicalInfo?.allergies?.join(', ') || 'None'}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Conditions:</span>
                  <span className="info-value">
                    {medicalInfo?.conditions?.join(', ') || 'None'}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Medications:</span>
                  <span className="info-value">
                    {medicalInfo?.medications?.join(', ') || 'None'}
                  </span>
                </div>
              </div>

              <div className="modal-actions">
                <button onClick={onEdit} className="btn-primary">
                  ✏️ Edit Information
                </button>
                <button onClick={onClose} className="btn-cancel">
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form className="medical-info-edit">
              <div className="form-grid">
                <div className="form-group">
                  <label>Blood Type</label>
                  <select
                    value={formData.blood_type}
                    onChange={(e) => onChange({...formData, blood_type: e.target.value})}
                  >
                    <option value="">Select blood type</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Primary Doctor Name</label>
                  <input
                    type="text"
                    value={formData.doctor_name || ''}
                    onChange={(e) => onChange({...formData, doctor_name: e.target.value})}
                    placeholder="Dr. Name"
                  />
                </div>

                <div className="form-group">
                  <label>Doctor Phone Number</label>
                  <input
                    type="tel"
                    value={formData.doctor_phone || ''}
                    onChange={(e) => onChange({...formData, doctor_phone: e.target.value})}
                    placeholder="+91 XXXXXXXXXX"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Allergies (comma separated)</label>
                  <input
                    type="text"
                    value={formData.allergies?.join(', ') || ''}
                    onChange={(e) => onChange({
                      ...formData, 
                      allergies: e.target.value.split(',').map(a => a.trim()).filter(a => a)
                    })}
                    placeholder="Penicillin, Nuts, Latex"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Medical Conditions (comma separated)</label>
                  <input
                    type="text"
                    value={formData.conditions?.join(', ') || ''}
                    onChange={(e) => onChange({
                      ...formData, 
                      conditions: e.target.value.split(',').map(c => c.trim()).filter(c => c)
                    })}
                    placeholder="Diabetes, Hypertension, Asthma"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Current Medications (comma separated)</label>
                  <input
                    type="text"
                    value={formData.medications?.join(', ') || ''}
                    onChange={(e) => onChange({
                      ...formData, 
                      medications: e.target.value.split(',').map(m => m.trim()).filter(m => m)
                    })}
                    placeholder="Metformin 500mg, Lisinopril 10mg"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Emergency Notes</label>
                  <textarea
                    value={formData.emergency_notes || ''}
                    onChange={(e) => onChange({...formData, emergency_notes: e.target.value})}
                    placeholder="Important information for first responders..."
                    rows="4"
                  />
                </div>

                <div className="form-group">
                  <label>Insurance Provider</label>
                  <input
                    type="text"
                    value={formData.insurance_provider || ''}
                    onChange={(e) => onChange({...formData, insurance_provider: e.target.value})}
                    placeholder="Insurance Company"
                  />
                </div>

                <div className="form-group">
                  <label>Policy Number</label>
                  <input
                    type="text"
                    value={formData.insurance_id || ''}
                    onChange={(e) => onChange({...formData, insurance_id: e.target.value})}
                    placeholder="POL-XXXX-XXXX"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={onClose} className="btn-cancel">
                  Cancel
                </button>
                <button type="button" onClick={handleSave} className="btn-primary">
                  💾 Save Information
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// Emergency Contacts Modal Component
const EmergencyContactsModal = ({ contacts, onClose, onSave }) => {
  const [localContacts, setLocalContacts] = useState([...contacts]);
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    email: '',
    relationship: 'Family',
    is_primary: false
  });

  const handleSave = async () => {
    await onSave(localContacts);
    onClose();
  };

  const addContact = () => {
    if (!newContact.name || !newContact.phone) {
      alert('Name and phone number are required');
      return;
    }

    // Ensure only one primary contact
    const updatedContacts = [...localContacts];
    if (newContact.is_primary) {
      updatedContacts.forEach(contact => contact.is_primary = false);
    }

    updatedContacts.push({
      ...newContact,
      id: Date.now() // Temporary ID
    });

    setLocalContacts(updatedContacts);
    setNewContact({
      name: '',
      phone: '',
      email: '',
      relationship: 'Family',
      is_primary: false
    });
  };

  const removeContact = (index) => {
    const updatedContacts = [...localContacts];
    updatedContacts.splice(index, 1);
    setLocalContacts(updatedContacts);
  };

  const setPrimaryContact = (index) => {
    const updatedContacts = localContacts.map((contact, i) => ({
      ...contact,
      is_primary: i === index
    }));
    setLocalContacts(updatedContacts);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content large">
        <div className="modal-header">
          <h2>Emergency Contacts Management</h2>
          <button onClick={onClose} className="modal-close">×</button>
        </div>

        <div className="modal-body">
          {/* Add New Contact */}
          <div className="add-contact-section">
            <h4>Add New Emergency Contact</h4>
            <div className="add-contact-form">
              <div className="form-row">
                <input
                  type="text"
                  value={newContact.name}
                  onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                  placeholder="Full Name"
                  className="contact-input"
                />
                <input
                  type="tel"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                  placeholder="Phone Number"
                  className="contact-input"
                />
              </div>
              <div className="form-row">
                <input
                  type="email"
                  value={newContact.email}
                  onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                  placeholder="Email (optional)"
                  className="contact-input"
                />
                <select
                  value={newContact.relationship}
                  onChange={(e) => setNewContact({...newContact, relationship: e.target.value})}
                  className="contact-select"
                >
                  <option value="Family">Family</option>
                  <option value="Friend">Friend</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Neighbor">Neighbor</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={newContact.is_primary}
                    onChange={(e) => setNewContact({...newContact, is_primary: e.target.checked})}
                  />
                  <span className="checkmark"></span>
                  Set as primary contact (will be notified first)
                </label>
                <button onClick={addContact} className="btn-add-contact">
                  + Add Contact
                </button>
              </div>
            </div>
          </div>

          {/* Contacts List */}
          <div className="contacts-list-section">
            <h4>Current Emergency Contacts</h4>
            <div className="contacts-list-edit">
              {localContacts.map((contact, index) => (
                <div key={index} className="contact-item-edit">
                  <div className="contact-details-edit">
                    <div className="contact-name-edit">{contact.name}</div>
                    <div className="contact-phone-edit">{contact.phone}</div>
                    <div className="contact-relationship-edit">{contact.relationship}</div>
                    {contact.is_primary && (
                      <div className="primary-tag">Primary</div>
                    )}
                  </div>
                  <div className="contact-actions-edit">
                    <button 
                      onClick={() => setPrimaryContact(index)}
                      className="btn-set-primary"
                      disabled={contact.is_primary}
                    >
                      {contact.is_primary ? 'Primary' : 'Set as Primary'}
                    </button>
                    <button 
                      onClick={() => removeContact(index)}
                      className="btn-remove-contact"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button onClick={handleSave} className="btn-primary">
              💾 Save Contacts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyDashboard;