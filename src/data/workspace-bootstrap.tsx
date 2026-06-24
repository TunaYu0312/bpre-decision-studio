import { AlertTriangle, LoaderCircle } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";

import { loadSeedData } from "./seed";
import { useRepository } from "./repository-context";

export function WorkspaceBootstrap({ children }: { children: ReactNode }) {
  const repository = useRepository();
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let active = true;
    loadSeedData(repository)
      .then(() => {
        if (active) setState("ready");
      })
      .catch(() => {
        if (active) setState("error");
      });
    return () => {
      active = false;
    };
  }, [repository]);

  if (state === "loading") {
    return (
      <div className="loading-screen">
        <LoaderCircle className="animate-spin text-amber-300" />
        <p>Preparing the local decision workspace…</p>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="loading-screen">
        <AlertTriangle className="text-rose-300" />
        <h1 className="text-xl font-semibold text-white">
          Local workspace unavailable
        </h1>
        <p className="max-w-lg text-center text-slate-400">
          This browser must allow IndexedDB storage. No data is transmitted to
          a server.
        </p>
      </div>
    );
  }

  return children;
}
