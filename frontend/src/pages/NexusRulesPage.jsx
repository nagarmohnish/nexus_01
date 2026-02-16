import { useState, useEffect } from "react";
import apiClient from "../api/client";
import Card from "../components/common/Card";
import LoadingSpinner from "../components/common/LoadingSpinner";

const fmt = (val) => val ? `$${Number(val).toLocaleString()}` : "—";

export default function NexusRulesPage() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("physical"); // "physical" or "economic"

  useEffect(() => {
    apiClient.get("/nexus-rules").then((r) => {
      setRules(r.data);
      setLoading(false);
    });
  }, []);

  const filtered = rules.filter(
    (r) =>
      r.state_name.toLowerCase().includes(search.toLowerCase()) ||
      r.state_code.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">State Nexus Rules Reference</h1>
        <p className="text-sm text-slate-500 mt-1">
          Physical and economic nexus triggers for all 50 states + DC. Rules last updated: 2025.
        </p>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search states..."
          className="w-full max-w-sm rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <div className="flex gap-1 border border-slate-300 rounded-lg p-0.5">
          <button
            onClick={() => setView("physical")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              view === "physical" ? "bg-blue-500 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Physical Nexus
          </button>
          <button
            onClick={() => setView("economic")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              view === "economic" ? "bg-blue-500 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Economic Nexus
          </button>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          {view === "physical" ? (
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">State</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Income Tax</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Franchise</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Gross Receipts</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Employee</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Contractor</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Officer</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Office</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Incorp.</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filtered.map((rule) => (
                  <tr key={rule.state_code} className="hover:bg-slate-50">
                    <td className="px-4 py-2 font-medium text-slate-900 whitespace-nowrap">
                      {rule.state_name}
                      <span className="text-slate-400 ml-1">({rule.state_code})</span>
                    </td>
                    <td className="px-4 py-2 text-center">{dot(rule.has_corporate_income_tax)}</td>
                    <td className="px-4 py-2 text-center">{dot(rule.has_franchise_tax)}</td>
                    <td className="px-4 py-2 text-center">{dot(rule.has_gross_receipts_tax)}</td>
                    <td className="px-4 py-2 text-center">{nexusDot(rule.employee_creates_nexus)}</td>
                    <td className="px-4 py-2 text-center">
                      {nexusDot(rule.contractor_creates_nexus, rule.contractor_possible_nexus)}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {nexusDot(rule.officer_creates_nexus, rule.officer_possible_nexus)}
                    </td>
                    <td className="px-4 py-2 text-center">{nexusDot(rule.office_creates_nexus)}</td>
                    <td className="px-4 py-2 text-center">{nexusDot(rule.incorporation_creates_nexus)}</td>
                    <td className="px-4 py-2 text-xs text-slate-500 max-w-xs truncate" title={rule.notes}>
                      {rule.notes || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">State</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Income Tax Threshold</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Tax Rate</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Sales Tax</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Sales Threshold</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Digital Ads</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Digital Subs</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Apportion</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Filing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filtered.map((rule) => (
                  <tr key={rule.state_code} className="hover:bg-slate-50">
                    <td className="px-4 py-2 font-medium text-slate-900 whitespace-nowrap">
                      {rule.state_name}
                      <span className="text-slate-400 ml-1">({rule.state_code})</span>
                    </td>
                    <td className="px-4 py-2 text-right text-slate-600">
                      {fmt(rule.economic_nexus_revenue_threshold)}
                    </td>
                    <td className="px-4 py-2 text-center text-slate-600 text-xs">
                      {rule.income_tax_rate || "—"}
                    </td>
                    <td className="px-4 py-2 text-center">{dot(rule.has_sales_tax)}</td>
                    <td className="px-4 py-2 text-right text-slate-600">
                      {fmt(rule.sales_tax_economic_nexus_revenue)}
                    </td>
                    <td className="px-4 py-2 text-center">{dot(rule.digital_advertising_taxable)}</td>
                    <td className="px-4 py-2 text-center">{dot(rule.digital_subscriptions_taxable)}</td>
                    <td className="px-4 py-2 text-center text-xs text-slate-600">
                      {rule.apportionment_method
                        ? rule.apportionment_method.replace(/_/g, " ")
                        : "—"}
                    </td>
                    <td className="px-4 py-2 text-center text-xs text-slate-600">
                      {rule.filing_due_date || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}

function dot(value) {
  return value ? (
    <span className="inline-block w-2.5 h-2.5 bg-blue-500 rounded-full" title="Yes" />
  ) : (
    <span className="inline-block w-2.5 h-2.5 bg-slate-200 rounded-full" title="No" />
  );
}

function nexusDot(definite, possible) {
  if (definite) {
    return <span className="inline-block w-2.5 h-2.5 bg-red-500 rounded-full" title="Creates definite nexus" />;
  }
  if (possible) {
    return <span className="inline-block w-2.5 h-2.5 bg-amber-400 rounded-full" title="Creates possible nexus" />;
  }
  return <span className="inline-block w-2.5 h-2.5 bg-slate-200 rounded-full" title="No nexus trigger" />;
}
