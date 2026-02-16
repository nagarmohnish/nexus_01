import { NEXUS_STATUS_CONFIG } from "../../utils/constants";

export default function Badge({ status, className = "" }) {
  const config = NEXUS_STATUS_CONFIG[status] || NEXUS_STATUS_CONFIG.no_nexus;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      {config.label}
    </span>
  );
}
