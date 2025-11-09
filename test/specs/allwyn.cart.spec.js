/* eslint-disable no-undef */
const allure = require('@wdio/allure-reporter')
const csvReader = require('../utils/csvReader')
const TestData = csvReader.readCSV('./test/testdata/cart.csv')
const BaseSpec = require('./base.spec')
const LoginPage = require('../pageobjects/login.page')
const InventoryPage = require('../pageobjects/inventory.page')
const InventoryPageValidator = require('../validations/inventory.page.validations')
const CartPage = require('../pageobjects/cart.page')
const CartPageValidator = require('../validations/cart.page.validations')

for (const { username, password } of TestData) {

	describe(`Cart Page Tests for user: ${username}`, () => {

		beforeEach(async () => {
			await browser.reloadSession()
			await BaseSpec.navigateToInventoryPage(username, password)
		})
		
		it(`should display all expected elements on the Cart page for user: ${username}`, async () => {

			allure.addFeature('Cart Page Integrity Check')
			allure.addSeverity('critical');
			allure.addDescription(`Verify that - when logged in as ${username} - all expected elements on the Cart page are displayed`)

			await InventoryPage.clickCart()
			await CartPage.waitForPageToLoad()

			await CartPageValidator.verifyCartIsDisplayed()
			await CartPageValidator.verifyCartBadgeIsNotDisplayed()
			await CartPageValidator.verifyCartContinueShoppingIsDisplayed()
			await CartPageValidator.verifyCartCheckoutIsDisplayed()
		})

		it(`should add (3) products to cart and verify cart contents + items for user: ${username}`, async () => {

			allure.addFeature('Cart Page Functionality')
			allure.addSeverity('critical')
			allure.addDescription('Verify that items added from inventory appear correctly in the cart')

			await BaseSpec.addProductsToCartAndVerify(3)
		})

		it(`should add (3) products, then clear cart and verify badge + buttons for user: ${username}`, async () => {

			allure.addFeature('Cart Page Functionality')
			allure.addSeverity('critical')
			allure.addDescription('Verify that items added from inventory appear correctly in the cart')

			await BaseSpec.addProductsToCartAndVerify(3)
			await BaseSpec.clearCart()
			await CartPage.clickContinueShopping()
			await InventoryPage.waitForPageToLoad()
			await InventoryPageValidator.verifyAllProductsCanBeAddedToCart()
		})

		it(`should add (3) products, then remove them from inventory page and verify cart is empty for user: ${username}`, async () => {

			allure.addFeature('Cart Page Functionality')
			allure.addSeverity('critical')
			allure.addDescription('Verify that items added from inventory appear correctly in the cart')

			await BaseSpec.addProductsToCartAndVerify(3)
			await CartPage.clickContinueShopping()
			await InventoryPage.waitForPageToLoad()
			await BaseSpec.removeInventoryProductsFromCart(3)
			
			allure.startStep('Verify that Cart is empty')
			await InventoryPage.clickCart()
			await CartPage.waitForPageToLoad()
			await CartPageValidator.verifyCartItemsCountEquals(0)
			allure.endStep('passed')

			await CartPage.clickContinueShopping()
			await InventoryPage.waitForPageToLoad()
			await InventoryPageValidator.verifyAllProductsCanBeAddedToCart()
		})

		it(`should not allow checkout with an empty cart for user: ${username}`, async () => {

			allure.addFeature('Cart Page Functionality')
			allure.addSeverity('critical')
			allure.addDescription('Verify that checkout is not possible when the cart is empty')

			await InventoryPage.clickCart()
			await CartPage.waitForPageToLoad()

			await CartPageValidator.verifyCartItemsCountEquals(0)
			await CartPage.clickCheckout()
			await CartPageValidator.verifyStillOnCartPage()
		})

		it(`should allow checkout when cart contains items for user: ${username}`, async () => {

			allure.addFeature('Cart Page Functionality')
			allure.addSeverity('critical')
			allure.addDescription('Verify that items added from inventory appear correctly in the cart')

			await BaseSpec.addProductsToCartAndVerify(3)
			await CartPage.clickCheckout()
			await CartPageValidator.verifyOnCheckoutStepOnePage()				
		})

		afterEach(async () => {                
			await CartPage.logout()
			await LoginPage.waitForPageToLoad()
		})	

	})
}
