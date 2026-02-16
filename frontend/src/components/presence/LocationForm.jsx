import { useState } from "react";
import Button from "../common/Button";
import StateSelect from "../common/StateSelect";
import { LOCATION_TYPES } from "../../utils/constants";

export default function LocationForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({
    state: "",
    location_type: "headquarters",
    description: "",
  });

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit({ ...form, description: form.description || null });
    setForm({ state: "", location_type: "headquarters", description: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <StateSelect required value={form.state} onChange={set("state")} />
        <select
          value={form.location_type}
          onChange={set("location_type")}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          {LOCATION_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <input
          type="text"
          value={form.description}
          onChange={set("description")}
          placeholder="Description (optional)"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm">Add Location</Button>
        {onCancel && <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>}
      </div>
    </form>
  );
}
