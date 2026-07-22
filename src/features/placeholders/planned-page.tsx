import { Construction } from "lucide-react";

export function PlannedPage({ title }: { title: string }) {
  return (
    <section className="empty-panel mx-auto max-w-3xl">
      <Construction aria-hidden="true" className="text-amber-300" size={28} />
      <p className="eyebrow mt-5">Planned workflow stage</p>
      <h1 className="mt-2 text-3xl font-semibold text-white">{title}</h1>
      <p className="mt-4 max-w-xl leading-7 text-slate-400">
        This stage is visible to preserve the end-to-end decision workflow. It
        will be activated in the next delivery sprint.
      </p>
    </section>
  );
}
