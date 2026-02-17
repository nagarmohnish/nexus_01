import { getStateName } from "../../utils/formatters";

export default function TrafficTable({ traffic, onEdit, onDelete }) {
  if (traffic.length === 0) return null;

  return (
    <table className="min-w-full divide-y divide-slate-200 text-sm">
      <thead className="bg-slate-50">
        <tr>
          <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Property</th>
          <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">State</th>
          <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Year</th>
          <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase">Monthly Pageviews</th>
          <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase">% of Total</th>
          <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase">Newsletter Subs</th>
          <th className="px-4 py-2"></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-200">
        {traffic.map((t) => (
          <tr
            key={t.id}
            className="hover:bg-slate-50 cursor-pointer"
            onClick={() => onEdit(t)}
          >
            <td className="px-4 py-2 font-medium text-blue-700">{t.property_name || "\u2014"}</td>
            <td className="px-4 py-2 font-medium text-slate-900">{getStateName(t.state_code)}</td>
            <td className="px-4 py-2 text-slate-600">{t.year}</td>
            <td className="px-4 py-2 text-right text-slate-600">
              {t.monthly_pageviews ? t.monthly_pageviews.toLocaleString() : "\u2014"}
            </td>
            <td className="px-4 py-2 text-right text-slate-600">
              {t.percentage_of_total ? `${t.percentage_of_total}%` : "\u2014"}
            </td>
            <td className="px-4 py-2 text-right text-slate-600">
              {t.newsletter_subscribers ? t.newsletter_subscribers.toLocaleString() : "\u2014"}
            </td>
            <td className="px-4 py-2 text-right" onClick={(e) => e.stopPropagation()}>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => onEdit(t)}
                  className="text-blue-500 hover:text-blue-700 text-xs font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(t.id)}
                  className="text-red-500 hover:text-red-700 text-xs font-medium"
                >
                  Remove
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
