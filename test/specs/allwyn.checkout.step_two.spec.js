/* eslint-disable no-undef */
const allure = require('@wdio/allure-reporter')
const csvReader = require('../utils/csvReader')
const TestData = csvReader.readCSV('./test/testdata/checkout.step_two.csv')
const BaseSpec = require('./base.spec')
const CartPage = require('../pageobjects/cart.page')
const CartPageValidator = require('../validations/cart.page.validations')
const CheckoutStepOnePage = require('../pageobjects/checkout.step_one.page')
const CheckoutStepTwoPage = require('../pageobjects/checkout.step_two.page')
const CheckoutStepTwoValidator = require('../validations/checkout.step_two.page.validations')


for (const { username, password, firstName, lastName, postalCode } of TestData) {

    describe(`Checkout Step Two Page Tests for user: ${username}`, () => {

        let cartItemsDetails

        beforeEach(async () => {
            await browser.reloadSession()
            await BaseSpec.navigateToInventoryPage(username, password)
            await BaseSpec.addProductsToCartAndVerify(3)
            cartItemsDetails = await CartPage.getAllCartItemsDetails()
            await CartPage.clickCheckout()            
            await CartPageValidator.verifyOnCheckoutStepOnePage()
            await CheckoutStepOnePage.waitForPageToLoad()
            await CheckoutStepOnePage.fillCustomerInformation(firstName, lastName, postalCode)
            await CheckoutStepOnePage.continueToNextStep()
            await CheckoutStepTwoPage.waitForPageToLoad()
        })

        it(`should display all expected elements on Checkout Step Two page for user: ${username}`, async () => {

            allure.addFeature('Checkout Overview')
            allure.addSeverity('critical')
            allure.addDescription('Verify that Checkout Step Two page displays all expected elements such as cart items, checkout summary, and action buttons')

            await CheckoutStepTwoValidator.verifyCheckoutStepTwoPageElements()
        })

        it(`should display all cart items correctly on Checkout Step Two page for user: ${username}`, async () => {

            allure.addFeature('Checkout Overview')
            allure.addSeverity('critical')
            allure.addDescription('Verify that items listed in Checkout Step Two match exactly the items added to the cart')

            await CheckoutStepTwoValidator.verifyCartItemsMatch(cartItemsDetails)
        })                

        it(`should correctly calculate total, tax, and overall total for user: ${username}`, async () => {

            allure.addFeature('Checkout Overview')
            allure.addSeverity('critical')
            allure.addDescription('Verify that items listed in Checkout Step Two match exactly the items added to the cart')

            await CheckoutStepTwoValidator.verifyTotalPriceCalculation(cartItemsDetails)
        })

        it(`should checkout is completed successfully for user: ${username}`, async () => {

            allure.addFeature('Checkout Overview')
            allure.addSeverity('critical')
            allure.addDescription('Verify that checkout is completed successfully')

            await CheckoutStepTwoPage.clickFinish()
            await CheckoutStepTwoValidator.verifyCheckoutCompleted()
        })                


    })    
}

