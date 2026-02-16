import apiClient from "./client";

export const listTrafficData = (entityId, year) =>
  apiClient.get(`/entities/${entityId}/traffic`, { params: year ? { year } : {} }).then((r) => r.data);

export const createTrafficData = (entityId, data) =>
  apiClient.post(`/entities/${entityId}/traffic`, data).then((r) => r.data);

export const updateTrafficData = (entityId, trafficId, data) =>
  apiClient.put(`/entities/${entityId}/traffic/${trafficId}`, data).then((r) => r.data);

export const deleteTrafficData = (entityId, trafficId) =>
  apiClient.delete(`/entities/${entityId}/traffic/${trafficId}`);
