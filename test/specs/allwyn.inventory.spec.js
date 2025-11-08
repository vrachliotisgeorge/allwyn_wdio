/* eslint-disable no-undef */
const csvReader = require('../utils/csvReader')
const allure = require('@wdio/allure-reporter')
const testData = csvReader.readCSV('./test/testdata/inventory.csv')
const LoginPage = require('../pageobjects/login.page')
const InventoryPage = require('../pageobjects/inventory.page')
const InventoryPageValidator = require('../validations/inventory.page.validations')
const { baseUrl } = require('../config/allwyn.env.config')

for (const { username, password } of testData) {

	describe(`Inventory Page Tests for user: ${username}`, () => {

			before(async () => {
                await browser.reloadSession()
				await LoginPage.open(baseUrl)
				await LoginPage.waitForPageToLoad()
				await LoginPage.login(username, password)
				await InventoryPage.waitForPageToLoad()
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

    			await InventoryPageValidator.verifyProductsHaveRequiredDetails()
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

				allure.startStep('Get the number of visible products')
				const productCount = await InventoryPage.getNumberOfProducts()
				allure.addStep(`Found ${productCount} products on the Inventory page`)
				expect(productCount).toBeGreaterThan(0)
				allure.endStep('passed')
				
				for (let i = 0; i < productCount; i++) {
					allure.startStep(`Add product at index ${i}`)
					await InventoryPage.addProductToCartByIndex(i)
					const expectedCount = i + 1
					await InventoryPageValidator.verifyCartBadgeIsDisplayed()
					await InventoryPageValidator.verifyCartUpdatesBadge(expectedCount)
					allure.endStep('passed')
				}
			})

			it(`should decrease cart badge when removing products as user: ${username} `, async () => {

				allure.addFeature('Inventory Page Cart')
				allure.addSeverity('critical')
				allure.addDescription(`Verify that - when logged in as ${username} - removing products decreases the cart badge, and when 0, the badge disappears`)

				await InventoryPageValidator.verifyCartBadgeIsDisplayed()

				allure.startStep('Get the number of visible products')
				const productCount = await InventoryPage.getNumberOfProducts()
				allure.addStep(`Found ${productCount} products on the Inventory page`)
				expect(productCount).toBeGreaterThan(0)
				allure.endStep('passed')

				for (let i = 0; i < productCount; i++) {
					allure.startStep(`Remove product at index ${i}`)
					const currentBadge = await InventoryPage.getCartBadgeCount()
					await InventoryPage.removeProductFromCartByIndex(i)
					const expectedCount = currentBadge - 1
					if (expectedCount > 0) {
						await InventoryPageValidator.verifyCartBadgeIsDisplayed()
						await InventoryPageValidator.verifyCartUpdatesBadge(expectedCount)
					} else {
						await InventoryPageValidator.verifyCartBadgeIsNotDisplayed()
					}
					allure.endStep('passed')
				}
			})
			
			it(`should sort products by Name (A to Z) as user: ${username} `, async () => {

				allure.addFeature('Inventory Page Sorting')
				allure.addSeverity('critical')
				allure.addDescription(`Verify that - when logged in as ${username} - products are sorted correctly when selecting Name (A to Z)`)

				allure.startStep('Select "Name (A to Z)" in sort dropdown')
				await InventoryPage.sortProductsBy('Name (A to Z)')
				allure.endStep('passed')

				allure.startStep('Get visible product names after sorting')
				const productNames = await InventoryPage.getVisibleProductNames()
				allure.endStep('passed')

				allure.startStep('Verify that products are sorted by Name (A to Z)')
				const sortedNames = [...productNames].sort((a, b) => a.localeCompare(b))
				expect(productNames).toEqual(sortedNames)
				allure.addStep('Products are sorted by Name(A to Z)')
				allure.endStep('passed')
			})

			it(`should sort products by Name (Z to A) as user: ${username}`, async () => {

				allure.addFeature('Inventory Page Sorting')
				allure.addSeverity('critical')
				allure.addDescription(`Verify that - when logged in as ${username} - products are sorted correctly when selecting Name (Z to A)`)

				allure.startStep('Select "Name (Z to A)" in sort dropdown')
				await InventoryPage.sortProductsBy('Name (Z to A)')
				allure.endStep('passed')

				allure.startStep('Get visible product names after sorting')
				const productNames = await InventoryPage.getVisibleProductNames()
				allure.endStep('passed')

				allure.startStep('Verify that products are sorted by Name (Z to A)')
				const sortedNames = [...productNames].sort((b, a) => a.localeCompare(b))
				expect(productNames).toEqual(sortedNames)
				allure.addStep('Products are sorted by Name(Z to A')
				allure.endStep('passed')
			})

			it(`should sort products by Price (low to high) as user: ${username}`, async () => {

				allure.addFeature('Inventory Page Sorting')
				allure.addSeverity('critical')
				allure.addDescription(`Verify that - when logged in as ${username} - products are sorted correctly when selecting Price (low to high)`)

				allure.startStep('Select "Price (low to high)" in sort dropdown')
				await InventoryPage.sortProductsBy('Price (low to high)')
				allure.endStep('passed')

				allure.startStep('Get visible product prices after sorting')
				const prices = await InventoryPage.getProductPricesAsNumbers()
				allure.endStep('passed')

				allure.startStep('Verify that products are sorted by Price (low to high)')
				for (let i = 0; i < prices.length - 1; i++) {
					expect(prices[i+1]).toBeGreaterThanOrEqual(prices[i], `Sorting error: price at index ${i} (${prices[i]}) is greater than next price (${prices[i + 1]})`)
				}
				allure.addStep('Products are sorted Price (low to high)')
				allure.endStep('passed')
			})

			it(`should sort products by Price (high to low) as user: ${username}`, async () => {

				allure.addFeature('Inventory Page Sorting')
				allure.addSeverity('critical')
				allure.addDescription(`Verify that - when logged in as ${username} - products are sorted correctly when selecting Price (high to low)`)

				allure.startStep('Select "Price (high to low)" in sort dropdown')
				await InventoryPage.sortProductsBy('Price (high to low)')
				allure.endStep('passed')

				allure.startStep('Get visible product prices after sorting')
				const prices = await InventoryPage.getProductPricesAsNumbers()
				allure.endStep('passed')

				allure.startStep('Verify that products are sorted by Price (high to low)')
				for (let i = 0; i < prices.length - 1; i++) {
					expect(prices[i]).toBeGreaterThanOrEqual(prices[i + 1], `Sorting error: price at index ${i} (${prices[i]}) is lower than next price (${prices[i + 1]})`)
				}
				allure.addStep('Products are sorted Price (high to low)')
				allure.endStep('passed')
			})

			after(async () => {                
				await InventoryPage.logout()
				await LoginPage.waitForPageToLoad()
			})
		
	})
}
