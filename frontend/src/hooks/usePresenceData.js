import { useState, useEffect, useCallback } from "react";

export function usePresenceData(entityId, apiFns) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    if (!entityId) return;
    setLoading(true);
    try {
      const data = await apiFns.list(entityId);
      setItems(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [entityId, apiFns]);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (data) => {
    await apiFns.create(entityId, data);
    await fetch();
  };

  const update = async (itemId, data) => {
    if (apiFns.update) {
      await apiFns.update(entityId, itemId, data);
      await fetch();
    }
  };

  const remove = async (itemId) => {
    await apiFns.remove(entityId, itemId);
    await fetch();
  };

  return { items, loading, error, refresh: fetch, create, update, remove };
}
