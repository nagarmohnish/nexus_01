import { useState, useEffect } from "react";
import Button from "../common/Button";

export default function PropertyManager({ properties, onCreate, onUpdate, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [editingProp, setEditingProp] = useState(null);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (editingProp) {
      setName(editingProp.name);
      setUrl(editingProp.url || "");
      setShowForm(true);
    }
  }, [editingProp]);

  const resetForm = () => {
    setName("");
    setUrl("");
    setShowForm(false);
    setEditingProp(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { name: name.trim(), url: url.trim() || null };
    if (editingProp) {
      await onUpdate(editingProp.id, data);
    } else {
      await onCreate(data);
    }
    resetForm();
  };

  const startAdd = () => {
    setEditingProp(null);
    setName("");
    setUrl("");
    setShowForm(true);
  };

  const startEdit = (p) => {
    setEditingProp(p);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-slate-700">
          Properties / Sub-brands ({properties.length})
        </h4>
        {!showForm && (
          <Button size="sm" onClick={startAdd}>
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
          <Button type="submit" size="sm">{editingProp ? "Save" : "Add"}</Button>
          <Button type="button" variant="ghost" size="sm" onClick={resetForm}>Cancel</Button>
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
                onClick={() => startEdit(p)}
                className="text-blue-400 hover:text-blue-600 ml-1"
                title="Edit property"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                  <path d="M13.49 3.51a3.13 3.13 0 0 0-4.43 0L2.7 9.87a1 1 0 0 0-.26.45l-.78 3.12a.5.5 0 0 0 .6.6l3.12-.78a1 1 0 0 0 .45-.26l6.36-6.36a3.13 3.13 0 0 0 0-4.43l-.7-.7ZM10.12 4.17l1.71 1.71-5.3 5.3-2.12.53.53-2.12 5.18-5.42Z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(p.id)}
                className="text-red-400 hover:text-red-600 text-xs"
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
