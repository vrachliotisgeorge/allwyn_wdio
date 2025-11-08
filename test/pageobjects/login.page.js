const { $, browser } = require('@wdio/globals')
const allure = require('@wdio/allure-reporter').default
const Page = require('./page')
const { pageLoadTimeout } = require('../config/allwyn.env.config')

class LoginPage extends Page {

    get loginLogo() { return $('.login_logo') }
    get inputUsername() { return $('#user-name') }
    get inputPassword() { return $('#password') }
    get btnLogin() { return $('#login-button') }
    get errorMessage() { return $('h3[data-test="error"]') }

    open(pageUrl) {
        allure.addStep(`Open page: ${pageUrl}`)
        return super.open(pageUrl)
    }

    async waitForPageToLoad() {
        allure.startStep('Wait for Login Page to fully load')
        const startTime = Date.now()
        await browser.waitUntil(
            async () => (await this.loginLogo.isDisplayed()), {
                pageLoadTimeout,
                interval: 500,
                timeoutMsg: 'Login Page did not render in time'
            }
        )
        const duration = Date.now() - startTime
        allure.addStep(`Login Page Load Duration: ${duration} ms`)
        allure.endStep('passed')
    }

    async setUsername(username) {
        allure.addStep(`Set username to "${username}"`)
        await this.inputUsername.setValue(username)
    }

    async setPassword(password) {
        allure.addStep(`Set password to "${password}"`)
        await this.inputPassword.setValue(password)
    }

    async clickLogin() {
        allure.addStep('Click Login button')
        await this.btnLogin.click()
    }

    async login(username, password) {
        allure.startStep('Perform login')
        await this.setUsername(username)
        await this.setPassword(password)
        await this.clickLogin()
        allure.endStep('passed')
    }
}

module.exports = new LoginPage()