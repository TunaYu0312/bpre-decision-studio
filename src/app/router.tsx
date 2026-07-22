import { Navigate, Route, Routes } from "react-router";

import { DecisionAgendaPage } from "@/features/decisions/decision-agenda";
import { DecisionHomePage } from "@/features/decisions/decision-home";
import { DecisionMeetingModePage } from "@/features/decisions/decision-meeting-mode";
import { DecisionWorkspacePage } from "@/features/decisions/decision-workspace";
import { ReviewFollowUpPage } from "@/features/decisions/review-follow-up";
import { ConstitutionDetailPage } from "@/features/constitutions/constitution-detail";
import { ConstitutionFormPage } from "@/features/constitutions/constitution-form";
import { ConstitutionListPage } from "@/features/constitutions/constitution-list";
import { ConstraintDetailPage } from "@/features/constraints/constraint-detail";
import { ConstraintFormPage } from "@/features/constraints/constraint-form";
import { ConstraintListPage } from "@/features/constraints/constraint-list";
import { PlannedPage } from "@/features/placeholders/planned-page";
import { PriceSensitivityPage } from "@/features/pricing/price-sensitivity";
import { PricingBaselinePage } from "@/features/pricing/pricing-baseline";
import { PricingDecisionPage } from "@/features/pricing/pricing-decision";
import { PricingDecisionRoomPage } from "@/features/pricing/pricing-decision-room";
import { PricingIntentPage } from "@/features/pricing/pricing-intent";
import { PricingProjectsPage } from "@/features/pricing/pricing-projects";
import { ScenarioLabPage } from "@/features/pricing/scenario-lab";

import { AppShell } from "./app-shell";

export function AppRoutes() {
  return (
    <Routes>
      <Route
        element={<PricingDecisionRoomPage />}
        path="/pricing/:id/room/:stage?"
      />
      <Route
        element={<DecisionMeetingModePage />}
        path="/decisions/:id/meeting"
      />
      <Route element={<AppShell />}>
        <Route element={<Navigate replace to="/pricing" />} index />
        <Route element={<PricingProjectsPage />} path="/pricing" />
        <Route
          element={
            <Navigate
              replace
              to="/pricing/pricing-core-menu-2026/room/current"
            />
          }
          path="/pricing/pricing-core-menu-2026"
        />
        <Route
          element={<PricingIntentPage />}
          path="/pricing/:id/intent"
        />
        <Route
          element={<PricingBaselinePage />}
          path="/pricing/:id/baseline"
        />
        <Route
          element={<PriceSensitivityPage />}
          path="/pricing/:id/research"
        />
        <Route
          element={<ScenarioLabPage />}
          path="/pricing/:id/scenarios"
        />
        <Route
          element={<PricingDecisionPage />}
          path="/pricing/:id/decision"
        />
        <Route element={<Navigate replace to="/pricing" />} path="/home" />
        <Route element={<DecisionHomePage />} path="/legacy/home" />
        <Route element={<Navigate replace to="/pricing" />} path="/demo" />
        <Route element={<DecisionAgendaPage />} path="/decision-agenda" />
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
          element={<DecisionWorkspacePage />}
          path="/decisions/:id"
        />
        <Route
          element={<PlannedPage title="Evaluation Queue" />}
          path="/evaluation"
        />
        <Route
          element={<ReviewFollowUpPage />}
          path="/review-follow-up"
        />
        <Route
          element={<PlannedPage title="Export / Settings" />}
          path="/settings"
        />
      </Route>
    </Routes>
  );
}
