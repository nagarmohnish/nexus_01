import apiClient from "./client";

export const listLocations = (entityId) =>
  apiClient.get(`/entities/${entityId}/locations`).then((r) => r.data);

export const createLocation = (entityId, data) =>
  apiClient.post(`/entities/${entityId}/locations`, data).then((r) => r.data);

export const updateLocation = (entityId, locationId, data) =>
  apiClient.put(`/entities/${entityId}/locations/${locationId}`, data).then((r) => r.data);

export const deleteLocation = (entityId, locationId) =>
  apiClient.delete(`/entities/${entityId}/locations/${locationId}`);
