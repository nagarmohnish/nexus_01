import apiClient from "./client";

export const listRevenues = (entityId, year) =>
  apiClient.get(`/entities/${entityId}/revenues`, { params: year ? { year } : {} }).then((r) => r.data);

export const createRevenue = (entityId, data) =>
  apiClient.post(`/entities/${entityId}/revenues`, data).then((r) => r.data);

export const updateRevenue = (entityId, revenueId, data) =>
  apiClient.put(`/entities/${entityId}/revenues/${revenueId}`, data).then((r) => r.data);

export const deleteRevenue = (entityId, revenueId) =>
  apiClient.delete(`/entities/${entityId}/revenues/${revenueId}`);

export const getRevenueSummary = (entityId, year) =>
  apiClient.get(`/entities/${entityId}/revenues/summary`, { params: year ? { year } : {} }).then((r) => r.data);
