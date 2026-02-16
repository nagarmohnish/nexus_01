import { useState } from "react";
import Button from "../common/Button";

export default function PropertyManager({ properties, onCreate, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onCreate({ name: name.trim(), url: url.trim() || null });
    setName("");
    setUrl("");
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-slate-700">
          Properties / Sub-brands ({properties.length})
        </h4>
        {!showForm && (
          <Button size="sm" onClick={() => setShowForm(true)}>
            + Add Property
          </Button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-50 rounded-lg p-3 mb-3 flex gap-2 items-end">
          <div className="flex-1">
            <label className="block text-xs text-slate-500 mb-1">Property Name *</label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., TechBlog.com"
              className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-slate-500 mb-1">URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://techblog.com"
              className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <Button type="submit" size="sm">Add</Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
        </form>
      )}

      {properties.length === 0 && !showForm && (
        <div className="text-center py-6 bg-slate-50 rounded-lg border border-dashed border-slate-300">
          <p className="text-sm text-slate-500">No properties yet. Add sub-brands/websites to track revenue by property.</p>
        </div>
      )}

      {properties.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {properties.map((p) => (
            <div
              key={p.id}
              className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm"
            >
              <span className="font-medium text-slate-700">{p.name}</span>
              {p.url && (
                <span className="text-slate-400 text-xs truncate max-w-[150px]">{p.url}</span>
              )}
              <button
                onClick={() => onDelete(p.id)}
                className="text-red-400 hover:text-red-600 text-xs ml-1"
                title="Remove property"
              >
                x
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
