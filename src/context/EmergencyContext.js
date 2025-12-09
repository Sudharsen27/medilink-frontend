

// import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
// import { useToast } from './ToastContext';

// const EmergencyContext = createContext();

// export const useEmergency = () => {
//   const context = useContext(EmergencyContext);
//   if (!context) {
//     throw new Error('useEmergency must be used within a EmergencyProvider');
//   }
//   return context;
// };

// export const EmergencyProvider = ({ children }) => {
//   const [emergencyContacts, setEmergencyContacts] = useState([]);
//   const [medicalInfo, setMedicalInfo] = useState(null);
//   const [emergencyMode, setEmergencyMode] = useState(false);
//   const [emergencyInProgress, setEmergencyInProgress] = useState(false);
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [emergencyServices, setEmergencyServices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [countdown, setCountdown] = useState(5);
//   const { addToast } = useToast();

//   // For countdown timer
//   const [countdownActive, setCountdownActive] = useState(false);
//   const [countdownInterval, setCountdownInterval] = useState(null);

//   const getDefaultMedicalInfo = useCallback(() => ({
//     blood_type: 'Not specified',
//     allergies: [],
//     medications: [],
//     conditions: [],
//     emergency_notes: '',
//     doctor_name: '',
//     doctor_phone: '',
//     insurance_provider: '',
//     insurance_id: ''
//   }), []);

//   const getDefaultContacts = useCallback(() => [
//     { id: 1, name: 'Emergency Contact 1', phone: '', relationship: 'Family', is_primary: true },
//     { id: 2, name: 'Emergency Contact 2', phone: '', relationship: 'Friend', is_primary: false },
//     { id: 3, name: 'Emergency Contact 3', phone: '', relationship: 'Doctor', is_primary: false }
//   ], []);

//   const getDefaultServices = useCallback(() => [
//     { id: 1, name: 'National Emergency Number', number: '112', type: 'general' },
//     { id: 2, name: 'Ambulance', number: '108', type: 'ambulance' },
//     { id: 3, name: 'Police', number: '100', type: 'police' },
//     { id: 4, name: 'Fire', number: '101', type: 'fire' }
//   ], []);

//   const fetchEmergencyData = useCallback(async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');
      
//       const [contactsRes, infoRes, servicesRes] = await Promise.all([
//         fetch('/api/emergency/contacts', {
//           headers: { 'Authorization': `Bearer ${token}` },
//         }),
//         fetch('/api/emergency/medical-info', {
//           headers: { 'Authorization': `Bearer ${token}` },
//         }),
//         fetch('/api/emergency/services', {
//           headers: { 'Authorization': `Bearer ${token}` },
//         })
//       ]);

//       if (contactsRes.ok) {
//         const contactsData = await contactsRes.json();
//         setEmergencyContacts(contactsData.data || contactsData.contacts || getDefaultContacts());
//       }

//       if (infoRes.ok) {
//         const infoData = await infoRes.json();
//         setMedicalInfo(infoData.data || infoData.medical_info || getDefaultMedicalInfo());
//       }

//       if (servicesRes.ok) {
//         const servicesData = await servicesRes.json();
//         setEmergencyServices(servicesData.data || servicesData.services || getDefaultServices());
//       }

//     } catch (error) {
//       console.error('Error fetching emergency data:', error);
//       // Set defaults if fetch fails
//       setEmergencyContacts(getDefaultContacts());
//       setMedicalInfo(getDefaultMedicalInfo());
//       setEmergencyServices(getDefaultServices());
//     } finally {
//       setLoading(false);
//     }
//   }, [getDefaultContacts, getDefaultMedicalInfo, getDefaultServices]);

//   const initializeLocationTracking = useCallback(() => {
//     if ('geolocation' in navigator) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setCurrentLocation({
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude,
//             accuracy: position.coords.accuracy,
//             timestamp: new Date().toISOString()
//           });
//         },
//         (error) => {
//           console.error('Error getting location:', error);
//           addToast('Location access is required for emergency features', 'warning');
//         },
//         { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
//       );
//     }
//   }, [addToast]);

//   useEffect(() => {
//     fetchEmergencyData();
//     initializeLocationTracking();
    
//     return () => {
//       if (countdownInterval) clearInterval(countdownInterval);
//     };
//   }, [fetchEmergencyData, initializeLocationTracking, countdownInterval]);
// const startEmergencyCountdown = useCallback(() => {
//   setCountdownActive(true);
//   setCountdown(5);
  
//   const interval = setInterval(() => {
//     setCountdown(prev => {
//       if (prev <= 1) {
//         clearInterval(interval);
//         triggerEmergency();
//         return 0;
//       }
//       return prev - 1;
//     });
//   }, 1000);
  
//   setCountdownInterval(interval);
// }, [triggerEmergency]);


//   const cancelEmergency = useCallback(() => {
//     if (countdownInterval) {
//       clearInterval(countdownInterval);
//       setCountdownInterval(null);
//     }
//     setCountdownActive(false);
//     setCountdown(5);
//     addToast('Emergency cancelled', 'success');
//   }, [countdownInterval, addToast]);

//   const triggerEmergency = useCallback(async () => {
//     try {
//       setEmergencyInProgress(true);
//       setEmergencyMode(true);
      
//       const token = localStorage.getItem('token');
//       const emergencyData = {
//         location: currentLocation,
//         medical_info: medicalInfo,
//         timestamp: new Date().toISOString()
//       };

//       const response = await fetch('/api/emergency/trigger', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(emergencyData),
//       });

//       if (response.ok) {
//         const result = await response.json();
//         addToast('Emergency services alerted! Help is on the way.', 'success');
        
//         // Send SMS to emergency contacts
//         await notifyEmergencyContacts();
        
//         return result;
//       } else {
//         throw new Error('Failed to trigger emergency');
//       }
//     } catch (error) {
//       console.error('Error triggering emergency:', error);
//       addToast('Failed to trigger emergency. Please try again.', 'error');
//       // Fallback: Direct emergency number call
//       window.location.href = 'tel:112';
//     }
//   }, []);

//   const notifyEmergencyContacts = useCallback(async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const userName = localStorage.getItem('userName') || 'User';
      
//       await Promise.all(
//         emergencyContacts
//           .filter(contact => contact.phone && contact.is_primary)
//           .map(contact =>
//             fetch('/api/emergency/notify-contact', {
//               method: 'POST',
//               headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json',
//               },
//               body: JSON.stringify({
//                 contact_id: contact.id,
//                 message: `EMERGENCY ALERT: ${userName} has triggered an emergency SOS. Location: ${currentLocation ? `https://maps.google.com/?q=${currentLocation.latitude},${currentLocation.longitude}` : 'Location not available'}. Please check immediately.`
//               }),
//             })
//           )
//       );
//     } catch (error) {
//       console.error('Error notifying contacts:', error);
//     }
//   }, [emergencyContacts, currentLocation,addToast]);

//   const connectEmergencyDoctor = useCallback(async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch('/api/emergency/connect-doctor', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           location: currentLocation,
//           medical_info: medicalInfo
//         }),
//       });

//       if (response.ok) {
//         const result = await response.json();
//         addToast('Connecting to emergency doctor...', 'success');
//         // In a real app, this would initiate a video call
//         return result;
//       } else {
//         throw new Error('Failed to connect to doctor');
//       }
//     } catch (error) {
//       console.error('Error connecting to doctor:', error);
//       addToast('Could not connect to doctor. Please try calling directly.', 'error');
//     }
//   }, [currentLocation, medicalInfo, addToast]);

//   const dispatchAmbulance = useCallback(async (hospitalName = null) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch('/api/emergency/dispatch-ambulance', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           location: currentLocation,
//           medical_info: medicalInfo,
//           hospital_name: hospitalName,
//           estimated_arrival: '10-15 minutes'
//         }),
//       });

//       if (response.ok) {
//         const result = await response.json();
//         addToast('Ambulance dispatched! ETA: 10-15 minutes', 'success');
//         return result;
//       } else {
//         throw new Error('Failed to dispatch ambulance');
//       }
//     } catch (error) {
//       console.error('Error dispatching ambulance:', error);
//       addToast('Could not dispatch ambulance. Please call 108 directly.', 'error');
//     }
//   }, [currentLocation, medicalInfo, addToast]);

//   const updateMedicalInfo = useCallback(async (infoData) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch('/api/emergency/medical-info', {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(infoData),
//       });

//       if (response.ok) {
//         const updatedInfo = await response.json();
//         setMedicalInfo(updatedInfo.data || updatedInfo);
//         addToast('Medical information updated', 'success');
//         return updatedInfo;
//       } else {
//         throw new Error('Failed to update medical info');
//       }
//     } catch (error) {
//       console.error('Error updating medical info:', error);
//       addToast('Failed to update medical information', 'error');
//       throw error;
//     }
//   }, [addToast]);

//   const updateEmergencyContacts = useCallback(async (contacts) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch('/api/emergency/contacts', {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ contacts }),
//       });

//       if (response.ok) {
//         const updatedContacts = await response.json();
//         setEmergencyContacts(updatedContacts.data || updatedContacts.contacts);
//         addToast('Emergency contacts updated', 'success');
//         return updatedContacts;
//       } else {
//         throw new Error('Failed to update contacts');
//       }
//     } catch (error) {
//       console.error('Error updating emergency contacts:', error);
//       addToast('Failed to update emergency contacts', 'error');
//       throw error;
//     }
//   }, [addToast]);

//   // FIXED: getNearbyHospitals function with REAL location-based hospitals
//   const getNearbyHospitals = useCallback(async () => {
//     try {
//       if (!currentLocation) return [];
      
//       // Try multiple APIs with fallbacks
//       let hospitals = [];
      
//       // Option 1: Use our own backend API (recommended - no CORS issues)
//       try {
//         const token = localStorage.getItem('token');
//         const response = await fetch('/api/emergency/nearby-hospitals', {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             latitude: currentLocation.latitude,
//             longitude: currentLocation.longitude,
//             radius: 10 // 10km radius
//           })
//         });
        
//         if (response.ok) {
//           const data = await response.json();
//           hospitals = data.data || data.hospitals || [];
//         }
//       } catch (backendError) {
//         console.log('Backend API failed, trying public API...');
//       }
      
//       // Option 2: Use public API (OpenStreetMap with proper headers)
//       if (hospitals.length === 0) {
//         try {
//           const response = await fetch(
//             `https://nominatim.openstreetmap.org/search?` +
//             `format=json&` +
//             `q=hospital&` +
//             `limit=10&` +
//             `bounded=1&` +
//             `viewbox=` +
//             `${currentLocation.longitude - 0.1},${currentLocation.latitude - 0.1},` +
//             `${currentLocation.longitude + 0.1},${currentLocation.latitude + 0.1}`,
//             {
//               headers: {
//                 'Accept': 'application/json',
//                 'User-Agent': 'MediLink-Emergency-App/1.0'
//               }
//             }
//           );
          
//           if (response.ok) {
//             const data = await response.json();
//             hospitals = data.slice(0, 5).map(hospital => ({
//               name: hospital.display_name.split(',')[0],
//               latitude: parseFloat(hospital.lat),
//               longitude: parseFloat(hospital.lon),
//               distance: calculateDistance(
//                 currentLocation.latitude,
//                 currentLocation.longitude,
//                 parseFloat(hospital.lat),
//                 parseFloat(hospital.lon)
//               ),
//               address: hospital.display_name
//             }));
//           }
//         } catch (osmError) {
//           console.log('OpenStreetMap failed, using Overpass API...');
//         }
//       }
      
//       // Option 3: Use Overpass API (more reliable for OSM data)
//       if (hospitals.length === 0) {
//         try {
//           const overpassQuery = `
//             [out:json][timeout:25];
//             (
//               node["amenity"="hospital"](around:5000,${currentLocation.latitude},${currentLocation.longitude});
//               way["amenity"="hospital"](around:5000,${currentLocation.latitude},${currentLocation.longitude});
//               relation["amenity"="hospital"](around:5000,${currentLocation.latitude},${currentLocation.longitude});
//             );
//             out body;
//             >;
//             out skel qt;
//           `;
          
//           const response = await fetch(
//             `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`
//           );
          
//           if (response.ok) {
//             const data = await response.json();
//             hospitals = data.elements
//               .filter(element => element.tags && element.tags.name)
//               .slice(0, 5)
//               .map(element => ({
//                 name: element.tags.name,
//                 latitude: element.lat || element.center?.lat || currentLocation.latitude + (Math.random() * 0.02 - 0.01),
//                 longitude: element.lon || element.center?.lon || currentLocation.longitude + (Math.random() * 0.02 - 0.01),
//                 distance: calculateDistance(
//                   currentLocation.latitude,
//                   currentLocation.longitude,
//                   element.lat || element.center?.lat || currentLocation.latitude,
//                   element.lon || element.center?.lon || currentLocation.longitude
//                 ),
//                 address: element.tags['addr:full'] || element.tags['addr:street'] || 'Address not available'
//               }));
//           }
//         } catch (overpassError) {
//           console.log('Overpass API failed, using mock data...');
//         }
//       }
      
//       // Option 4: Smart mock data based on user's location
//       if (hospitals.length === 0) {
//         const majorCities = {
//           // Delhi NCR
//           'delhi': [
//             { name: 'AIIMS Delhi', city: 'Delhi', lat: 28.5675, lon: 77.2111 },
//             { name: 'Max Super Speciality Hospital', city: 'Delhi', lat: 28.5546, lon: 77.2561 },
//             { name: 'Sir Ganga Ram Hospital', city: 'Delhi', lat: 28.6353, lon: 77.2250 }
//           ],
//           // Mumbai
//           'mumbai': [
//             { name: 'Kokilaben Dhirubhai Ambani Hospital', city: 'Mumbai', lat: 19.1362, lon: 72.8256 },
//             { name: 'Lilavati Hospital', city: 'Mumbai', lat: 19.1146, lon: 72.8346 },
//             { name: 'Bombay Hospital', city: 'Mumbai', lat: 18.9421, lon: 72.8317 }
//           ],
//           // Bangalore
//           'bangalore': [
//             { name: 'Apollo Hospitals', city: 'Bangalore', lat: 12.9716, lon: 77.5946 },
//             { name: 'Manipal Hospital', city: 'Bangalore', lat: 12.9308, lon: 77.5838 },
//             { name: 'Fortis Hospital', city: 'Bangalore', lat: 12.9110, lon: 77.6413 }
//           ],
//           // Chennai
//           'chennai': [
//             { name: 'Apollo Hospitals', city: 'Chennai', lat: 13.0604, lon: 80.2496 },
//             { name: 'MIOT International', city: 'Chennai', lat: 13.0303, lon: 80.2020 },
//             { name: 'Fortis Malar Hospital', city: 'Chennai', lat: 13.0329, lon: 80.2578 }
//           ],
//           // Hyderabad
//           'hyderabad': [
//             { name: 'Apollo Hospitals', city: 'Hyderabad', lat: 17.4483, lon: 78.3915 },
//             { name: 'KIMS Hospitals', city: 'Hyderabad', lat: 17.4254, lon: 78.4260 },
//             { name: 'Yashoda Hospitals', city: 'Hyderabad', lat: 17.4389, lon: 78.4443 }
//           ],
//           // Kolkata
//           'kolkata': [
//             { name: 'Apollo Gleneagles Hospitals', city: 'Kolkata', lat: 22.5735, lon: 88.4331 },
//             { name: 'AMRI Hospitals', city: 'Kolkata', lat: 22.5083, lon: 88.3697 },
//             { name: 'Medica Superspecialty Hospital', city: 'Kolkata', lat: 22.4967, lon: 88.3642 }
//           ]
//         };
        
//         // Determine which city the user is closest to
//         const distances = Object.entries(majorCities).map(([city, cityHospitals]) => {
//           const cityCenter = cityHospitals[0];
//           const distance = calculateDistance(
//             currentLocation.latitude,
//             currentLocation.longitude,
//             cityCenter.lat,
//             cityCenter.lon
//           );
//           return { city, distance };
//         });
        
//         distances.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
//         const closestCity = distances[0]?.city;
        
//         if (closestCity && majorCities[closestCity]) {
//           hospitals = majorCities[closestCity].map(hospital => ({
//             name: hospital.name,
//             latitude: hospital.lat,
//             longitude: hospital.lon,
//             distance: calculateDistance(
//               currentLocation.latitude,
//               currentLocation.longitude,
//               hospital.lat,
//               hospital.lon
//             ),
//             address: `${hospital.name}, ${hospital.city}`
//           }));
//         }
//       }

//       // Sort by distance and return
//       hospitals.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
//       return hospitals.slice(0, 5);

//     } catch (error) {
//       console.error('Error fetching hospitals:', error);
//       // Return empty array instead of throwing
//       return [];
//     }
//   }, [currentLocation]);

//   const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
//     const R = 6371; // Earth's radius in km
//     const dLat = (lat2 - lat1) * Math.PI / 180;
//     const dLon = (lon2 - lon1) * Math.PI / 180;
//     const a = 
//       Math.sin(dLat/2) * Math.sin(dLat/2) +
//       Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
//       Math.sin(dLon/2) * Math.sin(dLon/2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//     return (R * c).toFixed(1); // Distance in km
//   }, []);

//   const endEmergency = useCallback(async () => {
//     try {
//       setEmergencyInProgress(false);
//       setEmergencyMode(false);
      
//       const token = localStorage.getItem('token');
//       await fetch('/api/emergency/end', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });
      
//       addToast('Emergency mode ended', 'success');
//     } catch (error) {
//       console.error('Error ending emergency:', error);
//     }
//   }, [addToast]);

//   const value = {
//     // State
//     emergencyContacts,
//     medicalInfo,
//     emergencyMode,
//     emergencyInProgress,
//     currentLocation,
//     emergencyServices,
//     loading,
//     countdown,
//     countdownActive,
    
//     // Actions
//     fetchEmergencyData,
//     startEmergencyCountdown,
//     cancelEmergency,
//     triggerEmergency,
//     connectEmergencyDoctor,
//     dispatchAmbulance,
//     updateMedicalInfo,
//     updateEmergencyContacts,
//     getNearbyHospitals,
//     endEmergency,
//     initializeLocationTracking
//   };

//   return (
//     <EmergencyContext.Provider value={value}>
//       {children}
//     </EmergencyContext.Provider>
//   );
// };

// import React, {
//   createContext,
//   useState,
//   useContext,
//   useEffect,
//   useCallback,
// } from "react";
// import { useToast } from "./ToastContext";

// const EmergencyContext = createContext();

// export const useEmergency = () => {
//   const context = useContext(EmergencyContext);
//   if (!context) {
//     throw new Error("useEmergency must be used within an EmergencyProvider");
//   }
//   return context;
// };

// export const EmergencyProvider = ({ children }) => {
//   const { addToast } = useToast();

//   /* =======================
//      STATE
//   ======================= */
//   const [emergencyContacts, setEmergencyContacts] = useState([]);
//   const [medicalInfo, setMedicalInfo] = useState(null);
//   const [emergencyMode, setEmergencyMode] = useState(false);
//   const [emergencyInProgress, setEmergencyInProgress] = useState(false);
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [emergencyServices, setEmergencyServices] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [countdown, setCountdown] = useState(5);
//   const [countdownActive, setCountdownActive] = useState(false);
//   const [countdownInterval, setCountdownInterval] = useState(null);

//   /* =======================
//      DEFAULT DATA
//   ======================= */
//   const getDefaultMedicalInfo = useCallback(
//     () => ({
//       blood_type: "Not specified",
//       allergies: [],
//       medications: [],
//       conditions: [],
//       emergency_notes: "",
//       doctor_name: "",
//       doctor_phone: "",
//       insurance_provider: "",
//       insurance_id: "",
//     }),
//     []
//   );

//   const getDefaultContacts = useCallback(
//     () => [
//       { id: 1, name: "Emergency Contact 1", phone: "", relationship: "Family", is_primary: true },
//       { id: 2, name: "Emergency Contact 2", phone: "", relationship: "Friend", is_primary: false },
//     ],
//     []
//   );

//   const getDefaultServices = useCallback(
//     () => [
//       { id: 1, name: "Emergency", number: "112", type: "general" },
//       { id: 2, name: "Ambulance", number: "108", type: "ambulance" },
//       { id: 3, name: "Police", number: "100", type: "police" },
//       { id: 4, name: "Fire", number: "101", type: "fire" },
//     ],
//     []
//   );

//   /* =======================
//      DISTANCE HELPER
//   ======================= */
//   // const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
//   //   const R = 6371;
//   //   const dLat = ((lat2 - lat1) * Math.PI) / 180;
//   //   const dLon = ((lon2 - lon1) * Math.PI) / 180;
//   //   const a =
//   //     Math.sin(dLat / 2) ** 2 +
//   //     Math.cos((lat1 * Math.PI) / 180) *
//   //       Math.cos((lat2 * Math.PI) / 180) *
//   //       Math.sin(dLon / 2) ** 2;
//   //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   //   return (R * c).toFixed(1);
//   // }, []);

//   /* =======================
//      LOCATION
//   ======================= */
//   const initializeLocationTracking = useCallback(() => {
//     if (!navigator.geolocation) return;

//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         setCurrentLocation({
//           latitude: pos.coords.latitude,
//           longitude: pos.coords.longitude,
//         });
//       },
//       () => addToast("Location permission is required", "warning")
//     );
//   }, [addToast]);

//   /* =======================
//      FETCH EMERGENCY DATA
//   ======================= */
//   const fetchEmergencyData = useCallback(async () => {
//     try {
//       setLoading(true);
//       setEmergencyContacts(getDefaultContacts());
//       setMedicalInfo(getDefaultMedicalInfo());
//       setEmergencyServices(getDefaultServices());
//     } finally {
//       setLoading(false);
//     }
//   }, [getDefaultContacts, getDefaultMedicalInfo, getDefaultServices]);

//   useEffect(() => {
//     fetchEmergencyData();
//     initializeLocationTracking();
//     return () => countdownInterval && clearInterval(countdownInterval);
//   }, [fetchEmergencyData, initializeLocationTracking, countdownInterval]);

//   /* =======================
//      NOTIFY CONTACTS
//   ======================= */
//   const notifyEmergencyContacts = useCallback(async () => {
//     try {
//       const token = localStorage.getItem("token");
//       await Promise.all(
//         emergencyContacts
//           .filter((c) => c.phone && c.is_primary)
//           .map((c) =>
//             fetch("/api/emergency/notify-contact", {
//               method: "POST",
//               headers: {
//                 Authorization: `Bearer ${token}`,
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify({
//                 contact_id: c.id,
//                 location: currentLocation,
//               }),
//             })
//           )
//       );
//     } catch (err) {
//       console.error("Notify contacts failed", err);
//     }
//   }, [emergencyContacts, currentLocation]);

//   /* =======================
//      TRIGGER EMERGENCY
//   ======================= */
//   const triggerEmergency = useCallback(async () => {
//     try {
//       setEmergencyMode(true);
//       setEmergencyInProgress(true);
//       await notifyEmergencyContacts();
//       addToast("Emergency triggered! Help is on the way.", "success");
//     } catch {
//       window.location.href = "tel:112";
//     }
//   }, [notifyEmergencyContacts, addToast]);

//   /* =======================
//      COUNTDOWN
//   ======================= */
//   const startEmergencyCountdown = useCallback(() => {
//     setCountdownActive(true);
//     setCountdown(5);

//     const interval = setInterval(() => {
//       setCountdown((prev) => {
//         if (prev <= 1) {
//           clearInterval(interval);
//           triggerEmergency();
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     setCountdownInterval(interval);
//   }, [triggerEmergency]);

//   const cancelEmergency = useCallback(() => {
//     if (countdownInterval) clearInterval(countdownInterval);
//     setCountdownInterval(null);
//     setCountdownActive(false);
//     setCountdown(5);
//     addToast("Emergency cancelled", "info");
//   }, [countdownInterval, addToast]);

//   /* =======================
//      HOSPITALS (SAFE)
//   ======================= */
//   const getNearbyHospitals = useCallback(async () => {
//     if (!currentLocation) return [];
//     return [
//       {
//         name: "Nearby Hospital",
//         latitude: currentLocation.latitude,
//         longitude: currentLocation.longitude,
//         distance: "1.0",
//       },
//     ];
//   }, [currentLocation]);

//   const endEmergency = useCallback(() => {
//     setEmergencyMode(false);
//     setEmergencyInProgress(false);
//     addToast("Emergency ended", "success");
//   }, [addToast]);

//   /* =======================
//      CONTEXT VALUE
//   ======================= */
//   return (
//     <EmergencyContext.Provider
//       value={{
//         emergencyContacts,
//         medicalInfo,
//         emergencyMode,
//         emergencyInProgress,
//         currentLocation,
//         emergencyServices,
//         loading,
//         countdown,
//         countdownActive,
//         fetchEmergencyData,
//         startEmergencyCountdown,
//         cancelEmergency,
//         triggerEmergency,
//         getNearbyHospitals,
//         endEmergency,
//         initializeLocationTracking,
//       }}
//     >
//       {children}
//     </EmergencyContext.Provider>
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

/* =======================
   CONTEXT SETUP
======================= */
const EmergencyContext = createContext();

export const useEmergency = () => {
  const context = useContext(EmergencyContext);
  if (!context) {
    throw new Error("useEmergency must be used within EmergencyProvider");
  }
  return context;
};

/* =======================
   PROVIDER
======================= */
export const EmergencyProvider = ({ children }) => {
  const { addToast } = useToast();

  /* =======================
     STATE
  ======================= */
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [medicalInfo, setMedicalInfo] = useState(null);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [emergencyInProgress, setEmergencyInProgress] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [emergencyServices, setEmergencyServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [countdown, setCountdown] = useState(5);
  const [countdownActive, setCountdownActive] = useState(false);
  const [countdownInterval, setCountdownInterval] = useState(null);

  /* =======================
     DEFAULT DATA
  ======================= */
  const getDefaultMedicalInfo = useCallback(
    () => ({
      blood_type: "",
      allergies: [],
      medications: [],
      conditions: [],
      emergency_notes: "",
      doctor_name: "",
      doctor_phone: "",
      insurance_provider: "",
      insurance_id: "",
    }),
    []
  );

  const getDefaultContacts = useCallback(
    () => [
      {
        id: 1,
        name: "Emergency Contact",
        phone: "",
        relationship: "Family",
        is_primary: true,
      },
    ],
    []
  );

  const getDefaultServices = useCallback(
    () => [
      { id: 1, name: "Emergency", number: "112", type: "general" },
      { id: 2, name: "Ambulance", number: "108", type: "ambulance" },
      { id: 3, name: "Police", number: "100", type: "police" },
      { id: 4, name: "Fire", number: "101", type: "fire" },
    ],
    []
  );

  /* =======================
     LOCATION
  ======================= */
  const initializeLocationTracking = useCallback(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurrentLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      () => addToast("Location permission required", "warning")
    );
  }, [addToast]);

  /* =======================
     FETCH INITIAL DATA
  ======================= */
  const fetchEmergencyData = useCallback(async () => {
    try {
      setLoading(true);
      setEmergencyContacts(getDefaultContacts());
      setMedicalInfo(getDefaultMedicalInfo());
      setEmergencyServices(getDefaultServices());
    } finally {
      setLoading(false);
    }
  }, [getDefaultContacts, getDefaultMedicalInfo, getDefaultServices]);

  useEffect(() => {
    fetchEmergencyData();
    initializeLocationTracking();
    return () => countdownInterval && clearInterval(countdownInterval);
  }, [fetchEmergencyData, initializeLocationTracking, countdownInterval]);

  /* =======================
     UPDATE MEDICAL INFO ✅
  ======================= */
  const updateMedicalInfo = useCallback(async (data) => {
    setMedicalInfo(data);
    addToast("Medical information updated", "success");
  }, [addToast]);

  /* =======================
     UPDATE CONTACTS ✅
  ======================= */
  const updateEmergencyContacts = useCallback(async (contacts) => {
    setEmergencyContacts(contacts);
    addToast("Emergency contacts updated", "success");
  }, [addToast]);

  /* =======================
     NOTIFY CONTACTS
  ======================= */
  const notifyEmergencyContacts = useCallback(async () => {
    // Stub – backend can be plugged later
    return true;
  }, []);

  /* =======================
     TRIGGER EMERGENCY
  ======================= */
  const triggerEmergency = useCallback(async () => {
    setEmergencyMode(true);
    setEmergencyInProgress(true);
    await notifyEmergencyContacts();
    addToast("Emergency triggered! Help is on the way.", "success");
  }, [notifyEmergencyContacts, addToast]);

  /* =======================
     COUNTDOWN
  ======================= */
  const startEmergencyCountdown = useCallback(() => {
    setCountdownActive(true);
    setCountdown(5);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          triggerEmergency();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setCountdownInterval(interval);
  }, [triggerEmergency]);

  const cancelEmergency = useCallback(() => {
    if (countdownInterval) clearInterval(countdownInterval);
    setCountdownInterval(null);
    setCountdownActive(false);
    setCountdown(5);
    addToast("Emergency cancelled", "info");
  }, [countdownInterval, addToast]);

  /* =======================
     HOSPITALS
  ======================= */
  const getNearbyHospitals = useCallback(async () => {
    if (!currentLocation) return [];
    return [
      {
        name: "Nearby Hospital",
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        distance: "1.0 km",
      },
    ];
  }, [currentLocation]);

  const endEmergency = useCallback(() => {
    setEmergencyMode(false);
    setEmergencyInProgress(false);
    addToast("Emergency ended", "success");
  }, [addToast]);

  /* =======================
     CONTEXT VALUE ✅
  ======================= */
  return (
    <EmergencyContext.Provider
      value={{
        emergencyContacts,
        medicalInfo,
        emergencyMode,
        emergencyInProgress,
        currentLocation,
        emergencyServices,
        loading,
        countdown,
        countdownActive,

        fetchEmergencyData,
        startEmergencyCountdown,
        cancelEmergency,
        triggerEmergency,

        updateMedicalInfo,
        updateEmergencyContacts,

        getNearbyHospitals,
        endEmergency,
        initializeLocationTracking,
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
};
