import apiClient from "./client";

export const runAnalysis = (entityId) =>
  apiClient.post(`/entities/${entityId}/analyze`).then((r) => r.data);

export const getResults = (entityId) =>
  apiClient.get(`/entities/${entityId}/nexus-results`).then((r) => r.data);

export const getSummary = (entityId) =>
  apiClient.get(`/entities/${entityId}/nexus-summary`).then((r) => r.data);
