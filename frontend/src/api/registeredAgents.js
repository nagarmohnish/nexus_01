import apiClient from "./client";

export const listRegisteredAgents = (entityId) =>
  apiClient.get(`/entities/${entityId}/registered-agents`).then((r) => r.data);

export const createRegisteredAgent = (entityId, data) =>
  apiClient.post(`/entities/${entityId}/registered-agents`, data).then((r) => r.data);

export const deleteRegisteredAgent = (entityId, raId) =>
  apiClient.delete(`/entities/${entityId}/registered-agents/${raId}`);
