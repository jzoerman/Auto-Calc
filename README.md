# AutoCalc

A static vehicle ownership calculator for U.S. cash and financed purchases. Includes monthly amortization, early payoff and extra payments, depreciation, resale overrides, mileage projections, equity charts, saved comparisons, dark mode, and JSON/CSV exports.

## Run

From this directory, run:

```sh
npm start
```

Open http://localhost:8080. Python 3 is required for the development server. No npm dependencies or build step are required. Serve this directory with any static web server for deployment. Use a server rather than opening index.html directly because the JavaScript uses modules.

Charts load Chart.js 4.4.8 from jsDelivr; fonts load from Google Fonts. Calculations and tables remain available when these services cannot be reached. Scenarios stay in this browser's local storage; JSON exports provide a portable backup.

## Verify

```sh
npm test
```

## Calculation assumptions

- Loans use a fixed APR with monthly interest and end-of-month payments. Extra payments go toward principal; early payoff includes that month's interest.
- Ownership cost assumes sale and settlement of the remaining loan at the selected endpoint. It includes contributed trade-in equity and avoids counting depreciation twice.
- Depreciation compounds monthly from each year's entered percentage. The last percentage repeats for subsequent years. A resale override gradually adjusts the modeled curve to the selected endpoint.
- Annual mileage is distributed evenly across months. Cost per mile uses miles driven during ownership, excluding the starting odometer.
- Sales tax uses the editable taxable amount. The calculator does not infer state-specific tax treatment. Rebates reduce purchase cost; fees can be financed or paid upfront.
- Calculations retain full precision internally; displayed currency is rounded. Actual lenders may use different daily interest and rounding rules.
- Running costs and opportunity cost are outside the current scope.

See PLAN.md for the agreed scope and future additions.
