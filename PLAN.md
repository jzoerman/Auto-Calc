# Auto Cost Calculator Implementation Plan

## Objective

Build a simple HTML, CSS, and JavaScript application that estimates the true cost of owning a vehicle over a chosen period, whether purchased with cash or financed. Use local storage for persistence and a CDN charting library for visualizations.

## Agreed scope

- U.S. dollars and U.S. purchase conventions, with editable sales tax and fees.
- Purchase, financing, depreciation, and estimated mileage over time.
- Editable annual depreciation rates and a manual resale-value override.
- Loan amortization, extra payments, early payoff, and equity calculations.
- Responsive modern design with optional dark mode.
- Saved scenarios and comparisons using local storage; no backend.

Running costs, opportunity cost, and lease comparisons are future additions.

## Inputs

### Purchase

- Vehicle purchase price.
- Sales tax rate and editable taxable amount to accommodate local rules.
- Purchase fees, with an indication of whether they are financed or paid upfront.
- Rebates, down payment, and cash or financed purchase selection.
- Trade-in value and outstanding trade-in loan balance, including negative equity.
- Ownership duration.

### Financing

- Annual percentage rate and loan term in months.
- Extra monthly principal payment.
- Optional one-time principal payments at selected months.
- Optional early payoff month.

### Depreciation and mileage

- Editable annual depreciation estimates, applied to the vehicle value rather than taxes and fees.
- Optional resale-value override at the end of ownership.
- Starting odometer reading and estimated annual mileage.
- Estimated odometer reading at each month and at the end of ownership.

Mileage provides context and cost-per-mile calculations. Users can adjust depreciation to reflect mileage; the first version will not assume a universal mileage-based value penalty.

## Calculations

- Total purchase cost and amount financed.
- Scheduled monthly payment and monthly amortization schedule.
- Principal paid, interest paid, and remaining balance at each month.
- Effects of extra payments and early payoff: interest savings and revised payoff date.
- Estimated vehicle value and equity over time.
- Point when estimated vehicle value exceeds the remaining loan balance.
- Net ownership cost at the selected ownership endpoint.
- Average ownership cost per month and per mile driven during ownership.

For a sale at the end of ownership, calculate net cost as cash paid out plus remaining loan payoff minus sale proceeds. Account explicitly for the owner's existing trade-in equity when comparing scenarios. Avoid double-counting depreciation, down payments, or financed purchase costs.

Use monthly mileage estimates derived from annual mileage. Treat zero miles driven as an unavailable cost-per-mile result. Document how annual depreciation is interpolated into monthly values and how a resale-value override affects the plotted estimate.

## Interface

- Clearly grouped purchase, financing, depreciation, and mileage inputs.
- Immediate recalculation when valid inputs change.
- Summary cards for monthly payment, total interest, remaining balance, resale value, equity, total ownership cost, and cost per mile.
- A prominent vehicle-value versus loan-balance chart, with estimated odometer mileage in tooltips and an indication of positive equity.
- Cumulative ownership cost and cost-breakdown charts.
- Expandable amortization table.
- Accessible controls, responsive layouts, and optional dark mode.
- Clear labels distinguishing entered amounts from estimates.

## Persistence and exports

- Automatically save current inputs locally.
- Save, rename, delete, and compare named scenarios.
- Compare vehicles, cash versus financing, down payments, loan terms, and extra-payment strategies.
- Reset to defaults.
- Export and import scenarios as JSON.
- Export amortization schedules as CSV.
- Validate imported and saved data and handle missing or outdated fields safely.

## Implementation sequence

1. Create the static application structure and define the input and scenario data models.
2. Implement and verify purchase totals, cash purchases, and loan amortization.
3. Add extra payments and early payoff calculations.
4. Add depreciation, resale overrides, mileage projections, equity, and ownership-cost calculations.
5. Build the responsive input interface and summary results.
6. Integrate the CDN charting library and amortization table.
7. Add local persistence, scenario comparisons, and exports.
8. Polish accessibility, mobile behavior, dark mode, and explanatory labels.
9. Complete calculation and browser verification.

## Verification

- Zero-interest loans and cash purchases.
- Zero down payment, fully paid purchases, and negative trade-in equity.
- Ownership periods shorter and longer than the loan term.
- Extra payments that reduce the final payment or immediately pay off the loan.
- Early payoff stopping subsequent loan payments and interest.
- Consistent totals without double-counting purchase costs or depreciation.
- Resale overrides, zero depreciation, and differing annual depreciation rates.
- Starting mileage, zero annual mileage, and fractional-year ownership periods.
- Currency rounding and clear treatment of invalid inputs.
- Saved-data restoration, scenario imports, keyboard navigation, and mobile layouts.

## Future additions

- Insurance, fuel or charging, maintenance, repairs, registration, and parking.
- Optional opportunity cost of cash and larger down payments, shown separately from spending.
- Sensitivity comparisons for resale value, mileage, and repair costs.
- Lease comparisons.
