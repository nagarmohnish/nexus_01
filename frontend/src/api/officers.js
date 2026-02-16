import apiClient from "./client";

export const listOfficers = (entityId) =>
  apiClient.get(`/entities/${entityId}/officers`).then((r) => r.data);

export const createOfficer = (entityId, data) =>
  apiClient.post(`/entities/${entityId}/officers`, data).then((r) => r.data);

export const updateOfficer = (entityId, officerId, data) =>
  apiClient.put(`/entities/${entityId}/officers/${officerId}`, data).then((r) => r.data);

export const deleteOfficer = (entityId, officerId) =>
  apiClient.delete(`/entities/${entityId}/officers/${officerId}`);
