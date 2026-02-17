import { useState, useEffect, useCallback } from "react";
import * as propertyApi from "../../api/properties";
import * as revenueApi from "../../api/revenues";
import * as trafficApi from "../../api/trafficData";
import PropertyManager from "./PropertyManager";
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
  const [editingRevenue, setEditingRevenue] = useState(null);
  const [editingTraffic, setEditingTraffic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [revenues, setRevenues] = useState([]);
  const [traffic, setTraffic] = useState([]);
  const [filterPropertyId, setFilterPropertyId] = useState("");
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [propData, revData, trafData] = await Promise.all([
        propertyApi.listProperties(entityId),
        revenueApi.listRevenues(entityId),
        trafficApi.listTrafficData(entityId),
      ]);
      setProperties(propData);
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

  // --- Property handlers ---
  const handleCreateProperty = async (data) => {
    try {
      await propertyApi.createProperty(entityId, data);
      loadData();
    } catch (err) {
      const detail = err.response?.data?.detail;
      alert(detail || "Failed to create property");
    }
  };

  const handleUpdateProperty = async (propId, data) => {
    try {
      await propertyApi.updateProperty(entityId, propId, data);
      loadData();
    } catch (err) {
      const detail = err.response?.data?.detail;
      alert(detail || "Failed to update property");
    }
  };

  const handleDeleteProperty = async (propId) => {
    if (!confirm("Delete this property? All its revenue and traffic data will be removed.")) return;
    await propertyApi.deleteProperty(entityId, propId);
    if (filterPropertyId === propId) setFilterPropertyId("");
    loadData();
  };

  // --- Revenue handlers ---
  const handleSubmitRevenue = async (data) => {
    try {
      if (editingRevenue) {
        await revenueApi.updateRevenue(entityId, editingRevenue.id, data);
        setEditingRevenue(null);
      } else {
        await revenueApi.createRevenue(entityId, data);
      }
      setShowForm(false);
      loadData();
    } catch (err) {
      const detail = err.response?.data?.detail;
      alert(detail || "Failed to save revenue entry");
    }
  };

  const handleEditRevenue = (rev) => {
    setEditingRevenue(rev);
    setEditingTraffic(null);
    setShowForm(true);
  };

  const handleDeleteRevenue = async (revId) => {
    await revenueApi.deleteRevenue(entityId, revId);
    loadData();
  };

  // --- Traffic handlers ---
  const handleSubmitTraffic = async (data) => {
    try {
      if (editingTraffic) {
        await trafficApi.updateTrafficData(entityId, editingTraffic.id, data);
        setEditingTraffic(null);
      } else {
        await trafficApi.createTrafficData(entityId, data);
      }
      setShowForm(false);
      loadData();
    } catch (err) {
      const detail = err.response?.data?.detail;
      alert(detail || "Failed to save traffic entry");
    }
  };

  const handleEditTraffic = (traf) => {
    setEditingTraffic(traf);
    setEditingRevenue(null);
    setShowForm(true);
  };

  const handleDeleteTraffic = async (trafId) => {
    await trafficApi.deleteTrafficData(entityId, trafId);
    loadData();
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingRevenue(null);
    setEditingTraffic(null);
  };

  const handleAddNew = () => {
    setEditingRevenue(null);
    setEditingTraffic(null);
    setShowForm(true);
  };

  if (loading) return <LoadingSpinner />;

  const filteredRevenues = filterPropertyId
    ? revenues.filter((r) => r.property_id === filterPropertyId)
    : revenues;
  const filteredTraffic = filterPropertyId
    ? traffic.filter((t) => t.property_id === filterPropertyId)
    : traffic;

  const totalRevenue = filteredRevenues.reduce((sum, r) => sum + (r.total_revenue || 0), 0);

  return (
    <div>
      {/* Property Manager */}
      <PropertyManager
        properties={properties}
        onCreate={handleCreateProperty}
        onUpdate={handleUpdateProperty}
        onDelete={handleDeleteProperty}
      />

      {properties.length > 0 && (
        <>
          {/* Summary bar */}
          {(revenues.length > 0 || traffic.length > 0) && (
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-blue-700">
                  ${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-blue-600">Total Revenue</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-blue-700">{properties.length}</div>
                <div className="text-xs text-blue-600">Properties</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-blue-700">{filteredRevenues.length}</div>
                <div className="text-xs text-blue-600">Revenue Entries</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-blue-700">{filteredTraffic.length}</div>
                <div className="text-xs text-blue-600">Traffic Entries</div>
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
                  onClick={() => { setActiveTab(tab.key); handleCancelForm(); }}
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
            <div className="flex items-center gap-2">
              {/* Property filter */}
              <select
                value={filterPropertyId}
                onChange={(e) => setFilterPropertyId(e.target.value)}
                className="rounded-lg border border-slate-300 px-2 py-1.5 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">All Properties</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              {!showForm && (
                <Button size="sm" onClick={handleAddNew}>
                  + Add
                </Button>
              )}
            </div>
          </div>

          {activeTab === "revenue" && (
            <>
              <RevenueTable revenues={filteredRevenues} onEdit={handleEditRevenue} onDelete={handleDeleteRevenue} />
              {filteredRevenues.length === 0 && !showForm && (
                <EmptyState
                  title="No revenue data"
                  description="Add revenue per property and state to enable economic nexus analysis."
                />
              )}
              {showForm && (
                <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                  {editingRevenue && (
                    <div className="text-xs font-medium text-blue-600 mb-2">Editing: {editingRevenue.property_name} &mdash; {editingRevenue.state_code} &mdash; {editingRevenue.year}</div>
                  )}
                  <RevenueForm
                    properties={properties}
                    editing={editingRevenue}
                    onSubmit={handleSubmitRevenue}
                    onCancel={handleCancelForm}
                  />
                </div>
              )}
            </>
          )}

          {activeTab === "traffic" && (
            <>
              <TrafficTable traffic={filteredTraffic} onEdit={handleEditTraffic} onDelete={handleDeleteTraffic} />
              {filteredTraffic.length === 0 && !showForm && (
                <EmptyState
                  title="No traffic data"
                  description="Add GA4 traffic data by property and state. Traffic percentages estimate revenue for economic nexus."
                />
              )}
              {showForm && (
                <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                  {editingTraffic && (
                    <div className="text-xs font-medium text-blue-600 mb-2">Editing: {editingTraffic.property_name} &mdash; {editingTraffic.state_code} &mdash; {editingTraffic.year}</div>
                  )}
                  <TrafficForm
                    properties={properties}
                    editing={editingTraffic}
                    onSubmit={handleSubmitTraffic}
                    onCancel={handleCancelForm}
                  />
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
