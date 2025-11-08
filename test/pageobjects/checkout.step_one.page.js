/* eslint-disable no-undef */
const { $ } = require('@wdio/globals')
const allure = require('@wdio/allure-reporter').default
const Page = require('./page')
const { pageLoadTimeout } = require('../config/allwyn.env.config')

class CheckoutStepOnePage extends Page {

    get title() { return $('.title') }
    get inputFirstName() { return $('#first-name') }
    get inputLastName() { return $('#last-name') }
    get inputPostalCode() { return $('#postal-code') }
    get cancelButton() { return $('#cancel') }
    get continueButton() { return $('#continue') }
    get errorMessage() { return $('[data-test="error"]') }

    async waitForPageToLoad() {
        allure.startStep('Wait for Checkout Step One Page to fully load')
        const startTime = Date.now()
        await browser.waitUntil(
            async () => (await this.inputFirstName.isDisplayed()), {
                pageLoadTimeout,
                interval: 500,
                timeoutMsg: 'Checkout Step One Page did not render in time'
            }
        )
        const duration = Date.now() - startTime
        allure.addStep(`Checkout Step One Page Load Duration: ${duration} ms`)
        allure.endStep('passed')
    }

    async setFirstName(firstName) {
        allure.addStep(`Set first name to "${firstName}"`)
        await this.inputFirstName.setValue(firstName)
    }

    async setLastName(lastName) {
        allure.addStep(`Set last name to "${lastName}"`)
        await this.inputLastName.setValue(lastName)
    }

    async setPostalCode(postalCode) {
        allure.addStep(`Set postal code to "${postalCode}"`)
        await this.inputPostalCode.setValue(postalCode)
    }

    async fillCustomerInformation(firstName, lastName, postalCode) {
        allure.startStep('Fill checkout customer information')
        await this.setFirstName(firstName)
        await this.setLastName(lastName)
        await this.setPostalCode(postalCode)
        allure.endStep('passed')
    }

    async continueToNextStep() {
        allure.startStep('Click Continue button')
        await this.continueButton.click()
        allure.endStep('passed')
    }

    async cancelCheckout() {
        allure.startStep('Click Cancel button')
        await this.cancelButton.click()
        allure.endStep('passed')
    }

}

module.exports = new CheckoutStepOnePage()
