import { useState } from "react";
import Button from "../common/Button";
import StateSelect from "../common/StateSelect";
import { EMPLOYMENT_TYPES } from "../../utils/constants";

export default function EmployeeForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    state: "",
    role: "",
    employment_type: "full_time",
    start_date: "",
  });

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit({
      ...form,
      start_date: form.start_date || null,
      role: form.role || null,
    });
    setForm({ name: "", state: "", role: "", employment_type: "full_time", start_date: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <input
          required
          type="text"
          value={form.name}
          onChange={set("name")}
          placeholder="Employee name"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <StateSelect required value={form.state} onChange={set("state")} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <input
          type="text"
          value={form.role}
          onChange={set("role")}
          placeholder="Role (optional)"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <select
          value={form.employment_type}
          onChange={set("employment_type")}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          {EMPLOYMENT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <input
          type="date"
          value={form.start_date}
          onChange={set("start_date")}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm">Add Employee</Button>
        {onCancel && <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>}
      </div>
    </form>
  );
}
