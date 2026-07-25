import type { Provenance } from "@/lib/data";

const provenanceStyle: Record<Provenance, { label: string; cls: string }> = {
  census: { label: "verified", cls: "text-[var(--good-text)] border-[var(--good-text)]/40" },
  estimate: { label: "estimate", cls: "text-[var(--warn-text)] border-[var(--warn-text)]/50" },
  approx: { label: "approx.", cls: "text-[var(--warn-text)] border-[var(--warn-text)]/50" },
  needed: { label: "data needed", cls: "text-[var(--alert-text)] border-[var(--alert-text)]/50" },
};

export function ProvenanceBadge({ p }: { p: Provenance }) {
  const s = provenanceStyle[p];
  return (
    <span
      className={`inline-block rounded-sm border px-2 py-px text-[10px] uppercase tracking-wider ${s.cls}`}
    >
      {s.label}
    </span>
  );
}

export function SectionHeader({
  kicker,
  title,
  blurb,
}: {
  kicker: string;
  title: string;
  blurb?: string;
}) {
  return (
    <div className="mb-6">
      <div className="mb-1 flex items-center gap-3">
        <span className="h-px w-8 bg-accent/60" />
        <span className="text-xs uppercase tracking-[0.25em] text-accent">
          {kicker}
        </span>
      </div>
      <h2 className="font-display text-2xl font-semibold sm:text-3xl">{title}</h2>
      {blurb && <p className="mt-2 max-w-2xl text-sm text-ink-2">{blurb}</p>}
    </div>
  );
}

/** Compact cluster divider for the dense dashboard layout. */
export function ClusterLabel({
  label,
  note,
}: {
  label: string;
  note?: string;
}) {
  return (
    <div className="mb-3 mt-8 flex items-baseline gap-3">
      <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">
        {label}
      </span>
      <span className="h-px flex-1 self-center bg-hairline" />
      {note && <span className="text-[11px] text-ink-3">{note}</span>}
    </div>
  );
}

export function NeededList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-sm text-ink-2">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--alert-text)]" />
          {item}
        </li>
      ))}
    </ul>
  );
}
