import { useState } from "react";
import Button from "../common/Button";
import StateSelect from "../common/StateSelect";

export default function OfficerForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    title: "",
    state_of_residence: "",
  });

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit({ ...form, title: form.title || null });
    setForm({ name: "", title: "", state_of_residence: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <input
          required
          type="text"
          value={form.name}
          onChange={set("name")}
          placeholder="Name"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <input
          type="text"
          value={form.title}
          onChange={set("title")}
          placeholder="Title (e.g., CEO)"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <StateSelect required value={form.state_of_residence} onChange={set("state_of_residence")} />
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm">Add Officer</Button>
        {onCancel && <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>}
      </div>
    </form>
  );
}
