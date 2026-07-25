"use client";

import { useState } from "react";

interface Bar {
  label: string;
  value: number;
  detail?: string;
}

/**
 * Single-series horizontal bars — one hue, thin marks, rounded data-end,
 * direct value labels at the bar end, per-mark hover tooltip.
 */
export function HBars({
  bars,
  formatValue,
  color = "var(--series-1)",
  max,
  compact = false,
}: {
  bars: Bar[];
  formatValue: (v: number) => string;
  color?: string;
  max?: number;
  compact?: boolean;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const top = max ?? Math.max(...bars.map((b) => b.value));

  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      {bars.map((b, i) => {
        const pct = (b.value / top) * 100;
        return (
          <div
            key={b.label}
            className="group relative"
            onPointerEnter={() => setHover(i)}
            onPointerLeave={() => setHover(null)}
          >
            <div className="mb-1 flex items-baseline justify-between gap-3">
              <span className={compact ? "text-xs text-ink-2" : "text-sm text-ink-2"}>
                {b.label}
              </span>
              <span
                className={`${compact ? "text-xs" : "text-sm"} font-medium`}
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {formatValue(b.value)}
              </span>
            </div>
            <div
              className={`${compact ? "h-1.5" : "h-2.5"} overflow-hidden rounded-[3px] bg-black/5`}
            >
              <div
                className="h-full rounded-[3px] transition-[width] duration-700"
                style={{
                  width: `${pct}%`,
                  background: color,
                  filter: hover === i ? "brightness(0.85)" : undefined,
                }}
              />
            </div>
            {hover === i && b.detail && (
              <div className="pointer-events-none absolute -top-8 left-0 z-10 rounded-md border border-hairline-strong bg-surface-2 px-3 py-1.5 text-xs shadow-lg">
                {b.detail}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
