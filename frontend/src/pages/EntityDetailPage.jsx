import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEntityDetail } from "../hooks/useEntityDetail";
import { useEntities } from "../hooks/useEntities";
import EntityForm from "../components/entities/EntityForm";
import PresenceTabPanel from "../components/presence/PresenceTabPanel";
import RevenueTabPanel from "../components/revenue/RevenueTabPanel";
import NexusResultsPanel from "../components/analysis/NexusResultsPanel";
import Card, { CardBody, CardHeader } from "../components/common/Card";
import Button from "../components/common/Button";
import ConfirmDialog from "../components/common/ConfirmDialog";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { getStateName } from "../utils/formatters";
import * as entityApi from "../api/entities";

const TABS = [
  { key: "info", label: "Entity Info" },
  { key: "presence", label: "People & Presence" },
  { key: "revenue", label: "Revenue & Traffic" },
  { key: "analysis", label: "Nexus Analysis" },
];

export default function EntityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { entity, loading, error, update } = useEntityDetail(id);
  const { entities } = useEntities();
  const [activeTab, setActiveTab] = useState("presence");
  const [showDelete, setShowDelete] = useState(false);

  const handleDelete = async () => {
    await entityApi.deleteEntity(id);
    navigate("/entities");
  };

  if (loading) return <LoadingSpinner />;
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    );
  }
  if (!entity) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <button onClick={() => navigate("/entities")} className="hover:text-blue-600">
              Entities
            </button>
            <span>/</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {entity.legal_name}
          </h1>
          <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
            {entity.dba_name && <span>DBA: {entity.dba_name}</span>}
            <span>{entity.entity_type}</span>
            <span>Inc: {getStateName(entity.state_of_incorporation)}</span>
          </div>
        </div>
        <Button variant="danger" size="sm" onClick={() => setShowDelete(true)}>
          Delete Entity
        </Button>
      </div>

      <div className="flex gap-1 border-b border-slate-200 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
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

      {activeTab === "info" && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-900">Entity Information</h2>
          </CardHeader>
          <CardBody>
            <EntityForm
              initial={{
                legal_name: entity.legal_name,
                dba_name: entity.dba_name || "",
                entity_type: entity.entity_type,
                state_of_incorporation: entity.state_of_incorporation,
                ein: entity.ein || "",
                parent_entity_id: entity.parent_entity_id || "",
                fiscal_year_end_month: entity.fiscal_year_end_month,
                fiscal_year_end_day: entity.fiscal_year_end_day,
              }}
              entities={entities.filter((e) => e.id !== id)}
              onSubmit={update}
            />
          </CardBody>
        </Card>
      )}

      {activeTab === "presence" && (
        <Card>
          <CardBody>
            <PresenceTabPanel entityId={id} />
          </CardBody>
        </Card>
      )}

      {activeTab === "revenue" && (
        <Card>
          <CardBody>
            <RevenueTabPanel entityId={id} />
          </CardBody>
        </Card>
      )}

      {activeTab === "analysis" && (
        <Card>
          <CardBody>
            <NexusResultsPanel entityId={id} />
          </CardBody>
        </Card>
      )}

      <ConfirmDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Delete Entity"
        message={`Are you sure you want to delete "${entity.legal_name}"? This will remove all associated employees, contractors, officers, locations, and nexus results.`}
      />
    </div>
  );
}
