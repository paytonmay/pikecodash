/**
 * Thin capacity meter with a status color chosen by threshold.
 * Status is never color-alone — the label + value ride alongside.
 */
export function Meter({
  pct,
  label,
  sublabel,
  compact = false,
}: {
  pct: number;
  label: string;
  sublabel?: string;
  compact?: boolean;
}) {
  const clamped = Math.max(0, Math.min(100, pct));
  const color =
    clamped >= 90
      ? "var(--status-critical)"
      : clamped >= 70
        ? "var(--status-serious)"
        : "var(--accent)";

  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <span className={compact ? "text-[11px] text-ink-3" : "text-sm text-ink-2"}>
          {label}
        </span>
        <span
          className={`${compact ? "text-xs" : "text-sm"} font-medium`}
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {clamped}%
        </span>
      </div>
      <div
        className={`${compact ? "h-1.5" : "h-2.5"} overflow-hidden rounded-[3px] bg-black/5`}
      >
        <div
          className="h-full rounded-[3px] transition-[width] duration-700"
          style={{ width: `${clamped}%`, background: color }}
        />
      </div>
      {sublabel && <p className="mt-1.5 text-xs text-ink-3">{sublabel}</p>}
    </div>
  );
}
