import apiClient from "./client";

export const listEntities = (parentId) =>
  apiClient.get("/entities", { params: parentId ? { parent_id: parentId } : {} }).then((r) => r.data);

export const getEntity = (id) =>
  apiClient.get(`/entities/${id}`).then((r) => r.data);

export const createEntity = (data) =>
  apiClient.post("/entities", data).then((r) => r.data);

export const updateEntity = (id, data) =>
  apiClient.put(`/entities/${id}`, data).then((r) => r.data);

export const deleteEntity = (id) =>
  apiClient.delete(`/entities/${id}`);
