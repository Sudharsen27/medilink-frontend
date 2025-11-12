/**
 * Utility functions for exporting data to various formats
 */

// Convert data to CSV format
export const convertToCSV = (data, headers) => {
  if (!data || data.length === 0) return '';
  
  const headerRow = headers.map(header => `"${header.label}"`).join(',');
  const dataRows = data.map(row => 
    headers.map(header => {
      const value = row[header.key];
      // Handle nested objects and arrays
      if (typeof value === 'object' && value !== null) {
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
      }
      return `"${String(value || '').replace(/"/g, '""')}"`;
    }).join(',')
  );
  
  return [headerRow, ...dataRows].join('\n');
};

// Convert data to JSON format
export const convertToJSON = (data) => {
  return JSON.stringify(data, null, 2);
};

// Download file utility
export const downloadFile = (content, fileName, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Format date for filenames
export const getFormattedDate = () => {
  const now = new Date();
  return now.toISOString().split('T')[0]; // YYYY-MM-DD
};

// Export appointments to CSV
export const exportAppointmentsToCSV = (appointments) => {
  const headers = [
    { key: 'date', label: 'Date' },
    { key: 'time', label: 'Time' },
    { key: 'doctorName', label: 'Doctor' },
    { key: 'specialization', label: 'Specialization' },
    { key: 'hospital', label: 'Hospital' },
    { key: 'status', label: 'Status' },
    { key: 'notes', label: 'Notes' },
    { key: 'createdAt', label: 'Created At' }
  ];

  const csvData = convertToCSV(appointments, headers);
  const fileName = `appointments-${getFormattedDate()}.csv`;
  downloadFile(csvData, fileName, 'text/csv;charset=utf-8;');
};

// Export appointments to JSON
export const exportAppointmentsToJSON = (appointments) => {
  const jsonData = convertToJSON(appointments);
  const fileName = `appointments-${getFormattedDate()}.json`;
  downloadFile(jsonData, fileName, 'application/json');
};

// Export medical records to CSV
export const exportMedicalRecordsToCSV = (records) => {
  const headers = [
    { key: 'recordDate', label: 'Record Date' },
    { key: 'recordType', label: 'Type' },
    { key: 'description', label: 'Description' },
    { key: 'doctor', label: 'Doctor' },
    { key: 'hospital', label: 'Hospital' },
    { key: 'notes', label: 'Notes' },
    { key: 'createdAt', label: 'Created At' }
  ];

  const csvData = convertToCSV(records, headers);
  const fileName = `medical-records-${getFormattedDate()}.csv`;
  downloadFile(csvData, fileName, 'text/csv;charset=utf-8;');
};

// Export prescriptions to CSV
export const exportPrescriptionsToCSV = (prescriptions) => {
  const headers = [
    { key: 'prescribedDate', label: 'Prescribed Date' },
    { key: 'medicationName', label: 'Medication' },
    { key: 'dosage', label: 'Dosage' },
    { key: 'frequency', label: 'Frequency' },
    { key: 'duration', label: 'Duration' },
    { key: 'doctorName', label: 'Prescribing Doctor' },
    { key: 'notes', label: 'Instructions' },
    { key: 'status', label: 'Status' }
  ];

  const csvData = convertToCSV(prescriptions, headers);
  const fileName = `prescriptions-${getFormattedDate()}.csv`;
  downloadFile(csvData, fileName, 'text/csv;charset=utf-8;');
};

// Export user profile to JSON
export const exportUserProfileToJSON = (user) => {
  const profileData = {
    exportedAt: new Date().toISOString(),
    user: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      bloodGroup: user.bloodGroup,
      allergies: user.allergies,
      emergencyContact: user.emergencyContact
    }
  };
  
  const jsonData = convertToJSON(profileData);
  const fileName = `profile-${getFormattedDate()}.json`;
  downloadFile(jsonData, fileName, 'application/json');
};

// Export all data (comprehensive export)
export const exportAllData = async (userData) => {
  const { user, appointments, prescriptions, medicalRecords } = userData;
  
  const exportData = {
    exportedAt: new Date().toISOString(),
    exportVersion: '1.0',
    user: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth
    },
    summary: {
      totalAppointments: appointments?.length || 0,
      totalPrescriptions: prescriptions?.length || 0,
      totalMedicalRecords: medicalRecords?.length || 0
    },
    appointments: appointments || [],
    prescriptions: prescriptions || [],
    medicalRecords: medicalRecords || []
  };

  const jsonData = convertToJSON(exportData);
  const fileName = `medilink-backup-${getFormattedDate()}.json`;
  downloadFile(jsonData, fileName, 'application/json');
};

// Print data as PDF (basic HTML print)
export const printData = (data, title) => {
  const printWindow = window.open('', '_blank');
  const printableContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 10px; }
        .header h1 { margin: 0; color: #333; }
        .meta { text-align: center; color: #666; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #f5f5f5; font-weight: bold; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${title}</h1>
        <div class="meta">
          Exported on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
        </div>
      </div>
      <div id="content">
        ${data}
      </div>
      <div class="footer">
        <p>Exported from MediLink - Your Personal Health Management System</p>
      </div>
      <script>
        window.onload = function() {
          window.print();
          setTimeout(() => window.close(), 1000);
        }
      </script>
    </body>
    </html>
  `;
  
  printWindow.document.write(printableContent);
  printWindow.document.close();
};