import apiClient from "./client";

export const listProperties = (entityId) =>
  apiClient.get(`/entities/${entityId}/properties`).then((r) => r.data);

export const createProperty = (entityId, data) =>
  apiClient.post(`/entities/${entityId}/properties`, data).then((r) => r.data);

export const updateProperty = (entityId, propertyId, data) =>
  apiClient.put(`/entities/${entityId}/properties/${propertyId}`, data).then((r) => r.data);

export const deleteProperty = (entityId, propertyId) =>
  apiClient.delete(`/entities/${entityId}/properties/${propertyId}`);
