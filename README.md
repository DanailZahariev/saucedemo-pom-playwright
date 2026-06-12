# SauceDemo Automation Framework (Playwright + TypeScript)

## Installation & Setup

- Clone the repository:
  ```bash
  git clone https://github.com/DanailZahariev/saucedemo-pom-playwright.git
  ```

- Install project dependencies (including Allure CLI):
  ```bash
  npm install
  ```

- Install Playwright browsers:
  ```bash
  npx playwright install
  ```

## Tech Stack

- Language: TypeScript
- Framework: Playwright Test
- Design Pattern: Page Object Model (POM) + Playwright Fixtures
- Reporting: Allure Report & Playwright HTML
- Environment: Node.js

## 📂 Project Structure

The project follows the **Page Object Model (POM)** design pattern, optimized with **Playwright Fixtures** for
Dependency Injection, and a dedicated **Data Layer** for type safety.

```text
.
├── fixtures/                     # Playwright Fixtures for Dependency Injection
│   └── fixtures.ts               # Custom test object extending base pages
├── page-objects/                 # Page Object Model (POM) Implementation
│   ├── auth/                     # Login & Authentication pages
│   ├── base/                     # BasePage with common wrapper methods (SOLID)
│   ├── cart/                     # Cart functionality and logic
│   ├── checkout/                 # Checkout process steps
│   ├── inventory/                # Inventory list and product filtering
│   ├── product/                  # Product details page logic
│   └── pageManager.ts            # ⚡ Manager for Lazy Loading of page objects
│
├── test-data/                    # Data Layer (Type-Safe)
│   ├── enums/                    # TypeScript Enums (e.g., SortOption)
│   ├── models/                   # Interfaces for Users and Products
│   ├── products.json             # Raw product data (JSON)
│   ├── users.json                # Raw user data (JSON)
│   └── testData.ts               # Centralized, typed data export
│
├── tests/                        # Test Specifications (*.spec.ts)
├── playwright-report/            # Test execution reports (HTML)
├── playwright.config.ts          # Playwright Configuration
└── package.json                  # Dependencies and Scripts
```

## Running Tests & Reporting

We use NPM scripts to simplify test execution and report generation.

### Run tests

Execute all `.spec.ts` files in headless mode (this automatically generates raw Allure results):

```bash
npm run test
```

*(Optional)* Run with UI Mode for debugging and time-travel execution:
```bash
npx playwright test --ui
```

### 📊 Allure Reporting (Industry Standard)

This framework is configured with **Allure Reports** for rich, interactive test results.

1. **Clear old results** (recommended before a new run):
   ```bash
   npm run allure:clear
   ```
2. **Generate the HTML report** from raw results:
   ```bash
   npm run allure:generate
   ```
3. **Open and view the report** in your browser:
   ```bash
   npm run allure:open
   ```

## Test Coverage

The framework covers core End-to-End user journeys using data from the test-data directory:

### 1. Authentication (login.spec.ts)

- Login with a valid user (standard_user).
- Error validation for invalid credentials or locked-out users.

### 2. Inventory & Products (inventory.spec.ts)

- Sorting products (by name or price).
- Viewing product details.
- Adding products to the cart directly from the inventory list.

### 3. Cart Management (cart.spec.ts)

- Adding Items: Verifying the cart badge updates correctly.
- Removing Items: Removing items and validating the list count.
- Price Consistency: Ensuring the price displayed in the inventory matches the price in the cart.
- Navigation: Verifying that "Continue Shopping" preserves the cart state.

### 4. Checkout Flow (checkout.spec.ts)

- Filling out shipping information (First Name, Last Name, Zip Code).
- Validating the Summary page before finishing.
- Completing the order successfully.

## Key Highlights

- **Playwright Fixtures (Dependency Injection):** Instead of using a bulky `PageManager` or instantiating page objects
  manually in every test, the framework uses Playwright's `fixtures`. This ensures true lazy-loading, automatic
  setup/teardown, and keeps test specifications highly declarative and readable.
  ```typescript
  // Example: Injecting exactly the pages needed for the test
  test('Add item to cart', async ({ loginPage, inventoryPage }) => {
  await loginPage.goto();
  // ...
  });
  ```
- **Accessibility-First Locators:** The framework prioritizes user-facing locators (`getByRole`, `getByText`,
  `getByPlaceholder`) and `data-test` attributes over brittle CSS selectors, ensuring robust and standard-compliant
  automation.
- **Data-Driven Testing:** User credentials and product details are not hardcoded. They are imported from JSON files (
  `users.json`, `products.json`), making updates and maintenance much easier.

## CI/CD Pipeline (GitHub Actions)

This project includes a GitHub Actions workflow to automatically run tests on every push or pull request to the `main`
or `master` branches.

The workflow is defined in `.github/workflows/playwright.yml` and performs the following steps:

1. Sets up a Linux environment (Ubuntu).
2. Installs Node.js and dependencies.
3. Installs Playwright browsers.
4. Executes the tests.
5. Uploads the HTML report as an artifact (retained for 30 days).