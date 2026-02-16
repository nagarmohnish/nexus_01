import { useState } from "react";
import Button from "../common/Button";
import StateSelect from "../common/StateSelect";
import { CONTRACTOR_TYPES } from "../../utils/constants";

export default function ContractorForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    state: "",
    role: "",
    contractor_type: "ongoing",
  });

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit({ ...form, role: form.role || null });
    setForm({ name: "", state: "", role: "", contractor_type: "ongoing" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <input
          required
          type="text"
          value={form.name}
          onChange={set("name")}
          placeholder="Contractor name"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <StateSelect required value={form.state} onChange={set("state")} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          value={form.role}
          onChange={set("role")}
          placeholder="Role (optional)"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <select
          value={form.contractor_type}
          onChange={set("contractor_type")}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          {CONTRACTOR_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm">Add Contractor</Button>
        {onCancel && <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>}
      </div>
    </form>
  );
}
