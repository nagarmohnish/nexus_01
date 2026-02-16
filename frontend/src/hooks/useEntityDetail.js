import { useState, useEffect, useCallback } from "react";
import * as entityApi from "../api/entities";

export function useEntityDetail(entityId) {
  const [entity, setEntity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    if (!entityId) return;
    setLoading(true);
    try {
      const data = await entityApi.getEntity(entityId);
      setEntity(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load entity");
    } finally {
      setLoading(false);
    }
  }, [entityId]);

  useEffect(() => { fetch(); }, [fetch]);

  const update = async (data) => {
    const result = await entityApi.updateEntity(entityId, data);
    setEntity(result);
    return result;
  };

  return { entity, loading, error, refresh: fetch, update };
}
