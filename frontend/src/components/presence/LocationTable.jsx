import { getStateName } from "../../utils/formatters";
import { LOCATION_TYPES } from "../../utils/constants";

export default function LocationTable({ locations, onDelete }) {
  if (locations.length === 0) return null;

  const typeLabel = (val) => LOCATION_TYPES.find((t) => t.value === val)?.label || val;

  return (
    <table className="min-w-full divide-y divide-slate-200 text-sm">
      <thead className="bg-slate-50">
        <tr>
          <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">State</th>
          <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
          <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Description</th>
          <th className="px-4 py-2"></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-200">
        {locations.map((loc) => (
          <tr key={loc.id}>
            <td className="px-4 py-2 font-medium text-slate-900">{getStateName(loc.state)}</td>
            <td className="px-4 py-2 text-slate-600">{typeLabel(loc.location_type)}</td>
            <td className="px-4 py-2 text-slate-600">{loc.description || "—"}</td>
            <td className="px-4 py-2 text-right">
              <button
                onClick={() => onDelete(loc.id)}
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
