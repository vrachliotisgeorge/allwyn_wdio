# Allwyn WebDriverIO SauceDemo Automation Framework

## Overview

WebDriverIO automation framework designed to demonstrate a modular, maintainable UI
testing approach for the **SauceDemo** application.

The framework features:

-   Page Object Model
-   Dedicated validation layer
-   CSV-driven test data
-   Allure reporting with feature tagging
-   Clean separation of actions, validations, and test logic
-   Complete end-to-end purchase flow automation

Functional areas included:

1.  **Login**
2.  **Inventory**
3.  **Cart**
4.  **Checkout Step One**
5.  **Checkout Step Two**

------------------------------------------------------------------------

# ✅ Project Structure

    project/
    │   allwyn.wdio.conf.js
    │   package.json
    │   package-lock.json
    │
    ├── test
    │   ├── config/
    │   ├── pageobjects/
    │   ├── specs/
    │   ├── testdata/
    │   ├── utils/
    │   └── validations/

------------------------------------------------------------------------

# ✅ Installation & Test Execution

### Install dependencies

``` bash
npm install
```

### Run all tests

``` bash
npx wdio run allwyn.wdio.conf.js
```

### Generate Allure Report

``` bash
npx allure generate allure-results --clean -o allure-report
```

### View Allure Report

``` bash
npx allure open allure-report
```

------------------------------------------------------------------------

# ✅ Framework Architecture

### Page Objects

Encapsulate selectors, getters, setters and actions only --- no assertions.

### Validations

Contain all assertions for checks such as: 
- UI visibility
- Page transitions
- Content correctness
- Price and total calculations

### Specs

Orchestrate: 
- Test data (CSV files)
- Page object actions
- Validation methods
- Allure reporting

### CSV Test Data

Defines: 
- Login combinations
- Inventory users
- Cart scenarios
- Checkout field data
- Order completion data

------------------------------------------------------------------------

# ✅ Test Strategy (Per Functional Area)

Below is the functional testing strategy, separated by the application's
main user flow.

------------------------------------------------------------------------

# 1️⃣ Login Tests (`allwyn.login.spec.js`)

### Approach

-   Data-driven using `login.csv`\
-   Positive and negative cases

### Tests (one per CSV row)

-   **User Login**
    -   Success → validate inventory page
    -   Failure → validate error message and expected error text

------------------------------------------------------------------------

# 2️⃣ Inventory Tests (`allwyn.inventory.spec.js`)

### Approach

-   Run for each user in `inventory.csv`
-   Validate UI, sorting, and cart functionality

### Tests

-   UI integrity validation
-   Add / Remove cart actions
-   Sort by Name (A→Z)
-   Sort by Name (Z→A)
-   Sort by Price (low→high)
-   Sort by Price (high→low)

------------------------------------------------------------------------

# 3️⃣ Cart Tests (`allwyn.cart.spec.js`)

### Approach

-   Validate cart behavior with and without items
-   Confirm cart matches inventory selections

### Tests

-   Cannot checkout when cart is empty
-   Can checkout when cart contains items
-   Cart item count validation
-   Cart item details validation
-   Navigation to checkout step one page

------------------------------------------------------------------------

# 4️⃣ Checkout Step One Tests (`allwyn.checkout.step_one.spec.js`)

### Approach

-   Data-driven using `checkout.step_one.csv`
-   Positive and negative form submission tests

### Tests

-   **Checkout Contact Information**
    -   Success → proceed to checkout step two
    -   Failure → error shown + optional expected message

------------------------------------------------------------------------

# 5️⃣ Checkout Step Two Tests (`allwyn.checkout.step_two.spec.js`)

### Approach

-   Data-driven using `checkout.step_two.csv`
-   Validate order items details
-   Validate final order completion

### Tests

-   UI integrity validations
-   Validate order items against cart items
-   Validate item totals, tax, and grand total
-   Complete checkout successfully

------------------------------------------------------------------------

# ✅ Features

## 🎯 FEATURE: User Login

**Spec:** `allwyn.login.spec.js`\
- All login scenarios

------------------------------------------------------------------------

## 🎯 FEATURE: Inventory Page Integrity Check

**Spec:** `allwyn.inventory.spec.js`\
- Inventory UI and structure validation tests

------------------------------------------------------------------------

## 🎯 FEATURE: Inventory Page Cart

**Spec:** `allwyn.inventory.spec.js`\
- Cart icon behavior and badge assertions

------------------------------------------------------------------------

## 🎯 FEATURE: Inventory Page Sorting

**Spec:** `allwyn.inventory.spec.js`
- All sorting tests: 
    - Name A→Z
    - Name Z→A
    - Price low→high
    - Price high→low

------------------------------------------------------------------------

## 🎯 FEATURE: Cart Page Integrity Check

**Spec:** `allwyn.cart.spec.js`\
- Cart page basic integrity validation

------------------------------------------------------------------------

## 🎯 FEATURE: Cart Page Functionality

**Spec:** `allwyn.cart.spec.js`
- Empty cart scenario
- Add products and verify cart contents
- Checkout allowed with items
- Validate cart-to-checkout navigation

------------------------------------------------------------------------

## 🎯 FEATURE: Checkout Contact Information

**Spec:** `allwyn.checkout.step_one.spec.js`
- All contact info form tests, positive and negative

------------------------------------------------------------------------

## 🎯 FEATURE: Checkout Overview

**Spec:** `allwyn.checkout.step_two.spec.js`\
- UI integrity
- Order items validation
- Price summary validation
- Successful checkout completion

------------------------------------------------------------------------

# ✅ Framework Limitations

This project intentionally limits scope to **functional UI automation**.\
The following areas are **not covered** by design.

------------------------------------------------------------------------

## 🔸 1. Visual UI Layout & Element Offset Validation

Not included: 
- Pixel-perfect layout checks
- Element coordinate validation
- CSS visual regressions
- Responsive layout integrity

------------------------------------------------------------------------

## 🔸 2. Performance Testing for `performance_glitch_user`

Not included: 
- Timing metrics
- Slow-loading page detection
- UI responsiveness measurement

### ✅ Possible Future Enhancement

Soft failure mechanism could be added to log slow operations.

------------------------------------------------------------------------

## 🔸 3. No Cross-Browser Testing

Runs only in chrome.

### ✅ Possible Future Enhancement

Enable test execution in Firefox, Edge & Safari + multiple screen resolutions.

------------------------------------------------------------------------

## 🔸 4. Parallel Test Execution

Test are running sequentialy.

### ✅ Possible Future Enhancement

Enable parallel test execution after evaluating possible test interference and/or race conditions.

------------------------------------------------------------------------
