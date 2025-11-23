

// import { createContext, useContext, useState, useCallback } from "react";
// import axios from "axios";

// const API = "/api/medical-records";

// const MedicalRecordsContext = createContext();

// export const MedicalRecordsProvider = ({ children }) => {
//   const [medicalRecords, setMedicalRecords] = useState([]);
//   const [loading, setLoading] = useState(false);

//   /* ✅ FETCH RECORDS */
//   const fetchRecords = useCallback(async () => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       console.warn("⛔ No token found");
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await axios.get(API, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setMedicalRecords(res.data.data || []);
//     } catch (err) {
//       console.error("❌ Fetch error:", err.response?.data || err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   /* ✅ UPLOAD RECORD (FIXED user_id + fields) */
//   const uploadMedicalRecord = async (formData, file) => {
//     const token = localStorage.getItem("token");
//     const user = JSON.parse(localStorage.getItem("user"));

//     if (!token || !user?.id) {
//       console.error("⛔ Missing token or user_id");
//       return;
//     }

//     try {
//       const fd = new FormData();
//       fd.append("user_id", user.id);   // ✅ REQUIRED
//       fd.append("record_type", formData.record_type);
//       fd.append("title", formData.title);
//       fd.append("description", formData.description);
//       fd.append("record_date", formData.record_date);

//       if (formData.doctor_name) fd.append("doctor_name", formData.doctor_name);
//       if (formData.hospital) fd.append("hospital", formData.hospital);
//       if (formData.notes) fd.append("notes", formData.notes);

//       if (file) fd.append("file", file);

//       await axios.post(API, fd, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       await fetchRecords();
//     } catch (err) {
//       console.error("❌ Upload error:", err.response?.data || err);
//       throw err;
//     }
//   };

//   /* ✅ DELETE */
//   const deleteMedicalRecord = async (id) => {
//     const token = localStorage.getItem("token");

//     try {
//       await axios.delete(`${API}/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       await fetchRecords();
//     } catch (err) {
//       console.error("❌ Delete error:", err.response?.data || err);
//     }
//   };

//   /* ✅ STATS */
//   const getRecordsStats = () => {
//     const byType = {};

//     medicalRecords.forEach((r) => {
//       byType[r.record_type] = (byType[r.record_type] || 0) + 1;
//     });

//     return {
//       total: medicalRecords.length,
//       recentCount: medicalRecords.length,
//       byType,
//     };
//   };

//   return (
//     <MedicalRecordsContext.Provider
//       value={{
//         medicalRecords,
//         loading,
//         fetchRecords,
//         uploadMedicalRecord,
//         deleteMedicalRecord,
//         getRecordsStats,
//       }}
//     >
//       {children}
//     </MedicalRecordsContext.Provider>
//   );
// };

// export const useMedicalRecords = () => useContext(MedicalRecordsContext);


import { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";

const API = "/api/medical-records";

const MedicalRecordsContext = createContext();

export const MedicalRecordsProvider = ({ children }) => {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ✅ FETCH RECORDS */
  const fetchRecords = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("⛔ No token found");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.get(API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMedicalRecords(res.data.data || []);
    } catch (err) {
      console.error("❌ Fetch error:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ✅ UPLOAD RECORD (FULL FIXED VERSION) */
  const uploadMedicalRecord = async (formData, file) => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token) {
      console.error("⛔ Missing token");
      throw new Error("Not authenticated");
    }

    if (!user?.id) {
      console.error("⛔ Missing user_id");
      throw new Error("Missing user id");
    }

    if (!file) {
      console.error("⛔ File required");
      throw new Error("File is required");
    }

    try {
      const fd = new FormData();

      fd.append("user_id", user.id);       // ✅ REQUIRED FIELD
      fd.append("record_type", formData.record_type);
      fd.append("title", formData.title);
      fd.append("description", formData.description);
      fd.append("record_date", formData.record_date);

      if (formData.doctor_name) fd.append("doctor_name", formData.doctor_name);
      if (formData.hospital) fd.append("hospital", formData.hospital);
      if (formData.notes) fd.append("notes", formData.notes);

      fd.append("file", file); // ✅ ALWAYS include file

      await axios.post(API, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      await fetchRecords();
    } catch (err) {
      console.error("❌ Upload error:", err.response?.data || err);
      throw err;
    }
  };

  /* ✅ DELETE */
  const deleteMedicalRecord = async (id) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`${API}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchRecords();
    } catch (err) {
      console.error("❌ Delete error:", err.response?.data || err);
    }
  };

  /* ✅ STATS */
  const getRecordsStats = () => {
    const byType = {};

    medicalRecords.forEach((r) => {
      byType[r.record_type] = (byType[r.record_type] || 0) + 1;
    });

    return {
      total: medicalRecords.length,
      recentCount: medicalRecords.length,
      byType,
    };
  };

  return (
    <MedicalRecordsContext.Provider
      value={{
        medicalRecords,
        loading,
        fetchRecords,
        uploadMedicalRecord,
        deleteMedicalRecord,
        getRecordsStats,
      }}
    >
      {children}
    </MedicalRecordsContext.Provider>
  );
};

export const useMedicalRecords = () => useContext(MedicalRecordsContext);
