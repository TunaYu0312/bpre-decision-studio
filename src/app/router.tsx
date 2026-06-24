import { Navigate, Route, Routes } from "react-router";

import { DemoPage } from "@/features/demo/demo-page";
import { ModulePlaceholder } from "@/features/placeholders/module-placeholder";
import { PlannedPage } from "@/features/placeholders/planned-page";

import { AppShell } from "./app-shell";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route element={<Navigate replace to="/demo" />} index />
        <Route element={<DemoPage />} path="/demo" />
        <Route
          element={<ModulePlaceholder title="Decision Constitutions" />}
          path="/constitutions/*"
        />
        <Route
          element={<ModulePlaceholder title="Constraint Library" />}
          path="/constraints/*"
        />
        <Route
          element={<PlannedPage title="Decision Projects" />}
          path="/decision-projects"
        />
        <Route
          element={<PlannedPage title="Evaluation Queue" />}
          path="/evaluation"
        />
        <Route
          element={<PlannedPage title="Action & Review" />}
          path="/action-review"
        />
        <Route
          element={<PlannedPage title="Export / Settings" />}
          path="/settings"
        />
      </Route>
    </Routes>
  );
}
