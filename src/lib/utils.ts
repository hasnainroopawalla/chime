export { cn } from "cn";

const units = [
  { label: "yr", seconds: 365.25 * 24 * 60 * 60 },
  { label: "d", seconds: 24 * 60 * 60 },
  { label: "hr", seconds: 60 * 60 },
  { label: "min", seconds: 60 },
  { label: "sec", seconds: 1 },
];

export function formatCompactDuration(totalSeconds: number) {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return "Unavailable";

  const parts: string[] = [];
  let remainingSeconds = Math.ceil(totalSeconds);

  for (const unit of units) {
    const value = Math.floor(remainingSeconds / unit.seconds);
    if (value === 0 && parts.length === 0) continue;
    if (value > 0) {
      parts.push(`${value} ${unit.label}`);
      remainingSeconds -= value * unit.seconds;
    }
    if (parts.length === 2) break;
  }

  return parts.join(" ");
}
