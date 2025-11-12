// import React, { useState, useEffect } from 'react';
// import { useToast } from '../context/ToastContext';
// import ExportButton from '../components/ExportButton';
// import LoadingSpinner from '../components/LoadingSpinner';
// import './DataBackup.css';

// const DataBackup = () => {
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const { addToast } = useToast();

//   useEffect(() => {
//     fetchUserData();
//   }, []);

//   const fetchUserData = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');
      
//       // Fetch all user data for comprehensive backup
//       const [appointmentsRes, prescriptionsRes, medicalRecordsRes] = await Promise.all([
//         fetch('/api/appointments', {
//           headers: { 'Authorization': `Bearer ${token}` }
//         }),
//         fetch('/api/prescriptions', {
//           headers: { 'Authorization': `Bearer ${token}` }
//         }),
//         fetch('/api/medical-records', {
//           headers: { 'Authorization': `Bearer ${token}` }
//         })
//       ]);

//       const appointments = appointmentsRes.ok ? await appointmentsRes.json() : [];
//       const prescriptions = prescriptionsRes.ok ? await prescriptionsRes.json() : [];
//       const medicalRecords = medicalRecordsRes.ok ? await medicalRecordsRes.json() : [];
      
//       const user = JSON.parse(localStorage.getItem('user'));
      
//       setUserData({
//         user,
//         appointments,
//         prescriptions,
//         medicalRecords
//       });
      
//     } catch (error) {
//       console.error('Error fetching user data:', error);
//       addToast('Failed to load data for backup', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="backup-container">
//         <LoadingSpinner text="Loading your data..." />
//       </div>
//     );
//   }

//   const dataSummary = {
//     appointments: userData?.appointments?.length || 0,
//     prescriptions: userData?.prescriptions?.length || 0,
//     medicalRecords: userData?.medicalRecords?.length || 0
//   };

//   return (
//     <div className="backup-container">
//       <div className="backup-header">
//         <div>
//           <h1 className="backup-title">Data Backup & Export</h1>
//           <p className="backup-subtitle">
//             Export your medical data for personal records or backup purposes
//           </p>
//         </div>
//       </div>

//       {/* Data Summary */}
//       <div className="backup-summary">
//         <h2 className="backup-section-title">Your Data Summary</h2>
//         <div className="summary-grid">
//           <div className="summary-card">
//             <div className="summary-icon">📅</div>
//             <div className="summary-content">
//               <div className="summary-count">{dataSummary.appointments}</div>
//               <div className="summary-label">Appointments</div>
//             </div>
//           </div>
//           <div className="summary-card">
//             <div className="summary-icon">💊</div>
//             <div className="summary-content">
//               <div className="summary-count">{dataSummary.prescriptions}</div>
//               <div className="summary-label">Prescriptions</div>
//             </div>
//           </div>
//           <div className="summary-card">
//             <div className="summary-icon">📋</div>
//             <div className="summary-content">
//               <div className="summary-count">{dataSummary.medicalRecords}</div>
//               <div className="summary-label">Medical Records</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Export Options */}
//       <div className="backup-options">
//         <h2 className="backup-section-title">Export Options</h2>
        
//         <div className="options-grid">
//           {/* Comprehensive Backup */}
//           <div className="option-card option-card--primary">
//             <div className="option-icon">💾</div>
//             <div className="option-content">
//               <h3 className="option-title">Complete Backup</h3>
//               <p className="option-description">
//                 Export all your data including appointments, prescriptions, and medical records in a single JSON file.
//               </p>
//             </div>
//             <div className="option-action">
//               <ExportButton 
//                 data={userData}
//                 dataType="all"
//                 variant="primary"
//                 size="large"
//                 showLabel={true}
//               />
//             </div>
//           </div>

//           {/* Individual Exports */}
//           <div className="option-card">
//             <div className="option-icon">📅</div>
//             <div className="option-content">
//               <h3 className="option-title">Appointments</h3>
//               <p className="option-description">
//                 Export your appointment history in CSV or JSON format.
//               </p>
//             </div>
//             <div className="option-action">
//               <ExportButton 
//                 data={userData?.appointments}
//                 dataType="appointments"
//                 variant="outline"
//                 size="medium"
//                 showLabel={true}
//               />
//             </div>
//           </div>

//           <div className="option-card">
//             <div className="option-icon">💊</div>
//             <div className="option-content">
//               <h3 className="option-title">Prescriptions</h3>
//               <p className="option-description">
//                 Export your prescription history in CSV format.
//               </p>
//             </div>
//             <div className="option-action">
//               <ExportButton 
//                 data={userData?.prescriptions}
//                 dataType="prescriptions"
//                 variant="outline"
//                 size="medium"
//                 showLabel={true}
//               />
//             </div>
//           </div>

//           <div className="option-card">
//             <div className="option-icon">📋</div>
//             <div className="option-content">
//               <h3 className="option-title">Medical Records</h3>
//               <p className="option-description">
//                 Export your medical records and test results.
//               </p>
//             </div>
//             <div className="option-action">
//               <ExportButton 
//                 data={userData?.medicalRecords}
//                 dataType="medicalRecords"
//                 variant="outline"
//                 size="medium"
//                 showLabel={true}
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Information Section */}
//       <div className="backup-info">
//         <h2 className="backup-section-title">About Data Export</h2>
//         <div className="info-content">
//           <div className="info-item">
//             <h4>📁 File Formats</h4>
//             <p>Your data can be exported in CSV (for spreadsheets) or JSON (for developers) formats.</p>
//           </div>
//           <div className="info-item">
//             <h4>🔒 Data Privacy</h4>
//             <p>All exports are generated locally in your browser. Your data never leaves your device during export.</p>
//           </div>
//           <div className="info-item">
//             <h4>💾 Backup Frequency</h4>
//             <p>We recommend regularly backing up your data, especially before major medical procedures or travel.</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DataBackup;

import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '../context/ToastContext';
import ExportButton from '../components/ExportButton';
import LoadingSpinner from '../components/LoadingSpinner';
import './DataBackup.css';

const DataBackup = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  // ✅ UseCallback to prevent ESLint dependency warnings
  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Fetch all user-related data simultaneously
      const [appointmentsRes, prescriptionsRes, medicalRecordsRes] = await Promise.all([
        fetch('/api/appointments', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/prescriptions', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/medical-records', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const appointments = appointmentsRes.ok ? await appointmentsRes.json() : [];
      const prescriptions = prescriptionsRes.ok ? await prescriptionsRes.json() : [];
      const medicalRecords = medicalRecordsRes.ok ? await medicalRecordsRes.json() : [];

      const user = JSON.parse(localStorage.getItem('user'));

      setUserData({
        user,
        appointments,
        prescriptions,
        medicalRecords,
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      addToast('Failed to load data for backup', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  // ✅ Trigger fetch on mount
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  if (loading) {
    return (
      <div className="backup-container">
        <LoadingSpinner text="Loading your data..." />
      </div>
    );
  }

  const dataSummary = {
    appointments: userData?.appointments?.length || 0,
    prescriptions: userData?.prescriptions?.length || 0,
    medicalRecords: userData?.medicalRecords?.length || 0,
  };

  return (
    <div className="backup-container">
      {/* ✅ Header Section */}
      <div className="backup-header">
        <div>
          <h1 className="backup-title">Data Backup & Export</h1>
          <p className="backup-subtitle">
            Export your medical data for personal records or backup purposes.
          </p>
        </div>
      </div>

      {/* ✅ Data Summary Section */}
      <div className="backup-summary">
        <h2 className="backup-section-title">Your Data Summary</h2>
        <div className="summary-grid">
          <SummaryCard icon="📅" count={dataSummary.appointments} label="Appointments" />
          <SummaryCard icon="💊" count={dataSummary.prescriptions} label="Prescriptions" />
          <SummaryCard icon="📋" count={dataSummary.medicalRecords} label="Medical Records" />
        </div>
      </div>

      {/* ✅ Export Options */}
      <div className="backup-options">
        <h2 className="backup-section-title">Export Options</h2>

        <div className="options-grid">
          {/* Comprehensive Backup */}
          <ExportOption
            icon="💾"
            title="Complete Backup"
            description="Export all your data including appointments, prescriptions, and medical records in a single JSON file."
          >
            <ExportButton
              data={userData}
              dataType="all"
              variant="primary"
              size="large"
              showLabel={true}
            />
          </ExportOption>

          {/* Individual Exports */}
          <ExportOption
            icon="📅"
            title="Appointments"
            description="Export your appointment history in CSV or JSON format."
          >
            <ExportButton
              data={userData?.appointments}
              dataType="appointments"
              variant="outline"
              size="medium"
              showLabel={true}
            />
          </ExportOption>

          <ExportOption
            icon="💊"
            title="Prescriptions"
            description="Export your prescription history in CSV format."
          >
            <ExportButton
              data={userData?.prescriptions}
              dataType="prescriptions"
              variant="outline"
              size="medium"
              showLabel={true}
            />
          </ExportOption>

          <ExportOption
            icon="📋"
            title="Medical Records"
            description="Export your medical records and test results."
          >
            <ExportButton
              data={userData?.medicalRecords}
              dataType="medicalRecords"
              variant="outline"
              size="medium"
              showLabel={true}
            />
          </ExportOption>
        </div>
      </div>

      {/* ✅ Information Section */}
      <div className="backup-info">
        <h2 className="backup-section-title">About Data Export</h2>
        <div className="info-content">
          <InfoItem
            title="📁 File Formats"
            text="Your data can be exported in CSV (for spreadsheets) or JSON (for developers) formats."
          />
          <InfoItem
            title="🔒 Data Privacy"
            text="All exports are generated locally in your browser. Your data never leaves your device during export."
          />
          <InfoItem
            title="💾 Backup Frequency"
            text="We recommend regularly backing up your data, especially before major medical procedures or travel."
          />
        </div>
      </div>
    </div>
  );
};

/* --------------------------
   🧩 Reusable Components
--------------------------- */

const SummaryCard = ({ icon, count, label }) => (
  <div className="summary-card">
    <div className="summary-icon">{icon}</div>
    <div className="summary-content">
      <div className="summary-count">{count}</div>
      <div className="summary-label">{label}</div>
    </div>
  </div>
);

const ExportOption = ({ icon, title, description, children }) => (
  <div className="option-card">
    <div className="option-icon">{icon}</div>
    <div className="option-content">
      <h3 className="option-title">{title}</h3>
      <p className="option-description">{description}</p>
    </div>
    <div className="option-action">{children}</div>
  </div>
);

const InfoItem = ({ title, text }) => (
  <div className="info-item">
    <h4>{title}</h4>
    <p>{text}</p>
  </div>
);

export default DataBackup;
