// src/components/ExportButton.js
import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from './LoadingSpinner';
import './ExportButton.css';

/**
 * ExportButton
 *
 * Props:
 *  - data: array or object (data to export)
 *  - dataType: one of 'appointments' | 'prescriptions' | 'medicalRecords' | 'profile' | 'all'
 *  - variant: visual variant string (default: 'default')
 *  - size: visual size string (default: 'medium')
 *  - showLabel: whether to show label text on the button (default: true)
 */
const ExportButton = ({
  data,
  dataType = 'appointments',
  variant = 'default',
  size = 'medium',
  showLabel = true,
}) => {
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { addToast } = useToast();

  // menu options per data type
  const exportOptions = {
    appointments: [
      { label: 'Export as CSV', format: 'csv', icon: '📊' },
      { label: 'Export as JSON', format: 'json', icon: '📄' },
      { label: 'Print', format: 'print', icon: '🖨️' },
    ],
    prescriptions: [
      { label: 'Export as CSV', format: 'csv', icon: '📊' },
      { label: 'Print', format: 'print', icon: '🖨️' },
    ],
    medicalRecords: [
      { label: 'Export as CSV', format: 'csv', icon: '📊' },
      { label: 'Print', format: 'print', icon: '🖨️' },
    ],
    profile: [{ label: 'Export Profile', format: 'json', icon: '👤' }],
    all: [{ label: 'Backup All Data', format: 'json', icon: '💾' }],
  };

  // Helpers: CSV, JSON, Print
  const sanitizeCell = (value) => {
    if (value === null || typeof value === 'undefined') return '';
    if (typeof value === 'object') return JSON.stringify(value);
    const str = String(value);
    // If contains quotes, escape by doubling quotes, and wrap in quotes if contains comma/newline/quote
    const needsQuoting = /[",\n\r]/.test(str);
    const escaped = str.replace(/"/g, '""');
    return needsQuoting ? `"${escaped}"` : escaped;
  };

  const downloadBlob = (content, mime, filename) => {
    const blob = new Blob([content], { type: mime });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const exportToCSV = (arr, filenameBase = 'export') => {
    if (!Array.isArray(arr) || arr.length === 0) {
      addToast('No data to export as CSV', 'warning');
      return;
    }

    // Build headers: union of keys across all objects to be robust
    const headerSet = new Set();
    arr.forEach((obj) => {
      if (obj && typeof obj === 'object') {
        Object.keys(obj).forEach((k) => headerSet.add(k));
      }
    });
    const headers = Array.from(headerSet);

    const rows = arr.map((row) =>
      headers
        .map((h) => sanitizeCell(row && Object.prototype.hasOwnProperty.call(row, h) ? row[h] : ''))
        .join(',')
    );

    const csvContent = [headers.join(','), ...rows].join('\n');
    const filename = `${filenameBase}-${new Date().toISOString().split('T')[0]}.csv`;
    downloadBlob(csvContent, 'text/csv;charset=utf-8;', filename);
  };

  const exportToJSON = (payload, filenameBase = 'export') => {
    const json = JSON.stringify(payload, null, 2);
    const filename = `${filenameBase}-${new Date().toISOString().split('T')[0]}.json`;
    downloadBlob(json, 'application/json;charset=utf-8;', filename);
  };

  const printData = (htmlContent, title = '') => {
    const w = window.open('', '_blank', 'noopener,noreferrer');
    if (!w) {
      addToast('Unable to open print window (popup blocked)', 'error');
      return;
    }
    w.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial; padding: 20px; color: #111; }
            table { border-collapse: collapse; width: 100%; margin-top: 12px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background: #f7f7f7; }
            h2 { margin: 0 0 12px 0; }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `);
    w.document.close();
    w.focus();
    // Give the new window a moment to render, then print and close
    // (no async waiting here — the print call is immediate)
    w.print();
    // keep the window open so user can interact — optionally close automatically:
    // w.close();
  };

  const generateTableHTML = (dataArr, title, columnHeaders) => {
    const headersHtml = columnHeaders.map((c) => `<th>${c}</th>`).join('');
    const rowsHtml = dataArr
      .map((item) => {
        const cells = columnHeaders
          .map((col) => {
            // try several ways to access value:
            const key = col
              .toString()
              .toLowerCase()
              .replace(/\s+/g, '')
              .replace(/[^a-z0-9]/g, '');
            // prefer exact key match, fallback to transformed key, fallback to original column
            const value =
              (item && (item[col] || item[key] || item[col.toLowerCase()] || item[col.replace(/\s/g, '')])) ||
              '-';
            return `<td>${value}</td>`;
          })
          .join('');
        return `<tr>${cells}</tr>`;
      })
      .join('');

    return `
      <h2>${title}</h2>
      <table>
        <thead><tr>${headersHtml}</tr></thead>
        <tbody>${rowsHtml}</tbody>
      </table>
      <p><strong>Total Records:</strong> ${Array.isArray(dataArr) ? dataArr.length : 1}</p>
    `;
  };

  // Export handlers for specific dataTypes (wrapping helpers above)
  const exportAppointmentsToCSV = (appointments) => exportToCSV(appointments, 'appointments');
  const exportAppointmentsToJSON = (appointments) => exportToJSON(appointments, 'appointments');
  const exportPrescriptionsToCSV = (prescriptions) => exportToCSV(prescriptions, 'prescriptions');
  const exportMedicalRecordsToCSV = (records) => exportToCSV(records, 'medical-records');
  const exportUserProfileToJSON = (profile) => exportToJSON(profile, 'user-profile');
  const exportAllData = async (allData) => {
    // For 'all' we simply create a JSON backup
    exportToJSON(allData, 'backup-all-data');
  };

  // Main handler invoked when a user selects an export format
  const handleExport = async (format) => {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      addToast(`No ${dataType} data available to export`, 'warning');
      return;
    }

    setLoading(true);
    try {
      switch (dataType) {
        case 'appointments':
          if (format === 'csv') {
            exportAppointmentsToCSV(data);
          } else if (format === 'json') {
            exportAppointmentsToJSON(data);
          } else if (format === 'print') {
            const tableHTML = generateTableHTML(data, 'Appointments', [
              'Date',
              'Time',
              'Doctor',
              'Specialization',
              'Status',
              'Notes',
            ]);
            printData(tableHTML, 'My Appointments - MediLink');
          }
          break;

        case 'prescriptions':
          if (format === 'csv') {
            exportPrescriptionsToCSV(data);
          } else if (format === 'print') {
            const tableHTML = generateTableHTML(data, 'Prescriptions', [
              'Medication',
              'Dosage',
              'Frequency',
              'Doctor',
              'Status',
            ]);
            printData(tableHTML, 'My Prescriptions - MediLink');
          }
          break;

        case 'medicalRecords':
          if (format === 'csv') {
            exportMedicalRecordsToCSV(data);
          } else if (format === 'print') {
            const tableHTML = generateTableHTML(data, 'Medical Records', [
              'Record Date',
              'Type',
              'Description',
              'Doctor',
              'Notes',
            ]);
            printData(tableHTML, 'My Medical Records - MediLink');
          }
          break;

        case 'profile':
          if (format === 'json') {
            exportUserProfileToJSON(data);
          }
          break;

        case 'all':
          if (format === 'json') {
            await exportAllData(data);
          }
          break;

        default:
          addToast('Export type not supported', 'error');
          setLoading(false);
          setShowMenu(false);
          return;
      }

      addToast(`Exported ${dataType} successfully!`, 'success');
    } catch (error) {
      console.error('Export error:', error);
      addToast('Failed to export data', 'error');
    } finally {
      setLoading(false);
      setShowMenu(false);
    }
  };

  const getButtonLabel = () => {
    if (loading) return 'Exporting...';
    if (!showLabel) return '';
    switch (dataType) {
      case 'all':
        return 'Backup Data';
      case 'profile':
        return 'Export Profile';
      default:
        return `Export ${dataType.charAt(0).toUpperCase() + dataType.slice(1)}`;
    }
  };

  const currentOptions = exportOptions[dataType] || [];

  return (
    <div className="export-container">
      <button
        className={`export-button export-button--${variant} export-button--${size} ${
          loading ? 'export-button--loading' : ''
        }`}
        onClick={() =>
          currentOptions.length === 1 ? handleExport(currentOptions[0].format) : setShowMenu(!showMenu)
        }
        disabled={loading}
      >
        {loading ? (
          <LoadingSpinner size="small" text="" />
        ) : (
          <>
            <span className="export-icon" aria-hidden>
              📥
            </span>
            <span className="export-label">{getButtonLabel()}</span>
            {currentOptions.length > 1 && <span className="export-arrow">▼</span>}
          </>
        )}
      </button>

      {showMenu && currentOptions.length > 1 && (
        <>
          <div className="export-overlay" onClick={() => setShowMenu(false)} />
          <div className="export-menu">
            {currentOptions.map((option, index) => (
              <button
                key={index}
                className="export-menu-item"
                onClick={() => handleExport(option.format)}
                type="button"
              >
                <span className="export-menu-icon" aria-hidden>
                  {option.icon}
                </span>
                <span className="export-menu-label">{option.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ExportButton;
