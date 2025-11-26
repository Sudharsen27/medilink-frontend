// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { useToast } from './ToastContext';

// const PatientProfileContext = createContext();

// export const usePatientProfile = () => {
//   const context = useContext(PatientProfileContext);
//   if (!context) {
//     throw new Error('usePatientProfile must be used within a PatientProfileProvider');
//   }
//   return context;
// };

// export const PatientProfileProvider = ({ children }) => {
//   const [patientProfile, setPatientProfile] = useState(null);
//   const [healthMetrics, setHealthMetrics] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { addToast } = useToast();

//   useEffect(() => {
//     fetchPatientProfile();
//     fetchHealthMetrics();
//   }, []);

//   const fetchPatientProfile = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');
      
//       const response = await fetch('/api/patient/profile', {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setPatientProfile(data.data || data);
//       } else {
//         throw new Error('Failed to fetch patient profile');
//       }
//     } catch (error) {
//       console.error('Error fetching patient profile:', error);
//       // Set fallback data
//       setPatientProfile(getFallbackProfile());
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchHealthMetrics = async () => {
//     try {
//       const token = localStorage.getItem('token');
      
//       const response = await fetch('/api/patient/health-metrics', {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setHealthMetrics(data.data || data.metrics || []);
//       }
//     } catch (error) {
//       console.error('Error fetching health metrics:', error);
//     }
//   };

//   const getFallbackProfile = () => {
//     return {
//       personal_info: {
//         full_name: '',
//         date_of_birth: '',
//         gender: '',
//         blood_type: '',
//         height: null,
//         weight: null,
//         emergency_contact: null
//       },
//       medical_history: {
//         conditions: [],
//         allergies: [],
//         medications: [],
//         surgeries: []
//       },
//       insurance_info: {
//         provider: '',
//         policy_number: '',
//         group_number: ''
//       },
//       preferences: {
//         language: 'en',
//         notifications: true,
//         theme: 'system'
//       }
//     };
//   };

//   const updateProfile = async (profileData) => {
//     try {
//       const token = localStorage.getItem('token');
      
//       const response = await fetch('/api/patient/profile', {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(profileData),
//       });

//       if (response.ok) {
//         const updatedProfile = await response.json();
//         setPatientProfile(updatedProfile.data || updatedProfile);
//         addToast('Profile updated successfully', 'success');
//         return updatedProfile;
//       } else {
//         throw new Error('Failed to update profile');
//       }
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       addToast('Failed to update profile', 'error');
//       throw error;
//     }
//   };

//   const addHealthMetric = async (metricData) => {
//     try {
//       const token = localStorage.getItem('token');
      
//       const response = await fetch('/api/patient/health-metrics', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(metricData),
//       });

//       if (response.ok) {
//         const newMetric = await response.json();
//         setHealthMetrics(prev => [newMetric.data || newMetric, ...prev]);
//         addToast('Health metric added successfully', 'success');
//         return newMetric;
//       } else {
//         throw new Error('Failed to add health metric');
//       }
//     } catch (error) {
//       console.error('Error adding health metric:', error);
//       addToast('Failed to add health metric', 'error');
//       throw error;
//     }
//   };

//   const getBMI = () => {
//     if (!patientProfile?.personal_info?.height || !patientProfile?.personal_info?.weight) {
//       return null;
//     }
    
//     const heightInMeters = patientProfile.personal_info.height / 100;
//     const bmi = patientProfile.personal_info.weight / (heightInMeters * heightInMeters);
//     return bmi.toFixed(1);
//   };

//   const getBMICategory = (bmi) => {
//     if (!bmi) return null;
    
//     if (bmi < 18.5) return { category: 'Underweight', color: 'yellow' };
//     if (bmi < 25) return { category: 'Normal', color: 'green' };
//     if (bmi < 30) return { category: 'Overweight', color: 'orange' };
//     return { category: 'Obese', color: 'red' };
//   };

//   const getAge = () => {
//     if (!patientProfile?.personal_info?.date_of_birth) return null;
    
//     const birthDate = new Date(patientProfile.personal_info.date_of_birth);
//     const today = new Date();
//     let age = today.getFullYear() - birthDate.getFullYear();
//     const monthDiff = today.getMonth() - birthDate.getMonth();
    
//     if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
//       age--;
//     }
    
//     return age;
//   };

//   const getRecentMetrics = (type, limit = 5) => {
//     return healthMetrics
//       .filter(metric => metric.metric_type === type)
//       .sort((a, b) => new Date(b.recorded_at) - new Date(a.recorded_at))
//       .slice(0, limit);
//   };

//   const getMetricTrend = (type) => {
//     const metrics = getRecentMetrics(type, 10);
//     if (metrics.length < 2) return 'stable';
    
//     const values = metrics.map(m => m.value);
//     const first = values[0];
//     const last = values[values.length - 1];
    
//     if (last > first * 1.05) return 'increasing';
//     if (last < first * 0.95) return 'decreasing';
//     return 'stable';
//   };

//   const value = {
//     patientProfile,
//     healthMetrics,
//     loading,
//     fetchPatientProfile,
//     updateProfile,
//     addHealthMetric,
//     getBMI,
//     getBMICategory,
//     getAge,
//     getRecentMetrics,
//     getMetricTrend
//   };

//   return (
//     <PatientProfileContext.Provider value={value}>
//       {children}
//     </PatientProfileContext.Provider>
//   );
// };

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";

import { useToast } from "./ToastContext";

const PatientProfileContext = createContext();

export const usePatientProfile = () => {
  const context = useContext(PatientProfileContext);
  if (!context) {
    throw new Error(
      "usePatientProfile must be used within a PatientProfileProvider"
    );
  }
  return context;
};

export const PatientProfileProvider = ({ children }) => {
  const [patientProfile, setPatientProfile] = useState(null);
  const [healthMetrics, setHealthMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  // ----------------------------------------------------
  // 🔄 Fetch Patient Profile (Wrapped in useCallback)
  // ----------------------------------------------------
  const fetchPatientProfile = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch("/api/patient/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPatientProfile(data.data || data);
      } else {
        throw new Error("Failed to fetch patient profile");
      }
    } catch (error) {
      console.error("Error fetching patient profile:", error);

      // fallback data
      setPatientProfile(getFallbackProfile());
    } finally {
      setLoading(false);
    }
  }, []);

  // ----------------------------------------------------
  // 🔄 Fetch Health Metrics (Wrapped in useCallback)
  // ----------------------------------------------------
  const fetchHealthMetrics = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("/api/patient/health-metrics", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setHealthMetrics(data.data || data.metrics || []);
      }
    } catch (error) {
      console.error("Error fetching health metrics:", error);
    }
  }, []);

  // ----------------------------------------------------
  // ✔ Corrected useEffect with safe dependencies
  // ----------------------------------------------------
  useEffect(() => {
    fetchPatientProfile();
    fetchHealthMetrics();
  }, [fetchPatientProfile, fetchHealthMetrics]);

  // ----------------------------------------------------
  // Fallback profile for errors
  // ----------------------------------------------------
  const getFallbackProfile = () => ({
    personal_info: {
      full_name: "",
      date_of_birth: "",
      gender: "",
      blood_type: "",
      height: null,
      weight: null,
      emergency_contact: null,
    },
    medical_history: {
      conditions: [],
      allergies: [],
      medications: [],
      surgeries: [],
    },
    insurance_info: {
      provider: "",
      policy_number: "",
      group_number: "",
    },
    preferences: {
      language: "en",
      notifications: true,
      theme: "system",
    },
  });

  // ----------------------------------------------------
  // Update patient profile
  // ----------------------------------------------------
  const updateProfile = useCallback(
    async (profileData) => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("/api/patient/profile", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profileData),
        });

        if (response.ok) {
          const updatedProfile = await response.json();
          setPatientProfile(updatedProfile.data || updatedProfile);

          addToast("Profile updated successfully", "success");
          return updatedProfile;
        } else {
          throw new Error("Failed to update profile");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        addToast("Failed to update profile", "error");
        throw error;
      }
    },
    [addToast]
  );

  // ----------------------------------------------------
  // Add new health metric
  // ----------------------------------------------------
  const addHealthMetric = useCallback(
    async (metricData) => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("/api/patient/health-metrics", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(metricData),
        });

        if (response.ok) {
          const newMetric = await response.json();

          setHealthMetrics((prev) => [newMetric.data || newMetric, ...prev]);
          addToast("Health metric added successfully", "success");

          return newMetric;
        } else {
          throw new Error("Failed to add health metric");
        }
      } catch (error) {
        console.error("Error adding health metric:", error);
        addToast("Failed to add health metric", "error");
        throw error;
      }
    },
    [addToast]
  );

  // ----------------------------------------------------
  // Helpers
  // ----------------------------------------------------
  const getBMI = () => {
    const h = patientProfile?.personal_info?.height;
    const w = patientProfile?.personal_info?.weight;

    if (!h || !w) return null;

    const meters = h / 100;
    return (w / (meters * meters)).toFixed(1);
  };

  const getBMICategory = (bmi) => {
    if (!bmi) return null;

    if (bmi < 18.5) return { category: "Underweight", color: "yellow" };
    if (bmi < 25) return { category: "Normal", color: "green" };
    if (bmi < 30) return { category: "Overweight", color: "orange" };
    return { category: "Obese", color: "red" };
  };

  const getAge = () => {
    const dob = patientProfile?.personal_info?.date_of_birth;
    if (!dob) return null;

    const birth = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const diff = today.getMonth() - birth.getMonth();

    if (diff < 0 || (diff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  };

  const getRecentMetrics = (type, limit = 5) =>
    healthMetrics
      .filter((m) => m.metric_type === type)
      .sort((a, b) => new Date(b.recorded_at) - new Date(a.recorded_at))
      .slice(0, limit);

  const getMetricTrend = (type) => {
    const metrics = getRecentMetrics(type, 10);
    if (metrics.length < 2) return "stable";

    const values = metrics.map((m) => m.value);
    const first = values[0];
    const last = values[values.length - 1];

    if (last > first * 1.05) return "increasing";
    if (last < first * 0.95) return "decreasing";
    return "stable";
  };

  // ----------------------------------------------------
  // Provided value
  // ----------------------------------------------------
  const value = {
    patientProfile,
    healthMetrics,
    loading,
    fetchPatientProfile,
    updateProfile,
    addHealthMetric,
    getBMI,
    getBMICategory,
    getAge,
    getRecentMetrics,
    getMetricTrend,
  };

  return (
    <PatientProfileContext.Provider value={value}>
      {children}
    </PatientProfileContext.Provider>
  );
};
