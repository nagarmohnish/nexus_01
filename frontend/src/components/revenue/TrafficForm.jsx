import { useState } from "react";
import Button from "../common/Button";
import StateSelect from "../common/StateSelect";

const currentYear = new Date().getFullYear();

export default function TrafficForm({ properties, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    property_id: "",
    state_code: "",
    year: currentYear,
    monthly_pageviews: "",
    percentage_of_total: "",
    newsletter_subscribers: "",
  });

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit({
      property_id: form.property_id,
      state_code: form.state_code,
      year: parseInt(form.year),
      monthly_pageviews: parseInt(form.monthly_pageviews) || 0,
      percentage_of_total: parseFloat(form.percentage_of_total) || 0,
      newsletter_subscribers: parseInt(form.newsletter_subscribers) || 0,
    });
    setForm({
      property_id: "",
      state_code: "",
      year: currentYear,
      monthly_pageviews: "",
      percentage_of_total: "",
      newsletter_subscribers: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
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
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs text-slate-500 mb-1">Monthly Pageviews</label>
          <input
            type="number"
            min="0"
            value={form.monthly_pageviews}
            onChange={set("monthly_pageviews")}
            placeholder="e.g. 500000"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">% of Total Traffic</label>
          <input
            required
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={form.percentage_of_total}
            onChange={set("percentage_of_total")}
            placeholder="e.g. 12.5"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Newsletter Subscribers</label>
          <input
            type="number"
            min="0"
            value={form.newsletter_subscribers}
            onChange={set("newsletter_subscribers")}
            placeholder="e.g. 5000"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm">Add Traffic Data</Button>
        {onCancel && <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>}
      </div>
    </form>
  );
}
