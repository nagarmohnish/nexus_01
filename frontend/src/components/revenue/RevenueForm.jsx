import { useState } from "react";
import Button from "../common/Button";
import StateSelect from "../common/StateSelect";
import { REVENUE_SOURCES } from "../../utils/constants";

const currentYear = new Date().getFullYear();

const emptyForm = () => ({
  property_id: "",
  state_code: "",
  year: currentYear,
  ...Object.fromEntries(REVENUE_SOURCES.map((s) => [s.key, ""])),
});

export default function RevenueForm({ properties, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm());

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      property_id: form.property_id,
      state_code: form.state_code,
      year: parseInt(form.year),
      ...Object.fromEntries(
        REVENUE_SOURCES.map((s) => [s.key, parseFloat(form[s.key]) || 0])
      ),
    };
    await onSubmit(data);
    setForm(emptyForm());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <select
          required
          value={form.property_id}
          onChange={set("property_id")}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Select Property...</option>
          {properties.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <StateSelect required value={form.state_code} onChange={set("state_code")} />
        <input
          required
          type="number"
          min="2000"
          max="2099"
          value={form.year}
          onChange={set("year")}
          placeholder="Year"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="border border-slate-200 rounded-lg p-3">
        <h4 className="text-xs font-semibold text-slate-500 uppercase mb-3">Revenue by Source</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {REVENUE_SOURCES.map((src) => (
            <div key={src.key}>
              <label className="block text-xs text-slate-500 mb-1">{src.label}</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form[src.key]}
                onChange={set(src.key)}
                placeholder="0.00"
                className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" size="sm">Add Revenue Entry</Button>
        {onCancel && <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>}
      </div>
    </form>
  );
}
