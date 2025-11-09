/* eslint-disable no-undef */
const allure = require('@wdio/allure-reporter')
const csvReader = require('../utils/csvReader')
const TestData = csvReader.readCSV('./test/testdata/checkout.step_one.csv')
const BaseSpec = require('./base.spec')
const CartPage = require('../pageobjects/cart.page')
const CartPageValidator = require('../validations/cart.page.validations')
const CheckoutStepOnePage = require('../pageobjects/checkout.step_one.page')
const CheckoutStepOneValidator = require('../validations/checkout.step_one.page.validations')

for (const { description, severity, username, password, firstName, lastName, postalCode, expectedResult, expectedError } of TestData) {

    describe('Checkout Step One Page Tests', () => {

        before(async () => {
            await browser.reloadSession()
            await BaseSpec.navigateToInventoryPage(username, password)
            await BaseSpec.addProductsToCartAndVerify(3)
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

