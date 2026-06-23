import client, { unwrap } from "./client";

export const fetchAiStatus = async () => {
  const res = await client.get("/api/ai/status");
  return unwrap(res);
};

export const sendAiMessage = async (messages) => {
  const res = await client.post("/api/ai/chat", { messages });
  return unwrap(res);
};
