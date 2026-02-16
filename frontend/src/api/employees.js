import apiClient from "./client";

export const listEmployees = (entityId) =>
  apiClient.get(`/entities/${entityId}/employees`).then((r) => r.data);

export const createEmployee = (entityId, data) =>
  apiClient.post(`/entities/${entityId}/employees`, data).then((r) => r.data);

export const updateEmployee = (entityId, employeeId, data) =>
  apiClient.put(`/entities/${entityId}/employees/${employeeId}`, data).then((r) => r.data);

export const deleteEmployee = (entityId, employeeId) =>
  apiClient.delete(`/entities/${entityId}/employees/${employeeId}`);
