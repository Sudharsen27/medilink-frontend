import client, { unwrap } from "./client";

const parseJsonField = (value, fallback = []) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }
  return fallback;
};

export const normalizeMedicalInfo = (raw = {}) => ({
  blood_type: raw.blood_type || "",
  allergies: parseJsonField(raw.allergies),
  medications: parseJsonField(raw.medications),
  conditions: parseJsonField(raw.conditions),
  emergency_notes: raw.emergency_notes || "",
  doctor_name: raw.doctor_name || "",
  doctor_phone: raw.doctor_phone || "",
  insurance_provider: raw.insurance_provider || "",
  insurance_id: raw.insurance_id || "",
});

export const fetchEmergencyMedicalInfo = async () => {
  const res = await client.get("/api/emergency/medical-info");
  return normalizeMedicalInfo(unwrap(res));
};

export const updateEmergencyMedicalInfo = async (data) => {
  const res = await client.put("/api/emergency/medical-info", data);
  return normalizeMedicalInfo(unwrap(res));
};

export const fetchEmergencyContacts = async () => {
  const res = await client.get("/api/emergency/contacts");
  const data = unwrap(res);
  return Array.isArray(data) ? data : [];
};

export const updateEmergencyContacts = async (contacts) => {
  const res = await client.put("/api/emergency/contacts", { contacts });
  const data = unwrap(res);
  return Array.isArray(data) ? data : contacts;
};

export const fetchEmergencyServices = async () => {
  const res = await client.get("/api/emergency/services");
  const data = unwrap(res);
  return Array.isArray(data) ? data : [];
};

export const triggerEmergency = async (payload) => {
  const res = await client.post("/api/emergency/trigger", payload);
  return unwrap(res);
};

export const connectEmergencyDoctor = async (payload) => {
  const res = await client.post("/api/emergency/connect-doctor", payload);
  return unwrap(res);
};

export const dispatchAmbulance = async (payload) => {
  const res = await client.post("/api/emergency/dispatch-ambulance", payload);
  return unwrap(res);
};

export const endEmergency = async (emergencyLogId) => {
  const res = await client.post("/api/emergency/end", {
    emergency_log_id: emergencyLogId,
  });
  return unwrap(res);
};

export const fetchNearbyHospitals = async (latitude, longitude, radius = 10) => {
  const res = await client.post("/api/emergency/nearby-hospitals", {
    latitude,
    longitude,
    radius,
  });
  const payload = res.data;
  return payload?.hospitals ?? payload?.data ?? [];
};

export const notifyEmergencyContact = async (contactId, message) => {
  const res = await client.post("/api/emergency/notify-contact", {
    contact_id: contactId,
    message,
  });
  return unwrap(res);
};
