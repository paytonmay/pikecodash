import Link from "next/link";
import { PikeMap } from "@/components/map/PikeMap";

export const metadata = {
  title: "Pike County — Fullscreen Map",
};

export default function MapPage() {
  return (
    <main className="flex min-h-dvh flex-col px-4 py-4 sm:px-6">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-display text-sm font-semibold tracking-[0.2em] text-accent">
          PIKE·CO<span className="text-ink-3">/MAP</span>
        </span>
        <Link
          href="/"
          className="rounded-sm border border-hairline-strong px-3 py-1.5 text-xs text-accent hover:bg-accent-dim"
        >
          ← Back to dashboard
        </Link>
      </div>
      <div className="flex-1">
        <PikeMap heightClass="h-[calc(100dvh-8.5rem)]" />
      </div>
    </main>
  );
}
