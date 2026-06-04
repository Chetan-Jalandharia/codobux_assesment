export function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--surface-muted)]/50 px-4 py-8 text-center">
      <p className="text-sm font-medium text-slate-700">No blocks yet</p>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Tap <span className="font-medium text-slate-600">Add Block</span> to start
        your landing page.
      </p>
    </div>
  );
}
