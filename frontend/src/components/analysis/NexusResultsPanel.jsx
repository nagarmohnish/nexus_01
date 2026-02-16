import { useState, useEffect } from "react";
import { useNexusAnalysis } from "../../hooks/useNexusAnalysis";
import NexusSummaryBar from "./NexusSummaryBar";
import StateNexusCard from "./StateNexusCard";
import Button from "../common/Button";
import LoadingSpinner from "../common/LoadingSpinner";
import EmptyState from "../common/EmptyState";

export default function NexusResultsPanel({ entityId }) {
  const { results, loading, error, fetchResults, runAnalysis } = useNexusAnalysis(entityId);
  const [showAllClear, setShowAllClear] = useState(false);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  if (loading) return <LoadingSpinner />;

  if (!results || !results.states || results.states.length === 0) {
    return (
      <EmptyState
        title="No analysis results yet"
        description="Run a nexus analysis to determine state filing obligations based on physical presence and economic activity."
        action={
          <Button onClick={runAnalysis}>
            Run Nexus Analysis
          </Button>
        }
      />
    );
  }

  const definite = results.states.filter((s) => s.status === "definite");
  const probable = results.states.filter((s) => s.status === "probable");
  const possible = results.states.filter((s) => s.status === "possible");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500">
          Last analyzed: {new Date(results.computed_at).toLocaleString()}
        </div>
        <Button size="sm" onClick={runAnalysis} disabled={loading}>
          {loading ? "Analyzing..." : "Re-run Analysis"}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <NexusSummaryBar summary={results.summary} />

      {definite.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-red-700 mb-3">
            Definite Nexus ({definite.length} state{definite.length !== 1 ? "s" : ""})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {definite.map((s) => (
              <StateNexusCard key={s.state_code} result={s} />
            ))}
          </div>
        </div>
      )}

      {probable.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-orange-700 mb-3">
            Probable Nexus ({probable.length} state{probable.length !== 1 ? "s" : ""})
          </h3>
          <p className="text-xs text-slate-500 mb-3">
            Based on estimated revenue from traffic data. Enter actual revenue to confirm.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {probable.map((s) => (
              <StateNexusCard key={s.state_code} result={s} />
            ))}
          </div>
        </div>
      )}

      {possible.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-amber-700 mb-3">
            Possible Nexus ({possible.length} state{possible.length !== 1 ? "s" : ""})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {possible.map((s) => (
              <StateNexusCard key={s.state_code} result={s} />
            ))}
          </div>
        </div>
      )}

      {definite.length === 0 && probable.length === 0 && possible.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          No nexus triggers found. This entity appears to have minimal state tax obligations.
        </div>
      )}
    </div>
  );
}
