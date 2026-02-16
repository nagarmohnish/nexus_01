import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useEntities } from "../hooks/useEntities";
import * as analysisApi from "../api/nexusAnalysis";
import Card, { CardBody } from "../components/common/Card";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";
import { getStateName } from "../utils/formatters";

export default function DashboardPage() {
  const { entities, loading } = useEntities();
  const [summaries, setSummaries] = useState({});

  useEffect(() => {
    entities.forEach(async (entity) => {
      try {
        const summary = await analysisApi.getSummary(entity.id);
        setSummaries((prev) => ({ ...prev, [entity.id]: summary }));
      } catch {
        // No results yet
      }
    });
  }, [entities]);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Overview of all entities and their nexus status
          </p>
        </div>
        <Link to="/entities">
          <Button>Manage Entities</Button>
        </Link>
      </div>

      {entities.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyState
              title="Welcome to the Nexus Determination Tool"
              description="Start by adding your entities (companies and brands) to determine state tax nexus obligations."
              action={
                <Link to="/entities">
                  <Button>Get Started</Button>
                </Link>
              }
            />
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {entities.map((entity) => {
            const summary = summaries[entity.id];
            return (
              <Link key={entity.id} to={`/entities/${entity.id}`}>
                <Card className="hover:shadow-md transition-shadow h-full">
                  <CardBody>
                    <div className="mb-3">
                      <h3 className="font-semibold text-slate-900">{entity.legal_name}</h3>
                      {entity.dba_name && (
                        <p className="text-sm text-slate-500">DBA: {entity.dba_name}</p>
                      )}
                      <p className="text-xs text-slate-400 mt-1">
                        {entity.entity_type} &middot; {getStateName(entity.state_of_incorporation)}
                      </p>
                    </div>

                    <div className="text-xs text-slate-500 mb-3">
                      {entity.employee_count || 0} employees &middot;{" "}
                      {entity.contractor_count || 0} contractors &middot;{" "}
                      {entity.location_count || 0} locations
                    </div>

                    {summary && summary.last_analyzed ? (
                      <div className="flex gap-2 flex-wrap">
                        {summary.definite_nexus_count > 0 && (
                          <Badge status="definite" />
                        )}
                        {summary.probable_nexus_count > 0 && (
                          <Badge status="probable" />
                        )}
                        {summary.possible_nexus_count > 0 && (
                          <Badge status="possible" />
                        )}
                        <span className="text-xs text-slate-400 self-center">
                          {summary.definite_nexus_count} definite
                          {summary.probable_nexus_count > 0 && ` \u00b7 ${summary.probable_nexus_count} probable`}
                          {" "}&middot; {summary.possible_nexus_count} possible
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">
                        Not yet analyzed
                      </span>
                    )}
                  </CardBody>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
