export default function NexusSummaryBar({ summary }) {
  if (!summary) return null;

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-red-700">{summary.definite}</div>
        <div className="text-xs font-medium text-red-600 mt-1">Definite Nexus</div>
      </div>
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-orange-700">{summary.probable}</div>
        <div className="text-xs font-medium text-orange-600 mt-1">Probable Nexus</div>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-amber-700">{summary.possible}</div>
        <div className="text-xs font-medium text-amber-600 mt-1">Possible Nexus</div>
      </div>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-green-700">{summary.no_nexus}</div>
        <div className="text-xs font-medium text-green-600 mt-1">No Nexus</div>
      </div>
    </div>
  );
}
