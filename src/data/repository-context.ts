import { createContext, useContext } from "react";

import type { WorkspaceRepository } from "./repository";
import { workspaceRepository } from "./repository-instance";

export const RepositoryContext =
  createContext<WorkspaceRepository>(workspaceRepository);

export function useRepository(): WorkspaceRepository {
  return useContext(RepositoryContext);
}
