/* eslint-disable no-undef */
const allure = require('@wdio/allure-reporter')
const csvReader = require('../utils/csvReader')
const TestData = csvReader.readCSV('./test/testdata/inventory.csv')
const BaseSpec = require('./base.spec')
const LoginPage = require('../pageobjects/login.page')
const InventoryPage = require('../pageobjects/inventory.page')
const InventoryPageValidator = require('../validations/inventory.page.validations')

for (const { username, password } of TestData) {

	describe(`Inventory Page Tests for user: ${username}`, () => {

		before(async () => {
			await browser.reloadSession()
			await BaseSpec.navigateToInventoryPage(username, password)
		})
		
		it(`should display all expected elements on the Inventory page for user: ${username}`, async () => {

			allure.addFeature('Inventory Page Integrity Check')
			allure.addSeverity('critical');
			allure.addDescription(`Verify that - when logged in as ${username} - all expected elements on the Inventory page are displayed`)

			await InventoryPageValidator.verifyProductsCountGreaterThan(0)
			await InventoryPageValidator.verifyCartIsDisplayed()
			await InventoryPageValidator.verifyCartBadgeIsNotDisplayed()
			await InventoryPageValidator.verifySortDropdownIsDisplayed()                
			await InventoryPageValidator.verifyBurgerMenuOptions()                
		})

		it(`should verify the Inventory page layout integrity for user: ${username}`, async () => {

			allure.addFeature('Inventory Page Integrity Check')
			allure.addSeverity('critical')
			allure.addDescription(`Verify that - when logged in as ${username} - the page layout integrity is correct`)

			await InventoryPageValidator.verifyElementInsideParent('.primary_header', '#shopping_cart_container', 'Cart link');
		})
		
		it(`should verify that products display valid information for user: ${username} `, async () => {

			allure.addFeature('Inventory Page Integrity Check')
			allure.addSeverity('critical')
			allure.addDescription(`Verify that - when logged in as ${username} - all inventory products display complete and valid information`)

			await InventoryPageValidator.verifyAllProductsHaveRequiredDetails()
		})

		it(`should verify that products are unique for user: ${username} `, async () => {

			allure.addFeature('Inventory Page Integrity Check')
			allure.addSeverity('critical')
			allure.addDescription(`Verify that - when logged in as ${username} - all inventory products are unique ie. have unique image and title`)

			await InventoryPageValidator.verifyProductsAreUnique()
		})

		it(`should increase cart badge when adding products as user: ${username} `, async () => {

			allure.addFeature('Inventory Page Cart')
			allure.addSeverity('critical')
			allure.addDescription(`Verify that - when logged in as ${username} - adding products increases the cart badge`)

			await InventoryPageValidator.verifyCartBadgeIsNotDisplayed()

			const availableProductsCount = await BaseSpec.getInventoryProductsCount()
			await BaseSpec.addInventoryProductsToCart(availableProductsCount)	
		})

		it(`should decrease cart badge when removing products as user: ${username} `, async () => {

			allure.addFeature('Inventory Page Cart')
			allure.addSeverity('critical')
			allure.addDescription(`Verify that - when logged in as ${username} - removing products decreases the cart badge, and when 0, the badge disappears`)

			await InventoryPageValidator.verifyCartBadgeIsDisplayed()

			const productCount = await BaseSpec.getInventoryProductsCount()
			await BaseSpec.removeInventoryProductsFromCart(productCount)			
		})
		
		it(`should sort products by Name (A to Z) as user: ${username} `, async () => {

			allure.addFeature('Inventory Page Sorting')
			allure.addSeverity('critical')
			allure.addDescription(`Verify that - when logged in as ${username} - products are sorted correctly when selecting Name (A to Z)`)

			await BaseSpec.sortInventoryProductsBy('Name (A to Z)')
			const productNames = await BaseSpec.getAllInventoryProductNames()

			allure.startStep('Verify that products are sorted by Name (A to Z)')
			const sortedNames = [...productNames].sort((a, b) => a.localeCompare(b))
			expect(productNames).toEqual(sortedNames)
			allure.addStep('Products are sorted by Name (A to Z)')
			allure.endStep('passed')
		})

		it(`should sort products by Name (Z to A) as user: ${username}`, async () => {

			allure.addFeature('Inventory Page Sorting')
			allure.addSeverity('critical')
			allure.addDescription(`Verify that - when logged in as ${username} - products are sorted correctly when selecting Name (Z to A)`)

			await BaseSpec.sortInventoryProductsBy('Name (Z to A)')
			const productNames = await BaseSpec.getAllInventoryProductNames()

			allure.startStep('Verify that products are sorted by Name (Z to A)')
			const sortedNames = [...productNames].sort((b, a) => a.localeCompare(b))
			expect(productNames).toEqual(sortedNames)
			allure.addStep('Products are sorted by Name (Z to A')
			allure.endStep('passed')
		})

		it(`should sort products by Price (low to high) as user: ${username}`, async () => {

			allure.addFeature('Inventory Page Sorting')
			allure.addSeverity('critical')
			allure.addDescription(`Verify that - when logged in as ${username} - products are sorted correctly when selecting Price (low to high)`)

			await BaseSpec.sortInventoryProductsBy('Price (low to high)')
			const prices = await BaseSpec.getAllInventoryProductPrices()

			allure.startStep('Verify that products are sorted by Price (low to high)')
			for (let i = 0; i < prices.length - 1; i++) {
				expect(prices[i+1]).toBeGreaterThanOrEqual(prices[i], `Sorting error: price at index ${i} (${prices[i]}) is greater than next price (${prices[i + 1]})`)
			}
			allure.addStep('Products are sorted by Price (low to high)')
			allure.endStep('passed')
		})

		it(`should sort products by Price (high to low) as user: ${username}`, async () => {

			allure.addFeature('Inventory Page Sorting')
			allure.addSeverity('critical')
			allure.addDescription(`Verify that - when logged in as ${username} - products are sorted correctly when selecting Price (high to low)`)

			await BaseSpec.sortInventoryProductsBy('Price (high to low)')
			const prices = await BaseSpec.getAllInventoryProductPrices()

			allure.startStep('Verify that products are sorted by Price (high to low)')
			for (let i = 0; i < prices.length - 1; i++) {
				expect(prices[i]).toBeGreaterThanOrEqual(prices[i + 1], `Sorting error: price at index ${i} (${prices[i]}) is lower than next price (${prices[i + 1]})`)
			}
			allure.addStep('Products are sorted by Price (high to low)')
			allure.endStep('passed')
		})

		after(async () => {                
			await InventoryPage.logout()
			await LoginPage.waitForPageToLoad()
		})
		
	})
}
