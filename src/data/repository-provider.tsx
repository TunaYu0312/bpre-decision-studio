import type { ReactNode } from "react";

import type { WorkspaceRepository } from "./repository";
import { RepositoryContext } from "./repository-context";
import { workspaceRepository } from "./repository-instance";

export function RepositoryProvider({
  children,
  repository = workspaceRepository,
}: {
  children: ReactNode;
  repository?: WorkspaceRepository;
}) {
  return (
    <RepositoryContext.Provider value={repository}>
      {children}
    </RepositoryContext.Provider>
  );
}
