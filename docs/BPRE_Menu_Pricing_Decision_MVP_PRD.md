# BPR&E Menu Pricing Decision Studio — MVP PRD

**Document status:** Product reset / implementation baseline  
**Version:** 1.0  
**Product boundary:** Menu pricing and price-adjustment decisions for chain restaurant businesses  
**Primary object:** Pricing Decision Project  
**Primary outcome:** A defensible price plan, pilot decision, and review record  

---

## 1. Product reset

The first MVP will not attempt to prove a generic enterprise decision-support system.

It will prove one narrower job:

> Help a chain restaurant team decide which menu prices to change, by how much, and under what pilot or rollout conditions—while making the expected demand, product mix, gross profit, customer value, and brand risks visible.

The current general Decision Constitution, Constraint Library, generic Decision Card, and five-page Meeting Mode remain useful architectural experiments. They are not the primary Phase 1 product.

The focused product logic is:

```text
Pricing Decision Project
→ Baseline menu economics
→ Price Sensitivity Study
→ Own- and cross-price response assumptions
→ Price scenarios
→ Product-mix and gross-profit forecast
→ Customer value and brand-risk check
→ Human pricing decision
→ Pilot and actual-vs-forecast review
```

## 2. Why this is a better MVP

The previous design asked users to learn an abstract governance model before receiving practical value. It also required too many modules to be credible at the same time.

Menu pricing has a clearer repeated decision, clearer data requirements, and measurable outcomes:

- current and proposed prices;
- item-level units and UPH;
- own-price sensitivity;
- cross-item substitution and cannibalization;
- net sales, gross profit dollars, and gross margin;
- consumer willingness to pay and acceptable price range;
- Value for Money and price-fairness risk;
- pilot performance after implementation.

The MVP succeeds when it reduces spreadsheet reconciliation and turns a pricing meeting into one comparable set of scenarios and one recorded decision.

## 3. Target decision and users

### 3.1 Decision question

Every project must answer:

> For this market, channel, store cluster, and effective date, which menu items should keep, increase, decrease, or restructure their prices, and what is the expected effect on demand, mix, customer value, and gross profit?

### 3.2 Primary users

| User | Job in the MVP |
|---|---|
| Pricing / Commercial Owner | Creates the project, defines candidate prices, and owns the recommendation |
| Finance | Validates costs, net price, gross profit, and downside cases |
| Marketing / Consumer Insight | Provides Price Sensitivity Study and value-perception evidence |
| Operations | Validates channel, store-cluster, menu-board, and execution implications |
| Category / Product Owner | Reviews product roles, substitutions, and cannibalization |
| Executive Approver | Selects the price plan, pilot, hold, or revision outcome |

The initial design should optimize for a small cross-functional pricing meeting, not for enterprise workflow administration.

## 4. Phase 1 success criteria

A user can complete one menu price-adjustment project without developer support:

1. Create a project and define market, channel, store cluster, menu items, and effective date.
2. Import or enter a baseline period containing price, units, transactions, UPH, item cost, net sales, and gross profit.
3. Add Price Sensitivity Study outputs and label the research method and sample.
4. Add own-price elasticity and, where available, cross-price elasticity or substitution assumptions.
5. Build and compare up to three price scenarios plus the current-price baseline.
6. See item-level and total forecast changes in UPH, units, mix, net sales, gross profit dollars, and gross margin.
7. See customer Value for Money, price-fairness, “too expensive,” and brand-perception risks separately from financial output.
8. Record one human decision: hold price, approve rollout, approve pilot, or revise price architecture.
9. Define owner, rollout scope, KPI thresholds, review date, and stop/rollback rule.
10. At review, compare actual versus forecast and update the elasticity or substitution evidence.

### MVP performance targets

- A prepared project can be understood in under 10 minutes.
- A decision meeting can compare the baseline and three scenarios in under 15 minutes.
- Every forecast number exposes its source and evidence quality.
- The system never presents an assumed elasticity or survey response as observed customer behavior.
- The final decision includes a measurable pilot or rollout plan.

## 5. Scope

### 5.1 In scope

- One market and currency per project.
- One baseline period and one comparable reference period.
- Store-cluster and channel filters.
- Item master and baseline CSV import, with manual correction.
- Price Sensitivity Study result entry/import.
- Van Westendorp PSM result visualization.
- Gabor–Granger purchase-intent and revenue curve visualization.
- Own-price elasticity by item or item group.
- Cross-price elasticity or a simpler substitution-allocation assumption.
- Baseline plus up to three candidate price scenarios.
- Item-level and total product-mix forecast.
- UPH, units, net sales, gross profit dollars, and gross margin forecast.
- Value for Money and brand-risk assessment.
- Evidence-quality labels and downside scenario.
- Meeting-ready decision brief.
- Pilot plan and actual-versus-forecast review.
- Seeded restaurant demo data.

### 5.2 Explicitly out of scope

- Generic decisions outside menu pricing and price adjustment.
- A general Constitution authoring product.
- A standalone Constraint Library as a primary navigation item.
- Automatic optimal-price execution.
- Real-time POS, ERP, CRM, or survey-platform integration.
- Personalized or customer-level dynamic pricing.
- Black-box AI recommendations.
- Full causal elasticity estimation for sparse or confounded data.
- Full choice-based conjoint or assortment optimization.
- Multi-country tax and currency consolidation.
- Automated menu-board publishing.

## 6. Evidence model

The product must keep four evidence sources separate:

| Evidence source | What it can support | What it cannot prove |
|---|---|---|
| Observed POS / experiment | Actual demand, UPH, mix, and response to tested prices | Consumer reasons without research |
| Historical econometric estimate | Own- and cross-price response after controlling for known factors | Causality when price variation or controls are weak |
| Price Sensitivity Study | Stated acceptable range, purchase intent, and value perceptions | Actual market behavior by itself |
| Management assumption | Scenario exploration when evidence is incomplete | A verified forecast |

Each input must have:

- source type;
- source name;
- period and sample;
- segment / market / channel;
- method;
- point estimate;
- confidence interval or plausible range when available;
- evidence quality;
- owner;
- last updated date;
- notes and known limitations.

### Evidence-quality labels

- **Observed:** measured in POS or a controlled pilot.
- **Modelled:** estimated from a documented statistical model.
- **Research-stated:** obtained from a consumer study.
- **Assumption:** management input without direct measurement.
- **Missing:** required evidence is unavailable.

The recommendation must show how much of the forecast depends on Modelled, Research-stated, or Assumption inputs.

## 7. Price Sensitivity Study module

Price Sensitivity Study is a core module, but it is not treated as the same thing as observed price elasticity.

### 7.1 Van Westendorp Price Sensitivity Meter

Use when the business needs to understand the perceived acceptable price range for an item or bundle.

Required aggregated inputs by price point:

- percentage saying the price is too cheap;
- percentage saying the price is cheap / good value;
- percentage saying the price is expensive but still worth considering;
- percentage saying the price is too expensive.

Outputs:

- Point of Marginal Cheapness;
- Point of Marginal Expensiveness;
- acceptable price range;
- Indifference Price Point;
- Optimal Price Point as defined by the method;
- segment differences;
- sample size and fieldwork date.

Safeguard:

> Van Westendorp outputs describe stated price perception. The “Optimal Price Point” label must not be presented as the profit-maximizing business price.

### 7.2 Gabor–Granger

Use when the team has discrete candidate prices and needs a stated purchase-intent curve.

Required inputs:

- tested price points;
- purchase-intent response at each price;
- respondent segment;
- sample size;
- concept / product description shown to respondents.

Outputs:

- stated demand index by price;
- stated revenue index by price;
- stated gross-profit index after adding item cost;
- price points where purchase intent drops sharply;
- segment comparison.

Safeguard:

> Gabor–Granger provides stated willingness to buy. It should calibrate or challenge the commercial scenario, not replace observed elasticity from transactions or experiments.

### 7.3 Future method

Choice-based conjoint can be considered later for bundle, attribute, and multi-item substitution decisions. It is not required for the first MVP.

## 8. Baseline menu economics

### 8.1 Minimum item fields

| Field | Definition |
|---|---|
| Item ID / Item name | Stable menu-item identity |
| Category / subcategory | Product grouping |
| Menu role | Signature, traffic driver, profit builder, add-on, entry price, premium |
| Current list price | Customer-facing menu price |
| Net realized price | Net item sales divided by units after discounts, tax treatment, and channel adjustments |
| Unit variable cost | Food, packaging, and other included variable cost |
| Units | Number of item units sold |
| Transactions | Eligible transactions in the same scope and period |
| UPH | Units per hundred eligible transactions |
| Product mix | Item units divided by total menu units in scope |
| Net sales | Units × net realized price |
| Gross profit dollars | Units × (net realized price − unit variable cost) |
| Gross margin | Gross profit dollars ÷ net sales |

### 8.2 UPH definition

```text
UPH_i = Units_i / Eligible Transactions × 100
```

The denominator must be explicit. For example, all transactions, breakfast transactions, beverage transactions, or delivery orders produce different UPH values and must not be mixed.

## 9. Forecast engine

### 9.1 Price change

```text
Price Change %_i = Proposed Price_i / Current Price_i − 1
```

### 9.2 Own-price response

For small changes, a simple approximation may be shown:

```text
Expected Quantity Change %_i ≈ Own Elasticity_i × Price Change %_i
```

For the calculation engine, use a constant-elasticity form:

```text
Q1_i = Q0_i × (P1_i / P0_i) ^ Elasticity_i
```

The model must support a low, base, and high sensitivity estimate.

### 9.3 Cross-price response and cannibalization

“Cannibalization” is the product-to-product substitution effect. A price change on item `j` may alter demand for item `i`.

Where a cross-price elasticity matrix is available:

```text
ln(Q1_i / Q0_i)
  = OwnElasticity_i × ln(P1_i / P0_i)
  + Σ CrossElasticity_ij × ln(P1_j / P0_j)
```

Where the matrix is unavailable, the MVP may use a transparent substitution allocation:

- lost units from the changed item;
- percentage leaving the brand / category;
- percentage shifting to named substitute items;
- percentage shifting to complements or bundles;
- unallocated percentage displayed as an error.

The UI must never hide whether cannibalization came from observed data, a model, research, or an assumption.

### 9.4 Traffic and UPH

Item demand response and total transaction response must be separated.

```text
Forecast Transactions
  = Baseline Transactions × (1 + Assumed Traffic Change %)

Forecast UPH_i
  = Forecast Units_i / Forecast Transactions × 100
```

This prevents a price increase from being counted twice as both an item-demand decline and a transaction decline.

### 9.5 Product mix and economics

```text
Forecast Mix_i
  = Forecast Units_i / Σ Forecast Units

Forecast Net Sales_i
  = Forecast Units_i × Forecast Net Realized Price_i

Forecast Gross Profit Dollars_i
  = Forecast Units_i ×
    (Forecast Net Realized Price_i − Forecast Unit Variable Cost_i)

Forecast Gross Margin_i
  = Forecast Gross Profit Dollars_i / Forecast Net Sales_i
```

The summary must show:

- changed items;
- direct demand effect;
- substitution effect;
- traffic effect;
- mix effect;
- net sales effect;
- gross profit dollar effect;
- gross margin effect.

Gross profit dollars and gross margin must be shown together. A higher margin percentage with lower gross profit dollars is not automatically an improvement.

## 10. Value for Money and brand-risk assessment

There is no universal Value for Money index that the system can infer safely. The MVP will use a company-defined survey instrument and normalize its baseline to 100.

### 10.1 Minimum research measures

- “This item / meal is worth the price.”
- “The price is fair for the quality received.”
- “This brand still offers good value compared with alternatives.”
- “The new price is too expensive for regular purchase.”
- expected visit / purchase frequency;
- likelihood of switching to a lower-priced item or competitor;
- perceived quality / premium image;
- perceived affordability / accessibility.

### 10.2 Index treatment

```text
VFM Index_baseline = 100

VFM Index_scenario
  = 100 × Scenario Weighted Mean / Baseline Weighted Mean
```

Weights must be visible and agreed before viewing scenario results. The system must also show each component score so the composite cannot become a black box.

### 10.3 Brand-value risk

Brand risk is a separate assessment, not a financial adjustment factor.

Risk indicators:

- VFM index decline;
- increase in “too expensive” responses;
- price-fairness decline;
- loss of entry-price accessibility;
- negative effect on signature-item credibility;
- expected visit-frequency decline;
- high impact on a strategically important segment;
- large increase relative to close competitors.

Risk thresholds are project settings. The system may classify Low / Medium / High, but must show the triggered measures and threshold owner.

## 11. Pricing scenarios

Every project contains:

- **Baseline:** keep current prices;
- **Scenario A:** recommended price architecture;
- **Scenario B:** lower-risk / lower-increase alternative;
- **Scenario C:** higher-return or targeted alternative.

Each scenario must specify price changes at item level. It cannot be a narrative-only option.

### Comparison columns

- item and menu role;
- current and proposed price;
- price change percentage;
- PSM acceptable range position;
- stated purchase intent;
- own elasticity and evidence quality;
- forecast UPH;
- forecast units;
- forecast product mix;
- cannibalization / substitution movement;
- net sales;
- gross profit dollars;
- gross margin;
- VFM index;
- brand-risk flags.

### Mandatory downside case

The downside case applies the more negative end of the plausible elasticity, traffic, substitution, and VFM ranges. Approval cannot rely only on the base case.

## 12. Decision logic

The system does not produce a generic Pass / Revise / Escalate score. It produces a pricing recommendation with transparent reasons.

Possible recommendations:

- **Hold Current Price**
- **Approve Price Plan**
- **Pilot Before Rollout**
- **Revise Price Architecture**
- **Insufficient Evidence**

Example recommendation logic:

```text
IF required baseline, cost, price-response, or owner data is missing
THEN Insufficient Evidence

ELSE IF downside gross profit is negative
  OR VFM / brand-risk guardrail is materially breached
  OR substitution assumptions are too uncertain for a broad rollout
THEN Pilot Before Rollout or Revise Price Architecture

ELSE IF base and downside cases meet the agreed financial
  and consumer-value thresholds
THEN Approve Price Plan

ELSE Hold Current Price or Pilot Before Rollout
```

The user must see:

- recommendation;
- three to five reasons;
- largest forecast driver;
- largest uncertainty;
- affected customer segment;
- required decision;
- required pilot or mitigation.

## 13. User journey and information architecture

The MVP uses four primary work areas.

### 13.1 Pricing Projects

Purpose: identify which pricing decisions need work or approval.

Show:

- project name and scope;
- owner;
- stage;
- affected items;
- proposed effective date;
- expected gross profit change;
- VFM / brand-risk status;
- data-readiness status;
- next action.

Primary action: **Create Pricing Project**

### 13.2 Baseline & Research

Purpose: establish the trusted facts before scenario design.

Sections:

1. Project scope.
2. Baseline menu economics.
3. Price Sensitivity Study.
4. Elasticity and substitution evidence.
5. Data gaps and quality.

This is a working screen for Pricing, Finance, and Consumer Insight. It is not shown as a dense meeting screen.

### 13.3 Scenario Lab

Purpose: create and compare explicit price plans.

Layout:

- left: item list and item roles;
- center: editable baseline / A / B / C prices;
- right: scenario summary;
- expandable drawers: sensitivity curves, elasticity evidence, substitution map, calculation detail.

The default comparison emphasizes only:

- price change;
- UPH;
- units / mix;
- gross profit dollars;
- gross margin;
- VFM;
- brand risk.

### 13.4 Decision Brief & Review

The meeting screen is one focused decision brief, not a five-page general meeting presentation.

Above the fold:

- exact pricing decision requested;
- current recommendation;
- recommended scenario;
- gross profit uplift in base and downside cases;
- forecast UPH / traffic impact;
- VFM and brand-risk status;
- three reasons;
- largest uncertainty;
- actions: Hold, Approve Pilot, Approve Rollout, Revise.

On demand:

- item-level price table;
- Price Sensitivity Study curves;
- elasticity and substitution evidence;
- assumptions and formulas;
- guardrails.

After the decision, the same area becomes the review record:

- approved prices and scope;
- pilot stores / channels;
- KPI thresholds;
- review date;
- rollback rule;
- actual versus forecast;
- learning and evidence update.

## 14. MVP data model

```text
PricingDecisionProject
ProjectScope
MenuItem
BaselinePeriod
ItemBaselineMetric
PriceSensitivityStudy
PriceSensitivityResult
ElasticityEstimate
SubstitutionRelationship
PricingScenario
ScenarioItemPrice
ScenarioItemForecast
ScenarioSummary
ConsumerValueAssessment
PricingRecommendation
PricingDecisionRecord
PilotPlan
PricingReview
EvidenceSource
```

Existing reusable platform objects:

- repository abstraction;
- stable IDs;
- evidence quality;
- immutable evaluation snapshot;
- owner / reviewer;
- review date;
- action and audit record.

Objects no longer in the primary MVP journey:

- Constitution authoring;
- Constraint Library administration;
- generic Decision Card;
- generic meeting modes;
- generic scenario registry.

Pricing guardrails should initially be project/profile settings. The general governance engine may be reintroduced only after the pricing workflow proves repeated value.

## 15. Seed demo

### Project

**2026 Core Menu Price Review — Breakfast & Beverage**

### Scope

- one city;
- company-owned stores;
- dine-in and takeaway;
- eight menu items;
- 13-week baseline;
- price change effective next quarter.

### Candidate issue

Ingredient and labor cost increased, but the signature breakfast set and entry beverage protect value perception. The team must improve gross profit dollars without causing an unacceptable decline in UPH, visit intent, or entry-price accessibility.

### Scenarios

- **Baseline:** no price change.
- **Scenario A — Balanced:** targeted increases on less elastic premium items; protect the entry item.
- **Scenario B — Broad Increase:** similar percentage increase across most items.
- **Scenario C — Architecture Change:** raise à-la-carte prices, preserve bundle value, and adjust add-on pricing.

### Expected learning

The demo should make visible that the scenario with the highest gross margin percentage is not necessarily the scenario with the best gross profit dollars, customer value, or mix outcome.

## 16. Acceptance criteria

### Baseline and research

- User can import item-level baseline data.
- UPH denominator is explicit and consistent.
- Net realized price and variable cost definitions are visible.
- User can enter or import Van Westendorp and Gabor–Granger outputs.
- Survey-based price sensitivity is visibly distinct from observed elasticity.

### Scenario engine

- User can compare baseline and three item-level price scenarios.
- Forecast supports low / base / high elasticity.
- Forecast separates item response, cross-item substitution, and traffic.
- All substitution percentages reconcile or show an error.
- Forecast calculates UPH, units, mix, net sales, gross profit dollars, and gross margin.
- User can inspect formulas and source evidence.

### Decision

- One screen communicates the recommendation, financial impact, consumer risk, uncertainty, and action.
- Missing critical evidence blocks rollout approval.
- Final decision records scenario, scope, owner, rationale, review date, and rollback rule.
- Historical decision retains the exact assumptions and forecasts used.

### Review

- User can enter actual item prices, units, UPH, mix, gross profit, and VFM results.
- Actual-versus-forecast variance is visible by item and total.
- Review can update the evidence status of elasticity and substitution assumptions.

## 17. Implementation sequence

### Slice 1 — Trusted baseline

- Pricing Project list.
- New project flow.
- Seeded item master and baseline.
- Baseline economics table.
- UPH and gross-profit calculations.

### Slice 2 — Price sensitivity and elasticity

- Price Sensitivity Study input.
- Van Westendorp and Gabor–Granger result views.
- Elasticity evidence registry.
- Evidence-quality and uncertainty labels.

### Slice 3 — Scenario Lab

- Baseline plus three price scenarios.
- Own-price and substitution forecast.
- Product-mix and financial comparison.
- Downside case.

### Slice 4 — Decision and pilot review

- Focused meeting brief.
- Human decision record.
- Pilot plan and rollback rule.
- Actual-versus-forecast review.

## 18. Research basis and limitations

The product direction is supported by restaurant-pricing research showing that:

- price-sensitivity measurement can identify customer-perceived price ranges in restaurant settings;
- own- and cross-price elasticity are needed to account for menu-item substitution;
- survey methods and actual purchase behavior answer different questions;
- perceived value and price fairness should be monitored when prices change.

Key references:

1. Raab, C., Mayer, K., Kim, Y.-S., & Shoemaker, S. (2009). *Price-Sensitivity Measurement: A Tool for Restaurant Menu Pricing*. Journal of Hospitality & Tourism Research, 33(1), 93–105. https://doi.org/10.1177/1096348008329659
2. Kiefer, N. M., Kelly, T. J., & Burdett, K. (1994). *Menu Pricing: An Experimental Approach*. Journal of Business & Economic Statistics, 12(3), 329–337. https://doi.org/10.1080/07350015.1994.10524548
3. *Menu engineering re-engineered: Accounting for menu item substitutes in pricing and menu placement decisions* (2020). International Journal of Hospitality Management, 87, 102504. https://doi.org/10.1016/j.ijhm.2020.102504
4. Matzler, K., Würtele, A., & Renzl, B. (2006). *Dimensions of price satisfaction: A study in the retail banking industry*. International Journal of Bank Marketing, 24(4), 216–231. https://doi.org/10.1108/02652320610671324

Limitations:

- Price Sensitivity Study outputs are stated responses and may not equal behavior.
- Historical elasticity may be biased by promotions, seasonality, availability, menu placement, and concurrent marketing.
- Cross-item substitution requires enough item-level variation and should not be invented when evidence is weak.
- The first MVP supports decision transparency and scenario comparison; it does not claim to calculate a universally optimal price.

