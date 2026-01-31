# SauceDemo Automation Framework (Playwright + TypeScript)

## Installation & Setup

Clone the repository:

```
git clone https://github.com/DanailZahariev/saucedemo-pom-playwright.git
```

- Install project dependencies:

```
npm install
- ```

- Install Playwright browsers:

```
npx playwright install
- ```

## Tech Stack

- Language: TypeScript
- Framework: Playwright Test
- Design Pattern: Page Object Model (POM)
- Environment: Node.js

## Project Structure

```
saucedemo-ts-playwright/
├── page-objects/          # Page Object Model classes
│   ├── auth/              # Authentication pages (LoginPage)
│   ├── cart/              # Cart management pages (CartPage)
│   ├── checkout/          # Checkout process pages (CheckoutPage)
│   ├── inventory/         # Product catalog pages (InventoryPage)
│   ├── product/           # Individual product details (ProductDetailsPage)
│   └── pageManager.ts     # Centralized manager for initializing page objects
├── test-data/             # JSON files for data-driven testing
│   ├── products.json      # Product data (names, prices)
│   └── users.json         # User credentials (valid/invalid accounts)
├── tests/                 # Test specifications (.spec.ts files)
│   ├── cart.spec.ts       # Cart functionality tests
│   ├── checkout.spec.ts   # Checkout flow tests
│   ├── inventory.spec.ts  # Inventory/Catalog tests
│   └── login.spec.ts      # Authentication tests
├── playwright.config.ts   # Playwright configuration
└── package.json           # Project dependencies
```
## Running Tests

### Run all tests
- Executes all .spec.ts files in headless mode:
```
npx playwright test
```

### Run with UI Mode
Opens the interactive UI mode for debugging and time-travel execution:
```
npx playwright test --ui
```

### View HTML Report
Generates and opens a detailed HTML report after test execution:
```
npx playwright show-report
```

## Test Coverage
The framework covers core End-to-End user journeys using data from the test-data directory:

### 1. Authentication (login.spec.ts)
   Login with a valid user (standard_user).

Error validation for invalid credentials or locked-out users.

### 2. Inventory & Products (inventory.spec.ts)
   Sorting products (by name or price).

Viewing product details.

Adding products to the cart directly from the inventory list.

### 3. Cart Management (cart.spec.ts)
   Adding Items: Verifying the cart badge updates correctly.

Removing Items: removing items and validating the list count.

Price Consistency: Ensuring the price displayed in the inventory matches the price in the cart.

Navigation: Verifying that "Continue Shopping" preserves the cart state.

### 4. Checkout Flow (checkout.spec.ts)
   Filling out shipping information (First Name, Last Name, Zip Code).

Validating the Summary page before finishing.

Completing the order successfully.

## Key Highlights
- Page Manager Pattern: I implemented a PageManager class to handle the instantiation of page objects. This avoids cluttering tests with multiple new Page(...) calls.

### TypeScript
- const pm = new PageManager(page);
- await pm.onLoginPage().login(...);
- Data-Driven Testing: 
User credentials and product details are not hardcoded. They are imported from JSON files (users.json, products.json), making updates and maintenance much easier.


