import { getStateName } from "../../utils/formatters";

export default function ContractorTable({ contractors, onDelete }) {
  if (contractors.length === 0) return null;

  return (
    <table className="min-w-full divide-y divide-slate-200 text-sm">
      <thead className="bg-slate-50">
        <tr>
          <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Name</th>
          <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">State</th>
          <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Role</th>
          <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
          <th className="px-4 py-2"></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-200">
        {contractors.map((c) => (
          <tr key={c.id}>
            <td className="px-4 py-2 font-medium text-slate-900">{c.name}</td>
            <td className="px-4 py-2 text-slate-600">{getStateName(c.state)}</td>
            <td className="px-4 py-2 text-slate-600">{c.role || "—"}</td>
            <td className="px-4 py-2 text-slate-600">
              {c.contractor_type === "ongoing" ? "Ongoing" : "Project-Based"}
            </td>
            <td className="px-4 py-2 text-right">
              <button
                onClick={() => onDelete(c.id)}
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
