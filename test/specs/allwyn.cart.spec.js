/* eslint-disable no-undef */
const csvReader = require('../utils/csvReader')
const allure = require('@wdio/allure-reporter')
const testData = csvReader.readCSV('./test/testdata/cart.csv')
const LoginPage = require('../pageobjects/login.page')
const InventoryPage = require('../pageobjects/inventory.page')
const InventoryPageValidator = require('../validations/inventory.page.validations')
const CartPage = require('../pageobjects/cart.page')
const CartPageValidator = require('../validations/cart.page.validations')
const { baseUrl } = require('../config/allwyn.env.config')

for (const { username, password } of testData) {

	describe(`Cart Page Tests for user: ${username}`, () => {

		beforeEach(async () => {
			await browser.reloadSession()
			await LoginPage.open(baseUrl)
			await LoginPage.waitForPageToLoad()
			await LoginPage.login(username, password)
			await InventoryPage.waitForPageToLoad()
		})
		
		it(`should display all expected elements on the Cart page for user: ${username}`, async () => {

			allure.addFeature('Cart Page Integrity Check')
			allure.addSeverity('critical');
			allure.addDescription(`Verify that - when logged in as ${username} - all expected elements on the Cart page are displayed`)

			await InventoryPage.goToCart()
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

			const productCount = await InventoryPage.getNumberOfProducts()
			expect(productCount).toBeGreaterThan(3)
			
			allure.startStep('Add (3) Products to Cart')
			const productsToAdd = Math.min(3, productCount) 
			const addedProducts = []
			for (let i = 0; i < productsToAdd; i++) {					
				const productDetails = await InventoryPage.getProductDetailsByIndex(i)
				addedProducts.push(productDetails)					
				allure.startStep(`Add product at index ${i} to cart`)
				await InventoryPage.addProductToCartByIndex(i)
				const expectedCount = i + 1
				await InventoryPageValidator.verifyCartBadgeIsDisplayed()
				await InventoryPageValidator.verifyCartUpdatesBadge(expectedCount)
				allure.endStep('passed')
			}
			allure.endStep('passed')

			await InventoryPage.goToCart()
			await CartPage.waitForPageToLoad()

			allure.startStep('Verify Cart contents + items')
			await CartPageValidator.verifyCartItemsCountEquals(addedProducts.length)
			await CartPageValidator.verifyAllCartItemsHaveRequiredDetails()
			await CartPageValidator.verifyCartMatchesInventory(addedProducts)
			allure.endStep('passed')				
		})

		it(`should add (3) products, remove them one by one from cart and verify badge + buttons for user: ${username}`, async () => {

			allure.addFeature('Cart Page Functionality')
			allure.addSeverity('critical')
			allure.addDescription('Verify that items added from inventory appear correctly in the cart')

			const productCount = await InventoryPage.getNumberOfProducts()
			expect(productCount).toBeGreaterThan(3)
			
			allure.startStep('Add (3) Products to Cart')
			const productsToAdd = Math.min(3, productCount) 
			const addedProducts = []
			for (let i = 0; i < productsToAdd; i++) {					
				const productDetails = await InventoryPage.getProductDetailsByIndex(i)
				addedProducts.push(productDetails)					
				allure.startStep(`Add product at index ${i} to cart`)
				await InventoryPage.addProductToCartByIndex(i)
				const expectedCount = i + 1
				await InventoryPageValidator.verifyCartBadgeIsDisplayed()
				await InventoryPageValidator.verifyCartUpdatesBadge(expectedCount)
				allure.endStep('passed')
			}
			allure.endStep('passed')

			await InventoryPage.goToCart()
			await CartPage.waitForPageToLoad()

			allure.startStep('Verify Cart contents + items')
			await CartPageValidator.verifyCartItemsCountEquals(addedProducts.length)
			await CartPageValidator.verifyAllCartItemsHaveRequiredDetails()
			await CartPageValidator.verifyCartMatchesInventory(addedProducts)
			allure.endStep('passed')				

			allure.startStep('Remove All Products from Cart')
			let expectedCount = addedProducts.length
			for (let i = 0; i < addedProducts.length; i++) {
				await CartPage.removeItemByIndex(0)
				expectedCount--
				if (expectedCount > 0) {
					await CartPageValidator.verifyCartBadgeIsDisplayed()
					await CartPageValidator.verifyCartUpdatesBadge(expectedCount)
				} else {
					await CartPageValidator.verifyCartBadgeIsNotDisplayed()		
				}			
			}				
			await CartPageValidator.verifyCartItemsCountEquals(0)
			allure.endStep('passed')

			await CartPage.clickContinueShopping()
			await InventoryPage.waitForPageToLoad()
			await InventoryPageValidator.verifyAllProductsCanBeAddedToCart()
		})

		it(`should add (3) products, remove them from inventory and verify cart is empty for user: ${username}`, async () => {

			allure.addFeature('Cart Page Functionality')
			allure.addSeverity('critical')
			allure.addDescription('Verify that items added from inventory appear correctly in the cart')

			const productCount = await InventoryPage.getNumberOfProducts()
			expect(productCount).toBeGreaterThan(3)
			
			allure.startStep('Add (3) Products to Cart')
			const productsToAdd = Math.min(3, productCount) 
			const addedProducts = []
			for (let i = 0; i < productsToAdd; i++) {					
				const productDetails = await InventoryPage.getProductDetailsByIndex(i)
				addedProducts.push(productDetails)					
				allure.startStep(`Add product at index ${i} to cart`)
				await InventoryPage.addProductToCartByIndex(i)
				const expectedCount = i + 1
				await InventoryPageValidator.verifyCartBadgeIsDisplayed()
				await InventoryPageValidator.verifyCartUpdatesBadge(expectedCount)
				allure.endStep('passed')
			}
			allure.endStep('passed')

			await InventoryPage.goToCart()
			await CartPage.waitForPageToLoad()

			allure.startStep('Verify Cart contents + items')
			await CartPageValidator.verifyCartItemsCountEquals(addedProducts.length)
			await CartPageValidator.verifyAllCartItemsHaveRequiredDetails()
			await CartPageValidator.verifyCartMatchesInventory(addedProducts)
			allure.endStep('passed')				

			allure.startStep('Return to Inventory Page and remove Products from Cart')
			await CartPage.clickContinueShopping()
			await InventoryPage.waitForPageToLoad()
			let expectedCount = productsToAdd			
			for (let i = 0; i < productsToAdd; i++) {					
				allure.startStep(`Remove product at index ${i} from cart`)
				await InventoryPage.removeProductFromCartByIndex(i)
				expectedCount--					
				if (expectedCount > 0) {
					await InventoryPageValidator.verifyCartBadgeIsDisplayed()
					await InventoryPageValidator.verifyCartUpdatesBadge(expectedCount)
				} else {
					await InventoryPageValidator.verifyCartBadgeIsNotDisplayed()
				}					
				allure.endStep('passed')
			}
			allure.endStep('passed')

			allure.startStep('Verify that Cart is empty')
			await InventoryPage.goToCart()
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

			await InventoryPage.goToCart()
			await CartPage.waitForPageToLoad()

			await CartPageValidator.verifyCartItemsCountEquals(0)
			await CartPage.clickCheckout()
			await CartPageValidator.verifyStillOnCartPage()
		})

		it(`should allow checkout when cart contains items for user: ${username}`, async () => {

			allure.addFeature('Cart Page Functionality')
			allure.addSeverity('critical')
			allure.addDescription('Verify that items added from inventory appear correctly in the cart')

			const productCount = await InventoryPage.getNumberOfProducts()
			expect(productCount).toBeGreaterThan(3)
			
			allure.startStep('Add (3) Products to Cart')
			const productsToAdd = Math.min(3, productCount) 
			const addedProducts = []
			for (let i = 0; i < productsToAdd; i++) {					
				const productDetails = await InventoryPage.getProductDetailsByIndex(i)
				addedProducts.push(productDetails)					
				allure.startStep(`Add product at index ${i} to cart`)
				await InventoryPage.addProductToCartByIndex(i)
				const expectedCount = i + 1
				await InventoryPageValidator.verifyCartBadgeIsDisplayed()
				await InventoryPageValidator.verifyCartUpdatesBadge(expectedCount)
				allure.endStep('passed')
			}
			allure.endStep('passed')

			await InventoryPage.goToCart()
			await CartPage.waitForPageToLoad()

			allure.startStep('Verify Cart contents + items')
			await CartPageValidator.verifyCartItemsCountEquals(addedProducts.length)
			await CartPageValidator.verifyAllCartItemsHaveRequiredDetails()
			await CartPageValidator.verifyCartMatchesInventory(addedProducts)
			allure.endStep('passed')	
			
			await CartPage.clickCheckout()
			await CartPageValidator.verifyOnCheckoutPage()				
		})
		
		afterEach(async () => {                
			await CartPage.logout()
			await LoginPage.waitForPageToLoad()
		})	

	})
}
