export function ModulePlaceholder({ title }: { title: string }) {
  return (
    <section className="mx-auto max-w-7xl">
      <p className="eyebrow">Governance module</p>
      <h1 className="mt-2 text-3xl font-semibold text-white">{title}</h1>
      <div className="empty-panel mt-6">
        <p className="text-slate-300">
          The workspace is ready. Business records will appear here after the
          local repository initializes.
        </p>
      </div>
    </section>
  );
}
