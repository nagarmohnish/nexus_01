import { useState } from "react";
import Button from "../common/Button";
import StateSelect from "../common/StateSelect";

export default function RegisteredAgentForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({ state: "", agent_name: "" });

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit({ ...form, agent_name: form.agent_name || null });
    setForm({ state: "", agent_name: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <StateSelect required value={form.state} onChange={set("state")} />
        <input
          type="text"
          value={form.agent_name}
          onChange={set("agent_name")}
          placeholder="Agent name (optional)"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm">Add Registered Agent</Button>
        {onCancel && <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>}
      </div>
    </form>
  );
}
