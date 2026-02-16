import { useState, useMemo } from "react";
import { usePresenceData } from "../../hooks/usePresenceData";
import * as empApi from "../../api/employees";
import * as conApi from "../../api/contractors";
import * as offApi from "../../api/officers";
import * as locApi from "../../api/locations";
import * as raApi from "../../api/registeredAgents";
import EmployeeForm from "./EmployeeForm";
import EmployeeTable from "./EmployeeTable";
import ContractorForm from "./ContractorForm";
import ContractorTable from "./ContractorTable";
import OfficerForm from "./OfficerForm";
import OfficerTable from "./OfficerTable";
import LocationForm from "./LocationForm";
import LocationTable from "./LocationTable";
import RegisteredAgentForm from "./RegisteredAgentForm";
import RegisteredAgentTable from "./RegisteredAgentTable";
import Button from "../common/Button";
import EmptyState from "../common/EmptyState";

const TABS = [
  { key: "employees", label: "Employees" },
  { key: "contractors", label: "Contractors" },
  { key: "officers", label: "Officers/Directors" },
  { key: "locations", label: "Locations" },
  { key: "agents", label: "Registered Agents" },
];

const empApiFns = { list: empApi.listEmployees, create: empApi.createEmployee, update: empApi.updateEmployee, remove: empApi.deleteEmployee };
const conApiFns = { list: conApi.listContractors, create: conApi.createContractor, update: conApi.updateContractor, remove: conApi.deleteContractor };
const offApiFns = { list: offApi.listOfficers, create: offApi.createOfficer, update: offApi.updateOfficer, remove: offApi.deleteOfficer };
const locApiFns = { list: locApi.listLocations, create: locApi.createLocation, update: locApi.updateLocation, remove: locApi.deleteLocation };
const raApiFns = { list: raApi.listRegisteredAgents, create: raApi.createRegisteredAgent, remove: raApi.deleteRegisteredAgent };

export default function PresenceTabPanel({ entityId }) {
  const [activeTab, setActiveTab] = useState("employees");
  const [showForm, setShowForm] = useState(false);

  const employees = usePresenceData(entityId, useMemo(() => empApiFns, []));
  const contractors = usePresenceData(entityId, useMemo(() => conApiFns, []));
  const officers = usePresenceData(entityId, useMemo(() => offApiFns, []));
  const locations = usePresenceData(entityId, useMemo(() => locApiFns, []));
  const agents = usePresenceData(entityId, useMemo(() => raApiFns, []));

  const handleCreate = async (data, hook) => {
    await hook.create(data);
    setShowForm(false);
  };

  const renderTab = () => {
    switch (activeTab) {
      case "employees":
        return (
          <>
            <EmployeeTable employees={employees.items} onDelete={employees.remove} />
            {employees.items.length === 0 && !showForm && (
              <EmptyState title="No employees" description="Add employees to track physical nexus." />
            )}
            {showForm && (
              <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                <EmployeeForm
                  onSubmit={(data) => handleCreate(data, employees)}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            )}
          </>
        );
      case "contractors":
        return (
          <>
            <ContractorTable contractors={contractors.items} onDelete={contractors.remove} />
            {contractors.items.length === 0 && !showForm && (
              <EmptyState title="No contractors" description="Add contractors to evaluate nexus." />
            )}
            {showForm && (
              <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                <ContractorForm
                  onSubmit={(data) => handleCreate(data, contractors)}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            )}
          </>
        );
      case "officers":
        return (
          <>
            <OfficerTable officers={officers.items} onDelete={officers.remove} />
            {officers.items.length === 0 && !showForm && (
              <EmptyState title="No officers/directors" description="Add officers or directors." />
            )}
            {showForm && (
              <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                <OfficerForm
                  onSubmit={(data) => handleCreate(data, officers)}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            )}
          </>
        );
      case "locations":
        return (
          <>
            <LocationTable locations={locations.items} onDelete={locations.remove} />
            {locations.items.length === 0 && !showForm && (
              <EmptyState title="No locations" description="Add offices, warehouses, or other locations." />
            )}
            {showForm && (
              <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                <LocationForm
                  onSubmit={(data) => handleCreate(data, locations)}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            )}
          </>
        );
      case "agents":
        return (
          <>
            <RegisteredAgentTable agents={agents.items} onDelete={agents.remove} />
            {agents.items.length === 0 && !showForm && (
              <EmptyState title="No registered agents" description="Add registered agent states." />
            )}
            {showForm && (
              <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                <RegisteredAgentForm
                  onSubmit={(data) => handleCreate(data, agents)}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div>
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
      {renderTab()}
    </div>
  );
}
