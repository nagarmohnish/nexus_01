import apiClient from "./client";

export const listContractors = (entityId) =>
  apiClient.get(`/entities/${entityId}/contractors`).then((r) => r.data);

export const createContractor = (entityId, data) =>
  apiClient.post(`/entities/${entityId}/contractors`, data).then((r) => r.data);

export const updateContractor = (entityId, contractorId, data) =>
  apiClient.put(`/entities/${entityId}/contractors/${contractorId}`, data).then((r) => r.data);

export const deleteContractor = (entityId, contractorId) =>
  apiClient.delete(`/entities/${entityId}/contractors/${contractorId}`);
