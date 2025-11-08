/* eslint-disable no-undef */
const csvReader = require('../utils/csvReader')
const allure = require('@wdio/allure-reporter')
const testData = csvReader.readCSV('./test/testdata/checkout.step_one.csv')
const LoginPage = require('../pageobjects/login.page')
const InventoryPage = require('../pageobjects/inventory.page')
const InventoryPageValidator = require('../validations/inventory.page.validations')
const CartPage = require('../pageobjects/cart.page')
const CartPageValidator = require('../validations/cart.page.validations')
const CheckoutStepOnePage = require('../pageobjects/checkout.step_one.page')
const CheckoutStepOneValidator = require('../validations/checkout.step_one.page.validations')
const { baseUrl } = require('../config/allwyn.env.config')

for (const { description, severity, username, password, firstName, lastName, postalCode, expectedResult, expectedError } of testData) {

    describe('Checkout Step One Page Tests', () => {

        before(async () => {

            await browser.reloadSession()
            await LoginPage.open(baseUrl)
            await LoginPage.waitForPageToLoad()
            await LoginPage.login(username, password)
            await InventoryPage.waitForPageToLoad()

            const productCount = await InventoryPage.getNumberOfProducts()
            expect(productCount).toBeGreaterThan(3)
            
            allure.startStep('Add (3) Products to Cart')
            const productsToAdd = Math.min(3, productCount) 
            for (let i = 0; i < productsToAdd; i++) {					
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
            await CartPageValidator.verifyCartItemsCountEquals(3)
            await CartPageValidator.verifyAllCartItemsHaveRequiredDetails()
            allure.endStep('passed')				

            await CartPage.clickCheckout()
            await CartPageValidator.verifyOnCheckoutStepOnePage()
            await CheckoutStepOnePage.waitForPageToLoad()
        })

        it(description, async () => {

            allure.addFeature('Checkout Contact Information')
            allure.addSeverity(severity);
            allure.addDescription('Verify ' + description)            
            
            await CheckoutStepOnePage.fillCustomerInformation(firstName, lastName, postalCode)
            await CheckoutStepOnePage.continueToNextStep()
            if (expectedResult === 'success') {
                await CheckoutStepOneValidator.verifyOnCheckoutStepTwoPage()
            } else {
                await CheckoutStepOneValidator.verifyErrorMessageIsDisplayed()
                if (expectedError != '') {
                    await CheckoutStepOneValidator.verifyErrorMessageContainsText(expectedError)
                }                
            }

        })
                
    })    
}

