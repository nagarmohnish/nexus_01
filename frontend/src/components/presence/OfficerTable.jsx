import { getStateName } from "../../utils/formatters";

export default function OfficerTable({ officers, onDelete }) {
  if (officers.length === 0) return null;

  return (
    <table className="min-w-full divide-y divide-slate-200 text-sm">
      <thead className="bg-slate-50">
        <tr>
          <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Name</th>
          <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Title</th>
          <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">State of Residence</th>
          <th className="px-4 py-2"></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-200">
        {officers.map((o) => (
          <tr key={o.id}>
            <td className="px-4 py-2 font-medium text-slate-900">{o.name}</td>
            <td className="px-4 py-2 text-slate-600">{o.title || "—"}</td>
            <td className="px-4 py-2 text-slate-600">{getStateName(o.state_of_residence)}</td>
            <td className="px-4 py-2 text-right">
              <button
                onClick={() => onDelete(o.id)}
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
