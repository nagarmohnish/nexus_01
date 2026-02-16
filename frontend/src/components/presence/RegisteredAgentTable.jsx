import { getStateName } from "../../utils/formatters";

export default function RegisteredAgentTable({ agents, onDelete }) {
  if (agents.length === 0) return null;

  return (
    <table className="min-w-full divide-y divide-slate-200 text-sm">
      <thead className="bg-slate-50">
        <tr>
          <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">State</th>
          <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Agent Name</th>
          <th className="px-4 py-2"></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-200">
        {agents.map((ra) => (
          <tr key={ra.id}>
            <td className="px-4 py-2 font-medium text-slate-900">{getStateName(ra.state)}</td>
            <td className="px-4 py-2 text-slate-600">{ra.agent_name || "—"}</td>
            <td className="px-4 py-2 text-right">
              <button
                onClick={() => onDelete(ra.id)}
                className="text-red-500 hover:text-red-700 text-xs font-medium"
              >
                Remove
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
