import client, { unwrap } from "./client";

export const fetchPrescriptions = async () => {
  const res = await client.get("/api/prescriptions");
  const data = unwrap(res);
  return Array.isArray(data) ? data : [];
};

export const fetchPrescriptionById = async (id) => {
  const res = await client.get(`/api/prescriptions/${id}`);
  return unwrap(res);
};
