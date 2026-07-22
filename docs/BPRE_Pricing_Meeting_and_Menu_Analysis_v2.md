# BPR&E Pricing Meeting Studio — Meeting Workflow & Menu Analysis v2

**Status:** Implemented product direction  
**Scope:** Chain restaurant existing-menu price adjustment and new-product pricing  
**Primary implementation:** Existing-menu price adjustment  

## 1. Product job

The MVP does not attempt to optimize every business decision. It prepares and
runs one professional pricing meeting:

> Decide which menu prices to change, why, by how much, with what expected
> demand and economic consequences, and under what pilot and rollback rules.

The product has two connected modes:

- **Preparation workspace:** analysts prepare time-sliced menu performance,
  price-response evidence, assumptions, and options.
- **Decision meeting brief:** management sees only the decision question,
  option comparison, critical trade-offs, recommendation, and action plan.

## 2. Two pricing decision templates

| Dimension | Existing menu price adjustment | New product pricing |
|---|---|---|
| Starting question | What problem should the price change solve? | What role should the new product play and what price architecture should it enter? |
| Demand evidence | Current UPH, ADQ, ADTC, historical price response | Analog items, concept research, willingness to pay, trial and repeat assumptions |
| Menu analysis | Current Product Mix and Menu Engineering Matrix | Target role and expected matrix position |
| Key risk | Traffic loss, adverse substitution, damaged value perception | Weak trial, wrong price ladder, cannibalization, low repeat |
| Main output | Keep / increase / decrease / restructure existing prices | Launch price, pilot range, ladder position, launch guardrails |
| Important limitation | Historical association may not be causal | The item has no observed own-price elasticity or historical UPH |

The system must never silently reuse the existing-menu template for a new
product.

## 3. Existing-menu price-adjustment meeting flow

### Step 1 — Decision Intent

The meeting owner selects one primary objective:

1. Margin recovery.
2. Gradual low-perception increase.
3. One-step price reset.
4. Value restoration through selective price decreases.
5. Price-architecture rebalance.

Required output:

- one decision question;
- pricing objective;
- protected customer-value anchors;
- economic target;
- risk appetite;
- pilot versus rollout preference.

### Step 2 — Menu Analysis

Required views:

- All Day Product Mix.
- Daypart Product Mix.
- Custom-period Product Mix when transaction timestamps are available.
- All Day Menu Engineering Matrix.
- Daypart Menu Engineering Matrix.
- Item movement between All Day and selected-daypart classifications.
- current price ladder, menu role, contribution margin, and value anchors.

The Menu Engineering Matrix is a Boston-style diagnostic using:

- popularity: UPH or category menu-mix share;
- profitability: contribution margin per unit.

Output categories:

- Star: high popularity, high contribution;
- Plowhorse: high popularity, lower contribution;
- Puzzle: lower popularity, high contribution;
- Dog: lower popularity, lower contribution.

The matrix is not a price recommendation. Before changing a Star, Plowhorse, or
Puzzle price, the team must review substitutes, complements, entry-price roles,
and Good Value for Money.

### Step 3 — Price Response

For each decision-relevant item, the preparation workspace can overlay:

- Price Sensitivity Study results;
- Gabor–Granger stated purchase intent;
- Good Value for Money demand-curve break point;
- historical actual price–UPH curve;
- modelled own-price response;
- pilot evidence.

Stated research and observed behavior remain separate. A survey curve cannot be
renamed “actual elasticity.”

Required output:

- acceptable stated price range;
- Good Value for Money jump or break point;
- tested candidate prices;
- observed or modelled response range;
- known substitutes and cannibalization assumptions;
- evidence quality and source.

### Step 4 — Options & Product Mix Simulation

Every meeting compares the current baseline with up to three explicit price
plans. Each option contains item-level proposed prices, not only a narrative.

Required option types depend on the objective. Typical examples:

- targeted gradual increase;
- one-step broad price reset;
- value-architecture restoration;
- premium/add-on funded value investment.

For each option, show:

- current and proposed price;
- price change;
- UPH before and after;
- ADQ before and after;
- ADTC before and after;
- Sales Mix before and after;
- item sales and total ADS;
- contribution margin per unit;
- GM dollars and GM%;
- incremental operating cost;
- EBITDA impact;
- VFM index and brand-risk status;
- item-to-item cannibalization assumption;
- Menu Engineering category before and after.

### Step 5 — Decision & Action Plan

Human decision options:

- hold current price;
- approve controlled pilot;
- approve rollout;
- revise price architecture;
- request more evidence.

Required commitment:

- approved option and item prices;
- market, channel, store, and timing scope;
- decision owner and execution owner;
- pilot design;
- KPI gates;
- review dates;
- stop / rollback rule;
- actual-versus-forecast review owner.

## 4. Standard operating metric definitions

```text
ADS  = Average Daily Sales
ADQ  = Average Daily Quantity sold
AC   = Average Check
ADTC = Average Daily Transaction Count

ADS = AC × ADTC

Single-store:
ADTC = Period Transaction Count ÷ Days in Period

Multi-store aggregate:
ADTC = Period Transaction Count ÷ Store Count ÷ Days in Period

UPH = Item Units Sold ÷ Total Eligible Transaction Count × 100

ADQ = UPH × ADTC ÷ 100

Item Sales = Forecast Units × Forecast Net Realized Price

Sales Mix = Item Sales ÷ Total Menu Sales

Gross Profit Dollars
  = Forecast Units × (Forecast Net Realized Price − Unit Variable Cost)

Gross Margin % = Gross Profit Dollars ÷ Item Sales

EBITDA Impact
  = Forecast Gross Profit − Baseline Gross Profit
  − Incremental Operating / Implementation Cost
```

The denominator, store grain, time window, channel, and included menu scope must
be visible. All Day and daypart metrics cannot be mixed without recalculation.

## 5. Professional Menu Analysis data requirements

Minimum POS fields:

- transaction ID;
- transaction timestamp;
- store ID;
- channel;
- item ID and item name;
- quantity;
- gross item sales;
- discount;
- net item sales;
- transaction net sales;
- tax treatment;
- promotion / offer ID;
- void / refund indicator.

Minimum finance and product fields:

- current list price;
- net realized price;
- unit food and packaging cost;
- menu category;
- strategic menu role;
- availability / stock-out;
- launch and discontinuation date.

Without a transaction timestamp, arbitrary daypart analysis cannot be produced
reliably. Without transaction ID, UPH, AC, and cannibalization cannot be
reconciled correctly.

## 6. Decision logic

The system does not select a price merely because GM% rises.

Recommended decision sequence:

1. Confirm the business objective and protected value anchors.
2. Diagnose menu role and current economic contribution.
3. Identify price-response break points and evidence gaps.
4. Test candidate prices using explicit ADTC, UPH, and substitution assumptions.
5. Compare GM dollars, GM%, and EBITDA together.
6. Reject options that damage protected traffic or value anchors beyond agreed
   thresholds.
7. Pilot when material demand assumptions are not observed.
8. Approve broad rollout only after evidence and downside gates are satisfied.

## 7. Research basis and limitation

Restaurant menu engineering commonly uses item popularity and contribution
margin, but research on menu substitutes shows that the traditional matrix is
not sufficient when price changes shift demand between items:

- Noone & Cachia (2020), *Menu engineering re-engineered: Accounting for menu
  item substitutes in pricing and menu placement decisions*:
  https://doi.org/10.1016/j.ijhm.2020.102504
- Raab et al. (2009), *Price-Sensitivity Measurement: A Tool for Restaurant Menu
  Pricing*: https://doi.org/10.1177/1096348008329659
- Kiefer, Kelly & Burdett (1994), *Menu Pricing: An Experimental Approach*:
  https://doi.org/10.1080/07350015.1994.10524548

The seeded curves, item forecasts, and option assumptions in the prototype are
illustrative. They demonstrate workflow and calculation behavior; they are not
client evidence or validated market forecasts.
