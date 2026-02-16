import { REASON_CODE_LABELS } from "../../utils/constants";

export default function ReasonCodeList({ reasons }) {
  if (!reasons || reasons.length === 0) return null;

  return (
    <ul className="space-y-1">
      {reasons.map((code) => (
        <li key={code} className="flex items-center gap-2 text-xs text-slate-600">
          <span className="w-1 h-1 bg-slate-400 rounded-full" />
          {REASON_CODE_LABELS[code] || code}
        </li>
      ))}
    </ul>
  );
}
