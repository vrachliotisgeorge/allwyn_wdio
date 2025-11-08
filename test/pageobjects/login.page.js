const { $, expect } = require('@wdio/globals');
const allure = require('@wdio/allure-reporter').default;
const Page = require('./page');

class LoginPage extends Page {

    get inputUsername() {
        return $('#user-name');
    }

    get inputPassword() {
        return $('#password');
    }

    get btnLogin() {
        return $('#login-button');
    }

    get errorMessage() {
        return $('h3[data-test="error"]');
    }

    open(pageUrl) {
        allure.addStep(`Open page: ${pageUrl}`);
        return super.open(pageUrl);
    }

    async setUsername(username) {
        allure.addStep(`Set username to "${username}"`);
        await this.inputUsername.setValue(username);
    }

    async setPassword(password) {
        allure.addStep(`Set password to "${password}"`);
        await this.inputPassword.setValue(password);
    }

    async clickLogin() {
        allure.addStep('Click Login button');
        await this.btnLogin.click();
    }

    async login(username, password) {
        allure.startStep('Perform login');
        await this.setUsername(username);
        await this.setPassword(password);
        await this.clickLogin();
        allure.endStep();
    }

    async expectErrorMessageToBeDisplayed() {
        allure.addStep('Verify error message is displayed');
        await expect(this.errorMessage).toBeDisplayed();
    }

    async expectErrorMessageToContain(expectedText) {
        allure.addStep(`Verify error message contains: "${expectedText}"`);
        const text = await this.errorMessage.getText();
        if (!text.includes(expectedText)) {
            throw new Error(`Error message should contain "${expectedText}", but got "${text}"`);
        }
    }
}

module.exports = new LoginPage();
