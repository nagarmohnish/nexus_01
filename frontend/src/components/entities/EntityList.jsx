import { Link } from "react-router-dom";
import { getStateName } from "../../utils/formatters";

export default function EntityList({ entities }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Legal Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              DBA
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Inc. State
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              People
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Locations
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {entities.map((entity) => (
            <tr key={entity.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <Link
                  to={`/entities/${entity.id}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  {entity.legal_name}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                {entity.dba_name || "—"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                {entity.entity_type}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                {getStateName(entity.state_of_incorporation)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                {(entity.employee_count || 0) + (entity.contractor_count || 0) + (entity.officer_count || 0)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                {entity.location_count || 0}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
