const { $, browser } = require('@wdio/globals')
const allure = require('@wdio/allure-reporter').default

module.exports = class Page {

    open(pageUrl) {
        return browser.url(pageUrl)
    }

    async openBurgerMenu() {
        allure.addStep('Open burger menu')
        const burgerMenuButton = await $('#react-burger-menu-btn')
        await burgerMenuButton.click()
        const menuSelector = $('.bm-menu-wrap')
        await browser.waitUntil(
            async () => {
                const hiddenAttr = await menuSelector.getAttribute('hidden')
                return hiddenAttr !== 'true' && hiddenAttr !== ''
            }, {
                timeout: 3000, 
                timeoutMsg: 'Burger menu did not open (hidden=true still present)'
            }
        )
        allure.addStep('Burger menu opened')
    }

    async closeBurgerMenu() {
        allure.addStep('Close burger menu');
        const burgerMenuCloseButton = await $('#react-burger-cross-btn')
        await burgerMenuCloseButton.click();
        const menuSelector = $('.bm-menu-wrap')
        await browser.waitUntil(
            async () => {
                const hiddenAttr = await menuSelector.getAttribute('hidden');
                return hiddenAttr === 'true';
            }, {
                timeout: 3000, 
                timeoutMsg: 'Burger menu did not close'
            }
        )
        allure.addStep('Burger menu closed')
    }

    async logout() {
        allure.startStep('Logout via burger menu')
        await this.openBurgerMenu()
        allure.addStep('Click Logout menu option')     
        const logoutLink = await $('#logout_sidebar_link')
        await logoutLink.click()
        allure.endStep('passed')
    }

}
