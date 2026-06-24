import { Navigate, Route, Routes } from "react-router";

import { DemoPage } from "@/features/demo/demo-page";
import { ConstitutionDetailPage } from "@/features/constitutions/constitution-detail";
import { ConstitutionFormPage } from "@/features/constitutions/constitution-form";
import { ConstitutionListPage } from "@/features/constitutions/constitution-list";
import { ConstraintDetailPage } from "@/features/constraints/constraint-detail";
import { ConstraintFormPage } from "@/features/constraints/constraint-form";
import { ConstraintListPage } from "@/features/constraints/constraint-list";
import { PlannedPage } from "@/features/placeholders/planned-page";

import { AppShell } from "./app-shell";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route element={<Navigate replace to="/demo" />} index />
        <Route element={<DemoPage />} path="/demo" />
        <Route element={<ConstitutionListPage />} path="/constitutions" />
        <Route element={<ConstitutionFormPage />} path="/constitutions/new" />
        <Route
          element={<ConstitutionFormPage />}
          path="/constitutions/:id/edit"
        />
        <Route
          element={<ConstitutionDetailPage />}
          path="/constitutions/:id"
        />
        <Route element={<ConstraintListPage />} path="/constraints" />
        <Route element={<ConstraintFormPage />} path="/constraints/new" />
        <Route
          element={<ConstraintFormPage />}
          path="/constraints/:id/edit"
        />
        <Route
          element={<ConstraintDetailPage />}
          path="/constraints/:id"
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
