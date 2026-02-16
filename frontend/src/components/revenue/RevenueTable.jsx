import { getStateName } from "../../utils/formatters";

const fmt = (val) =>
  val ? `$${Number(val).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—";

export default function RevenueTable({ revenues, onDelete }) {
  if (revenues.length === 0) return null;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">State</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Year</th>
            <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase">Total Revenue</th>
            <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase">Ad Revenue</th>
            <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase">Syndication</th>
            <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase">Affiliate</th>
            <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase">Other</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {revenues.map((rev) => {
            const adTotal = (rev.advertising_mediavine || 0) + (rev.advertising_raptive || 0) +
              (rev.advertising_adsense || 0) + (rev.advertising_other || 0);
            const syndTotal = (rev.syndication_msn || 0) + (rev.syndication_newsbreak || 0) +
              (rev.syndication_other || 0);
            const otherTotal = (rev.newsletter_revenue || 0) + (rev.sponsored_content || 0) +
              (rev.direct_sales || 0) + (rev.other_revenue || 0);

            return (
              <tr key={rev.id} className="hover:bg-slate-50">
                <td className="px-4 py-2 font-medium text-slate-900">{getStateName(rev.state_code)}</td>
                <td className="px-4 py-2 text-slate-600">{rev.year}</td>
                <td className="px-4 py-2 text-right font-medium text-slate-900">{fmt(rev.total_revenue)}</td>
                <td className="px-4 py-2 text-right text-slate-600">{fmt(adTotal)}</td>
                <td className="px-4 py-2 text-right text-slate-600">{fmt(syndTotal)}</td>
                <td className="px-4 py-2 text-right text-slate-600">{fmt(rev.affiliate_revenue)}</td>
                <td className="px-4 py-2 text-right text-slate-600">{fmt(otherTotal)}</td>
                <td className="px-4 py-2 text-right">
                  <button
                    onClick={() => onDelete(rev.id)}
                    className="text-red-500 hover:text-red-700 text-xs font-medium"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
