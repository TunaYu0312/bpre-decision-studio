import { CircleDot, Menu, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet } from "react-router";

import { copy } from "./copy";
import { governanceItems, navigationItems } from "./navigation";

export function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <aside
        className={`app-sidebar ${menuOpen ? "app-sidebar--open" : ""}`}
      >
        <div className="border-b border-white/10 px-5 py-6">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-300 text-slate-950">
            <ShieldCheck aria-hidden="true" size={22} />
          </div>
          <p className="text-sm font-semibold tracking-wide text-white">
            {copy.productName}
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            Retail decision meetings
          </p>
        </div>

        <nav
          aria-label="Primary navigation"
          className="flex-1 space-y-1 p-3"
        >
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                className={({ isActive }) =>
                  `nav-item ${isActive ? "nav-item--active" : ""}`
                }
                key={item.to}
                onClick={() => setMenuOpen(false)}
                to={item.to}
              >
                <Icon aria-hidden="true" size={18} />
                <span className="flex-1">{item.label}</span>
              </NavLink>
            );
          })}
          <div className="nav-group-label">Rules &amp; Governance</div>
          {governanceItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                className={({ isActive }) =>
                  `nav-item nav-item--governance ${
                    isActive ? "nav-item--active" : ""
                  }`
                }
                key={`${item.label}-${item.to}`}
                onClick={() => setMenuOpen(false)}
                to={item.to}
              >
                <Icon aria-hidden="true" size={17} />
                <span className="flex-1">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4 text-xs leading-5 text-slate-500">
          Local-first workspace
          <br />
          No data leaves this browser
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/95 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <button
              aria-expanded={menuOpen}
              aria-label="Toggle navigation"
              className="icon-button lg:hidden"
              onClick={() => setMenuOpen((current) => !current)}
              type="button"
            >
              <Menu aria-hidden="true" size={20} />
            </button>
            <p className="hidden text-sm text-slate-400 sm:block">
              Decision Project → Facts → Recommendation → Action & Review
            </p>
            <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
              <CircleDot aria-hidden="true" size={14} />
              Demo workspace
            </div>
          </div>
        </header>

        <main className="px-4 py-8 sm:px-6 lg:px-8" id="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
