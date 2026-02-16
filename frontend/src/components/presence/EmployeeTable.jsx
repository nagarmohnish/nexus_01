import { getStateName, formatDate } from "../../utils/formatters";

export default function EmployeeTable({ employees, onDelete }) {
  if (employees.length === 0) return null;

  return (
    <table className="min-w-full divide-y divide-slate-200 text-sm">
      <thead className="bg-slate-50">
        <tr>
          <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Name</th>
          <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">State</th>
          <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Role</th>
          <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
          <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Start Date</th>
          <th className="px-4 py-2"></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-200">
        {employees.map((emp) => (
          <tr key={emp.id}>
            <td className="px-4 py-2 font-medium text-slate-900">{emp.name}</td>
            <td className="px-4 py-2 text-slate-600">{getStateName(emp.state)}</td>
            <td className="px-4 py-2 text-slate-600">{emp.role || "—"}</td>
            <td className="px-4 py-2 text-slate-600">
              {emp.employment_type === "full_time" ? "Full-Time" : "Part-Time"}
            </td>
            <td className="px-4 py-2 text-slate-600">{formatDate(emp.start_date)}</td>
            <td className="px-4 py-2 text-right">
              <button
                onClick={() => onDelete(emp.id)}
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
