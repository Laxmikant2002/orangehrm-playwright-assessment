# OrangeHRM Playwright Assessment

Playwright + TypeScript tests for the [OrangeHRM demo](https://opensource-demo.orangehrmlive.com).

## Coverage

- **Part 1:** valid login, dashboard/PIM navigation, logout, invalid credentials, blank-field validation, direct protected-route access, and employee data rendering.
- **Part 2:** unknown employee search, reset after an empty search, and employee API failure handling.

The documented edge cases are automated in `tests/part1.spec.ts` and `tests/part2.spec.ts`. The suite does not mutate employee data, so it is safe to rerun. Session expiry and concurrent-search behavior remain documented limitations because the public demo does not provide a stable way to control or assert them.

## Structure

```text
config/environment.ts       demo/staging/local settings and environment overrides
pages/LoginPage.ts           authentication page object
pages/PimPage.ts             employee-list page object
tests/fixtures.ts            shared authenticated-page fixture
tests/part1.spec.ts          core functional tests and auth boundaries
tests/part2.spec.ts          search edge cases and network interception
playwright.config.ts         Chromium project, retries, reporter, and artifacts
```

Page objects keep actions and locators reusable. Tests use semantic locators and state-based assertions; there are no hard-coded waits.

## Setup and commands

Requirements: Node.js 18+ and npm.

```bash
npm ci
npx playwright install
npm test
```

Useful commands:

```bash
npm run test:chromium
npm run test:headed
npm run report
```

## Configuration

`TEST_ENV` supports `demo`, `staging`, and `local`. Override the selected values with `BASE_URL`, `ORANGEHRM_USERNAME`, and `ORANGEHRM_PASSWORD`.

```powershell
$env:TEST_ENV = "demo"
$env:BASE_URL = "https://opensource-demo.orangehrmlive.com"
$env:ORANGEHRM_USERNAME = "Admin"
$env:ORANGEHRM_PASSWORD = "admin123"
npm test
```

`fullyParallel` is enabled, but `workers: 1` is intentional for the shared public demo, which can race concurrent sessions. Assertions allow up to 15 seconds for remote API/grid rendering, and CI tests allow 60 seconds for remote startup/navigation. CI uses two retries; local runs do not retry. The HTML reporter is enabled, screenshots and videos are retained on failures, and traces are collected on the first retry. Chromium is the default project because the public demo is not consistently reliable in Firefox/WebKit.

The resilience test aborts `**/api/v2/pim/employees**` with `page.route()` and verifies that the PIM shell remains usable and the user stays on the employee list. The GitHub Actions workflow uploads the HTML report as an artifact.

## CI

The workflow in `.github/workflows/playwright.yml` runs `npm ci`, installs browsers, executes `npm test`, and uploads `playwright-report/`. It runs on pushes and pull requests targeting `main` or `master`.

## Known limitations

The test target is a shared external demo whose data and availability can change. Public demo credentials are used only as defaults and should be overridden for other environments. A public GitHub repository and commit history still need to be created before submission.
