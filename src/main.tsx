import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import { AppRoutes } from "@/app/router";
import { RepositoryProvider } from "@/data/repository-provider";
import { WorkspaceBootstrap } from "@/data/workspace-bootstrap";

import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <RepositoryProvider>
        <WorkspaceBootstrap>
          <AppRoutes />
        </WorkspaceBootstrap>
      </RepositoryProvider>
    </BrowserRouter>
  </StrictMode>,
);
