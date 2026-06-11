/** Unwrap `{ success, data }` API envelopes or return payload as-is */
export const unwrap = (response) => {
  const payload = response?.data ?? response;
  if (payload && typeof payload === "object" && "data" in payload) {
    return payload.data;
  }
  return payload;
};
