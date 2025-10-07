import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MedicalRecords = ({ user }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRecord, setNewRecord] = useState({
    record_type: '',
    title: '',
    description: '',
    record_date: ''
  });

  useEffect(() => {
    fetchMedicalRecords();
  }, []);

  const fetchMedicalRecords = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/medical-records', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecords(response.data);
    } catch (error) {
      console.error('Error fetching medical records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/medical-records', newRecord, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNewRecord({
        record_type: '',
        title: '',
        description: '',
        record_date: ''
      });
      setShowAddForm(false);
      fetchMedicalRecords(); // Refresh the list
    } catch (error) {
      console.error('Error adding medical record:', error);
    }
  };

  const downloadRecord = (recordId, recordTitle) => {
    // Simulate download functionality
    alert(`Downloading: ${recordTitle}`);
    // In real implementation, this would download the actual file
  };

  const getRecordTypeColor = (type) => {
    const colors = {
      'lab_report': 'bg-blue-100 text-blue-800',
      'prescription': 'bg-green-100 text-green-800',
      'scan': 'bg-purple-100 text-purple-800',
      'surgery': 'bg-red-100 text-red-800',
      'consultation': 'bg-yellow-100 text-yellow-800',
      'other': 'bg-gray-100 text-gray-800'
    };
    return colors[type] || colors['other'];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Medical Records</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add New Record
        </button>
      </div>

      {/* Add Record Form */}
      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Medical Record</h2>
          <form onSubmit={handleAddRecord} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Record Type
                </label>
                <select
                  value={newRecord.record_type}
                  onChange={(e) => setNewRecord({...newRecord, record_type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="lab_report">Lab Report</option>
                  <option value="prescription">Prescription</option>
                  <option value="scan">Scan Report</option>
                  <option value="surgery">Surgery Report</option>
                  <option value="consultation">Consultation Note</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Record Date
                </label>
                <input
                  type="date"
                  value={newRecord.record_date}
                  onChange={(e) => setNewRecord({...newRecord, record_date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={newRecord.title}
                onChange={(e) => setNewRecord({...newRecord, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter record title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={newRecord.description}
                onChange={(e) => setNewRecord({...newRecord, description: e.target.value})}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter record description"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Add Record
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Records List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        {records.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">📁</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No medical records found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Get started by adding your first medical record.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {records.map(record => (
              <div key={record.id} className="border dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRecordTypeColor(record.record_type)}`}>
                        {record.record_type.replace('_', ' ').toUpperCase()}
                      </span>
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                        {record.title}
                      </h3>
                    </div>
                    
                    {record.description && (
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {record.description}
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>Date: {new Date(record.record_date).toLocaleDateString()}</span>
                      <span>Added: {new Date(record.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => downloadRecord(record.id, record.title)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Download
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors">
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalRecords;