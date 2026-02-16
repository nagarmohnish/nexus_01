import { useState, useEffect, useCallback } from "react";
import * as api from "../api/entities";

export function useEntities() {
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.listEntities();
      setEntities(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load entities");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (data) => {
    const result = await api.createEntity(data);
    await fetch();
    return result;
  };

  const remove = async (id) => {
    await api.deleteEntity(id);
    await fetch();
  };

  return { entities, loading, error, refresh: fetch, create, remove };
}
