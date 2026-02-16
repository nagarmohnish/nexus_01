import { US_STATES } from "./constants";

export function getStateName(code) {
  const state = US_STATES.find((s) => s.code === code);
  return state ? state.name : code;
}

export function formatDate(isoString) {
  if (!isoString) return "—";
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatEin(ein) {
  if (!ein) return "—";
  const digits = ein.replace(/\D/g, "");
  if (digits.length === 9) {
    return `${digits.slice(0, 2)}-${digits.slice(2)}`;
  }
  return ein;
}
