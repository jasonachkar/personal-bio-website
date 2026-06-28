export function WhatThisDemonstrates({ children }: { children: React.ReactNode }) {
  return (
    <aside className="rounded-lg border border-border bg-surface p-5">
      <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-text-muted">
        What this demonstrates
      </h2>
      <p className="mt-3 text-sm leading-6 text-text-secondary">{children}</p>
    </aside>
  );
}
