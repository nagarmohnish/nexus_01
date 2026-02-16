import { useState, useCallback } from "react";
import * as api from "../api/nexusAnalysis";

export function useNexusAnalysis(entityId) {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchResults = useCallback(async () => {
    if (!entityId) return;
    setLoading(true);
    try {
      const data = await api.getResults(entityId);
      setResults(data);
      setError(null);
    } catch (err) {
      if (err.response?.status !== 404) {
        setError(err.response?.data?.detail || "Failed to load results");
      }
    } finally {
      setLoading(false);
    }
  }, [entityId]);

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.runAnalysis(entityId);
      setResults(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.detail || "Analysis failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, fetchResults, runAnalysis };
}
