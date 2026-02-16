import { useState } from "react";
import { useEntities } from "../hooks/useEntities";
import EntityList from "../components/entities/EntityList";
import EntityForm from "../components/entities/EntityForm";
import Modal from "../components/common/Modal";
import Button from "../components/common/Button";
import Card, { CardBody } from "../components/common/Card";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";

export default function EntitiesPage() {
  const { entities, loading, error, create } = useEntities();
  const [showCreate, setShowCreate] = useState(false);

  const handleCreate = async (data) => {
    await create(data);
    setShowCreate(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Entities</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your companies, brands, and subsidiaries
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)}>+ Add Entity</Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : entities.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyState
              title="No entities yet"
              description="Add your first company or brand to begin nexus analysis."
              action={
                <Button onClick={() => setShowCreate(true)}>+ Add Entity</Button>
              }
            />
          </CardBody>
        </Card>
      ) : (
        <Card>
          <EntityList entities={entities} />
        </Card>
      )}

      <Modal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title="Add Entity"
      >
        <EntityForm
          entities={entities}
          onSubmit={handleCreate}
          onCancel={() => setShowCreate(false)}
        />
      </Modal>
    </div>
  );
}
