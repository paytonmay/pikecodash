import { ProvenanceBadge } from "@/components/ui";
import type { Stat } from "@/lib/data";

export function StatTile({ stat }: { stat: Stat }) {
  return (
    <div className="panel p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs uppercase tracking-wider text-ink-3">{stat.label}</p>
        <ProvenanceBadge p={stat.provenance} />
      </div>
      <p className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
        {stat.value}
      </p>
      {stat.detail && <p className="mt-1 text-sm text-ink-2">{stat.detail}</p>}
    </div>
  );
}
