import { ArrowRight, BookOpenCheck, LibraryBig } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

import { copy } from "@/app/copy";
import { useRepository } from "@/data/repository-context";

export function DemoPage() {
  const repository = useRepository();
  const [counts, setCounts] = useState({ constitutions: 0, constraints: 0 });

  useEffect(() => {
    let active = true;
    Promise.all([
      repository.listConstitutions(),
      repository.listConstraints(),
    ]).then(([constitutions, constraints]) => {
      if (!active) return;
      setCounts({
        constitutions: constitutions.filter((item) => item.status === "Active")
          .length,
        constraints: constraints.filter((item) => item.status === "Active")
          .length,
      });
    });
    return () => {
      active = false;
    };
  }, [repository]);

  return (
    <div className="mx-auto max-w-7xl">
      <section className="hero-panel">
        <div className="max-w-3xl">
          <p className="eyebrow">Common decision system foundation</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {copy.productName}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            {copy.productTagline}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="button button--primary" to="/constitutions">
              Open active Constitution
              <ArrowRight aria-hidden="true" size={17} />
            </Link>
            <Link className="button button--secondary" to="/constraints">
              Explore constraints
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-400">
            <span>{counts.constitutions} active Constitution</span>
            <span>{counts.constraints} active constraints</span>
            <span>4 BPR&E pillars</span>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <Link className="module-card" to="/constitutions">
          <BookOpenCheck aria-hidden="true" className="text-amber-300" />
          <div>
            <p className="eyebrow">Stage 01</p>
            <h2 className="mt-2 text-xl font-semibold text-white">
              Decision Constitutions
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Define strategic priorities, non-negotiable boundaries, decision
              rights, and escalation thresholds with version history.
            </p>
          </div>
        </Link>
        <Link className="module-card" to="/constraints">
          <LibraryBig aria-hidden="true" className="text-amber-300" />
          <div>
            <p className="eyebrow">Stage 02</p>
            <h2 className="mt-2 text-xl font-semibold text-white">
              Constraint Library
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Translate strategic principles into measurable, inspectable, and
              reusable decision rules.
            </p>
          </div>
        </Link>
      </div>

      <p className="disclaimer mt-6" role="note">
        {copy.demoDisclaimer}
      </p>
    </div>
  );
}
