// components/HealthCheck.js
import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';

const HealthCheck = () => {
  const [healthStatus, setHealthStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const checkHealth = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/health');
      const data = await response.json();
      
      setHealthStatus(data);
      
      if (data.status === 'OK') {
        addToast('Backend is healthy ✅', 'success');
      } else {
        addToast('Backend issues detected ⚠️', 'warning');
      }
    } catch (error) {
      console.error('Health check failed:', error);
      setHealthStatus({ status: 'ERROR', error: error.message });
      addToast('Backend connection failed ❌', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-check on component mount
    checkHealth();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">System Health Status</h3>
        <button
          onClick={checkHealth}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-md text-sm transition-colors"
        >
          {loading ? 'Checking...' : 'Refresh Status'}
        </button>
      </div>

      {healthStatus && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Overall Status:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              healthStatus.status === 'OK' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
            }`}>
              {healthStatus.status}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Database:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              healthStatus.database === 'Connected'
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
            }`}>
              {healthStatus.database}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Environment:</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-sm">
              {healthStatus.environment}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Uptime:</span>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {healthStatus.uptime ? Math.floor(healthStatus.uptime) + ' seconds' : 'N/A'}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Last Check:</span>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {healthStatus.timestamp ? new Date(healthStatus.timestamp).toLocaleTimeString() : 'N/A'}
            </span>
          </div>

          {healthStatus.error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
              <p className="text-red-700 dark:text-red-300 text-sm">
                <strong>Error:</strong> {healthStatus.error}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HealthCheck;