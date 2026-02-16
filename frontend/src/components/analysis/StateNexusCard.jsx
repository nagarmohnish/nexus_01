import Badge from "../common/Badge";
import ReasonCodeList from "./ReasonCodeList";

export default function StateNexusCard({ result }) {
  const revenue = result.details?.revenue;

  return (
    <div className="border border-slate-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="font-medium text-slate-900">{result.state_name}</span>
          <span className="text-slate-400 ml-1 text-sm">({result.state_code})</span>
        </div>
        <Badge status={result.status} />
      </div>
      <ReasonCodeList reasons={result.reason_codes} />

      {revenue && (
        <div className="mt-2 text-xs text-slate-600 bg-slate-50 rounded p-2">
          <div className="flex justify-between">
            <span>Revenue:</span>
            <span className="font-medium">
              ${revenue.effective.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              {revenue.is_estimated && (
                <span className="text-orange-600 ml-1">(estimated)</span>
              )}
            </span>
          </div>
        </div>
      )}

      {result.details?.traffic && (
        <div className="mt-1 text-xs text-slate-500">
          Traffic: {result.details.traffic.percentage_of_total}% of total
          {result.details.traffic.monthly_pageviews && (
            <> ({result.details.traffic.monthly_pageviews.toLocaleString()} pageviews/mo)</>
          )}
        </div>
      )}

      {!result.has_income_tax && (
        <div className="mt-2 text-xs text-slate-500 italic">
          No state income tax (may have franchise/gross receipts tax)
        </div>
      )}
      {result.notes && (
        <div className="mt-2 text-xs text-slate-500">{result.notes}</div>
      )}
    </div>
  );
}
