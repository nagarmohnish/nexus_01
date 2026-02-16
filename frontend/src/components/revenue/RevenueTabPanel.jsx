import { useState, useEffect, useCallback } from "react";
import * as revenueApi from "../../api/revenues";
import * as trafficApi from "../../api/trafficData";
import RevenueForm from "./RevenueForm";
import RevenueTable from "./RevenueTable";
import TrafficForm from "./TrafficForm";
import TrafficTable from "./TrafficTable";
import Button from "../common/Button";
import EmptyState from "../common/EmptyState";
import LoadingSpinner from "../common/LoadingSpinner";

const TABS = [
  { key: "revenue", label: "Revenue by State" },
  { key: "traffic", label: "Traffic Data" },
];

export default function RevenueTabPanel({ entityId }) {
  const [activeTab, setActiveTab] = useState("revenue");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [revenues, setRevenues] = useState([]);
  const [traffic, setTraffic] = useState([]);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [revData, trafData] = await Promise.all([
        revenueApi.listRevenues(entityId),
        trafficApi.listTrafficData(entityId),
      ]);
      setRevenues(revData);
      setTraffic(trafData);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [entityId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateRevenue = async (data) => {
    try {
      await revenueApi.createRevenue(entityId, data);
      setShowForm(false);
      loadData();
    } catch (err) {
      const detail = err.response?.data?.detail;
      alert(detail || "Failed to create revenue entry");
    }
  };

  const handleDeleteRevenue = async (revId) => {
    await revenueApi.deleteRevenue(entityId, revId);
    loadData();
  };

  const handleCreateTraffic = async (data) => {
    try {
      await trafficApi.createTrafficData(entityId, data);
      setShowForm(false);
      loadData();
    } catch (err) {
      const detail = err.response?.data?.detail;
      alert(detail || "Failed to create traffic entry");
    }
  };

  const handleDeleteTraffic = async (trafId) => {
    await trafficApi.deleteTrafficData(entityId, trafId);
    loadData();
  };

  if (loading) return <LoadingSpinner />;

  const totalRevenue = revenues.reduce((sum, r) => sum + (r.total_revenue || 0), 0);

  return (
    <div>
      {/* Summary bar */}
      {(revenues.length > 0 || traffic.length > 0) && (
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-blue-700">
              ${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-blue-600">Total Revenue</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-blue-700">{revenues.length}</div>
            <div className="text-xs text-blue-600">State Revenue Entries</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-blue-700">{traffic.length}</div>
            <div className="text-xs text-blue-600">Traffic Data Entries</div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 mb-4">{error}</div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1 border-b border-slate-200">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setShowForm(false); }}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === tab.key
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {!showForm && (
          <Button size="sm" onClick={() => setShowForm(true)}>
            + Add
          </Button>
        )}
      </div>

      {activeTab === "revenue" && (
        <>
          <RevenueTable revenues={revenues} onDelete={handleDeleteRevenue} />
          {revenues.length === 0 && !showForm && (
            <EmptyState
              title="No revenue data"
              description="Add state-by-state revenue to enable economic nexus analysis. Revenue is broken down by source (Mediavine, Raptive, AdSense, syndication, etc.)."
            />
          )}
          {showForm && (
            <div className="mt-4 p-4 bg-slate-50 rounded-lg">
              <RevenueForm onSubmit={handleCreateRevenue} onCancel={() => setShowForm(false)} />
            </div>
          )}
        </>
      )}

      {activeTab === "traffic" && (
        <>
          <TrafficTable traffic={traffic} onDelete={handleDeleteTraffic} />
          {traffic.length === 0 && !showForm && (
            <EmptyState
              title="No traffic data"
              description="Add GA4 traffic data by state. When actual revenue data is missing for a state, traffic percentages are used to estimate revenue attribution for economic nexus."
            />
          )}
          {showForm && (
            <div className="mt-4 p-4 bg-slate-50 rounded-lg">
              <TrafficForm onSubmit={handleCreateTraffic} onCancel={() => setShowForm(false)} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
