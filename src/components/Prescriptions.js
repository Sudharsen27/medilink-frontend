import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Prescriptions = ({ user }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/prescriptions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPrescriptions(response.data);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPrescription = (prescriptionId) => {
    // Simulate PDF download
    alert(`Downloading prescription #${prescriptionId}`);
    // In real implementation, this would generate and download a PDF
  };

  // Removed unused formatMedication function

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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Prescriptions</h1>
        <span className="text-gray-600 dark:text-gray-400">
          {prescriptions.length} prescription(s) found
        </span>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        {prescriptions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">💊</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No prescriptions found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Your prescriptions will appear here after consultations.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {prescriptions.map(prescription => (
              <div key={prescription.id} className="border dark:border-gray-600 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400 font-semibold">Dr.</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                        Dr. {prescription.doctor_name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">{prescription.doctor_specialization}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      Completed
                    </span>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(prescription.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {prescription.diagnosis && (
                  <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Diagnosis</h4>
                    <p className="text-yellow-700 dark:text-yellow-300">{prescription.diagnosis}</p>
                  </div>
                )}

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Medications</h4>
                  <div className="space-y-3">
                    {prescription.medications.map((medication, index) => (
                      <div key={index} className="flex justify-between items-center py-3 border-b dark:border-gray-600 last:border-b-0">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 dark:text-blue-400 text-sm">💊</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-900 dark:text-white">{medication.name}</span>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {medication.dosage} • {medication.frequency}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          {medication.duration}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {prescription.instructions && (
                  <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Instructions</h4>
                    <p className="text-blue-700 dark:text-blue-300">{prescription.instructions}</p>
                  </div>
                )}

                {prescription.follow_up_date && (
                  <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Follow-up</h4>
                    <p className="text-green-700 dark:text-green-300">
                      Scheduled for {new Date(prescription.follow_up_date).toLocaleDateString()}
                    </p>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4 border-t dark:border-gray-600">
                  <button
                    onClick={() => setSelectedPrescription(selectedPrescription?.id === prescription.id ? null : prescription)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
                  >
                    {selectedPrescription?.id === prescription.id ? 'Hide Details' : 'View Details'}
                  </button>
                  <button
                    onClick={() => downloadPrescription(prescription.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                  >
                    Download PDF
                  </button>
                </div>

                {/* Detailed View */}
                {selectedPrescription?.id === prescription.id && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h5 className="font-semibold mb-3">Prescription Details</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Doctor:</strong> Dr. {prescription.doctor_name}
                      </div>
                      <div>
                        <strong>Specialization:</strong> {prescription.doctor_specialization}
                      </div>
                      <div>
                        <strong>Date Issued:</strong> {new Date(prescription.created_at).toLocaleDateString()}
                      </div>
                      <div>
                        <strong>Valid Until:</strong> {new Date(new Date(prescription.created_at).setDate(new Date(prescription.created_at).getDate() + 30)).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Prescriptions;