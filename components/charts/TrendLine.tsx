"use client";

import { useRef, useState } from "react";

interface Point {
  x: number; // e.g. year
  y: number;
  flag?: string; // e.g. "estimate"
}

/**
 * Single-series line + area chart (SVG) with a crosshair hover tooltip.
 * Single series → no legend box; the panel title names it.
 */
export function TrendLine({
  points,
  formatY,
  height = 240,
}: {
  points: Point[];
  formatY: (v: number) => string;
  height?: number;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const W = 640;
  const H = height;
  const pad = { top: 16, right: 20, bottom: 28, left: 52 };
  const iw = W - pad.left - pad.right;
  const ih = H - pad.top - pad.bottom;

  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMax = Math.max(...ys) * 1.08;
  const yMin = 0;

  const sx = (x: number) => pad.left + ((x - xMin) / (xMax - xMin)) * iw;
  const sy = (y: number) => pad.top + ih - ((y - yMin) / (yMax - yMin)) * ih;

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${sx(p.x)},${sy(p.y)}`)
    .join(" ");
  const areaPath = `${linePath} L${sx(xMax)},${pad.top + ih} L${sx(xMin)},${pad.top + ih} Z`;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => yMin + t * (yMax - yMin));

  function onMove(e: React.PointerEvent<SVGSVGElement>) {
    const rect = svgRef.current!.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    let best = 0;
    let bestD = Infinity;
    points.forEach((p, i) => {
      const d = Math.abs(sx(p.x) - px);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    setHover(best);
  }

  const h = hover !== null ? points[hover] : null;

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full touch-none"
        role="img"
        aria-label="Trend line chart"
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
      >
        {yTicks.map((t) => (
          <g key={t}>
            <line
              x1={pad.left}
              x2={W - pad.right}
              y1={sy(t)}
              y2={sy(t)}
              stroke="var(--grid-hairline)"
              strokeWidth={1}
            />
            <text
              x={pad.left - 8}
              y={sy(t) + 4}
              textAnchor="end"
              fontSize={11}
              fill="var(--text-muted)"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {formatY(t)}
            </text>
          </g>
        ))}
        <line
          x1={pad.left}
          x2={W - pad.right}
          y1={pad.top + ih}
          y2={pad.top + ih}
          stroke="var(--axis)"
          strokeWidth={1}
        />
        {points.map((p) => (
          <text
            key={p.x}
            x={sx(p.x)}
            y={H - 8}
            textAnchor="middle"
            fontSize={11}
            fill="var(--text-muted)"
          >
            {p.x}
          </text>
        ))}

        <path d={areaPath} fill="var(--series-1)" opacity={0.12} />
        <path
          d={linePath}
          fill="none"
          stroke="var(--series-1)"
          strokeWidth={2}
          strokeLinejoin="round"
        />
        {points.map((p) => (
          <circle
            key={p.x}
            cx={sx(p.x)}
            cy={sy(p.y)}
            r={4}
            fill={p.flag ? "var(--surface-1)" : "var(--series-1)"}
            stroke="var(--series-1)"
            strokeWidth={2}
          />
        ))}

        {h && (
          <g>
            <line
              x1={sx(h.x)}
              x2={sx(h.x)}
              y1={pad.top}
              y2={pad.top + ih}
              stroke="var(--axis)"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
            <circle
              cx={sx(h.x)}
              cy={sy(h.y)}
              r={6}
              fill="var(--series-1)"
              stroke="var(--surface-1)"
              strokeWidth={2}
            />
          </g>
        )}
      </svg>

      {h && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-md border border-hairline-strong bg-surface-2 px-3 py-1.5 text-xs shadow-lg"
          style={{
            left: `${(sx(h.x) / W) * 100}%`,
            top: `${(sy(h.y) / H) * 100 - 16}%`,
          }}
        >
          <span className="text-ink-3">{h.x}</span>{" "}
          <span className="font-medium">{formatY(h.y)}</span>
          {h.flag && <span className="ml-1 text-[#fab219]">({h.flag})</span>}
        </div>
      )}
    </div>
  );
}
