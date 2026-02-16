import { useState } from "react";
import Button from "../common/Button";
import StateSelect from "../common/StateSelect";
import { ENTITY_TYPES } from "../../utils/constants";

const INITIAL = {
  legal_name: "",
  dba_name: "",
  entity_type: "LLC",
  state_of_incorporation: "",
  ein: "",
  fiscal_year_end_month: "12",
  fiscal_year_end_day: "31",
};

export default function EntityForm({ initial, entities = [], onSubmit, onCancel }) {
  const [form, setForm] = useState(initial || INITIAL);
  const [saving, setSaving] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit({
        ...form,
        ein: form.ein || null,
        dba_name: form.dba_name || null,
        parent_entity_id: form.parent_entity_id || null,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Legal Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={form.legal_name}
          onChange={set("legal_name")}
          className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="e.g., LH2 Holdings LLC"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          DBA / Brand Name
        </label>
        <input
          type="text"
          value={form.dba_name}
          onChange={set("dba_name")}
          className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="e.g., Inquisitr"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Entity Type <span className="text-red-500">*</span>
          </label>
          <select
            required
            value={form.entity_type}
            onChange={set("entity_type")}
            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            {ENTITY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            State of Incorporation <span className="text-red-500">*</span>
          </label>
          <StateSelect
            required
            value={form.state_of_incorporation}
            onChange={set("state_of_incorporation")}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            EIN
          </label>
          <input
            type="text"
            value={form.ein}
            onChange={set("ein")}
            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="XX-XXXXXXX"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Parent Entity
          </label>
          <select
            value={form.parent_entity_id || ""}
            onChange={set("parent_entity_id")}
            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">None (top-level)</option>
            {entities.map((e) => (
              <option key={e.id} value={e.id}>
                {e.legal_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Fiscal Year End Month
          </label>
          <select
            value={form.fiscal_year_end_month}
            onChange={set("fiscal_year_end_month")}
            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={String(i + 1)}>
                {new Date(2000, i).toLocaleString("en-US", { month: "long" })}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Fiscal Year End Day
          </label>
          <input
            type="number"
            min="1"
            max="31"
            value={form.fiscal_year_end_day}
            onChange={set("fiscal_year_end_day")}
            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : initial ? "Update" : "Create Entity"}
        </Button>
      </div>
    </form>
  );
}
