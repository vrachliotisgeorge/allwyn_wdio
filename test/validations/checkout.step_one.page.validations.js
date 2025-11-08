/* eslint-disable no-undef */
const allure = require('@wdio/allure-reporter').default
const CheckoutStepOnePage = require('../pageobjects/checkout.step_one.page')

class CheckoutStepOneValidations {

    async verifyErrorMessageIsDisplayed() {
        allure.startStep('Verify that error message is displayed')
        await expect(CheckoutStepOnePage.errorMessage).toBeDisplayed()
        allure.addStep('Error message is displayed')
        allure.endStep('passed')
    }

    async verifyErrorMessageContainsText(expectedText) {
        allure.startStep(`Verify that error message contains text "${expectedText}"`)
        const text = await CheckoutStepOnePage.errorMessage.getText()
        expect(text).toContain(
            expectedText,
            `Error message should contain text "${expectedText}", but got "${text}"`
        )
        allure.addStep(`Error message contains text "${expectedText}"`)
        allure.endStep('passed')
    } 
    
    async verifyOnCheckoutStepTwoPage() {
        allure.startStep('Verify user proceeds to checkout')
        const url = await browser.getUrl()
        allure.addAttachment('Current URL', url, 'text/plain')
        await expect(url).toContain('checkout-step-two')
        allure.endStep('passed')
    }        
}

module.exports = new CheckoutStepOneValidations()