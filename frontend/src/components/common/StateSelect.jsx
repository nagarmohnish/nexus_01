import { US_STATES } from "../../utils/constants";

export default function StateSelect({ value, onChange, className = "", ...props }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${className}`}
      {...props}
    >
      <option value="">Select state...</option>
      {US_STATES.map((s) => (
        <option key={s.code} value={s.code}>
          {s.name} ({s.code})
        </option>
      ))}
    </select>
  );
}
