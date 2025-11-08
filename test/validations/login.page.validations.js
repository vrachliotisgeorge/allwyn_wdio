/* eslint-disable no-undef */
const allure = require('@wdio/allure-reporter').default
const LoginPage = require('../pageobjects/login.page')

class LoginPageValidations {

    async validateErrorMessageIsDisplayed() {
        allure.startStep('Validate that error message is displayed')
        await expect(LoginPage.errorMessage).toBeDisplayed()
        allure.addStep('Error message is displayed')
        allure.endStep('passed')
    }

    async validateErrorMessageContainsText(expectedText) {
        allure.startStep(`Validate that error message contains text "${expectedText}"`)
        const text = await LoginPage.errorMessage.getText()
        expect(text).toContain(
            expectedText,
            `Error message should contain text "${expectedText}", but got "${text}"`
        )
        allure.addStep(`Error message contains text "${expectedText}"`)
        allure.endStep('passed')
    }    
}

module.exports = new LoginPageValidations()