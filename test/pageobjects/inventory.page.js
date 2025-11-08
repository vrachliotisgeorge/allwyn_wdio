/* eslint-disable no-undef */
const { $, $$, browser } = require('@wdio/globals')
const allure = require('@wdio/allure-reporter').default
const Page = require('./page')
const { pageLoadTimeout } = require('../config/allwyn.env.config')

class InventoryPage extends Page {

    get productHeader() { return $('#header_container .title') }
    get productItems() { return $$('.inventory_item') }
    get productNames() { return $$('.inventory_item_name') }
    get productDescriptions() { return $$('.inventory_item_desc') }
    get productPrices() { return $$('.inventory_item_price') }
    get productImages() { return $$('.inventory_item img') }
    get addToCartButtons() { return $$('.inventory_item button') }
    get cart() { return $('.shopping_cart_link') }
    get cartContainer() { return $('#shopping_cart_container') }
    get cartParent() { return $('.primary_header') }
    get cartBadge() { return $('.shopping_cart_badge') }
    get sortDropdown() { return $('.product_sort_container') }
    get burgerMenuButton() { return $('#react-burger-menu-btn') }
    get logoutLink() { return $('#logout_sidebar_link') }
    get allItemsLink() { return $('#inventory_sidebar_link') }
    get aboutLink() { return $('#about_sidebar_link') }
    get resetAppLink() { return $('#reset_sidebar_link') }
    get closeMenuButton() { return $('#react-burger-cross-btn') }

    async waitForPageToLoad() {
        allure.startStep('Wait for Inventory Page to fully load')
        const startTime = Date.now()
        await browser.waitUntil(
            async () => (await this.productHeader.isDisplayed()), {
                timeout: pageLoadTimeout,
                interval: 500,
                timeoutMsg: 'Inventory Page did not render in time'
            }
        )
        const duration = Date.now() - startTime
        allure.addStep(`Inventory Page Load Duration: ${duration} ms`)
        allure.endStep('passed')
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

    async getNumberOfProducts() {
        allure.addStep('Get total number of products displayed')
        const count = (this.productItems).length
        return count
    }

    async getVisibleProductNames() {
        allure.startStep('Get visible product names')
        const names = []
        const productNameElements = await $$('.inventory_item_name')
        for (const el of productNameElements) {
            if (await el.isDisplayed()) names.push(await el.getText())
        }
        allure.addAttachment('Visible products', JSON.stringify(names, null, 2), 'application/json')
        allure.endStep('passed')
        return names
    }

    async addProductToCartByIndex(index) {
        allure.startStep(`Add product at index ${index} to cart`)
        const buttons = this.addToCartButtons
        if (buttons[index]) {
            const buttonId = await buttons[index].getAttribute('id')
            if (!buttonId.startsWith('add-to-cart-')) {
                throw new Error(`Cannot add product: button id does not start with 'add-to-cart-': ${buttonId}`)
            }
            const name = await this.productNames[index].getText()
            await buttons[index].click()
            allure.addStep(`Added product ${name}`)
        } else {
            throw new Error(`No product found at index ${index}`)
        }
        allure.endStep('passed')
    }

    async removeProductFromCartByIndex(index) {
        allure.startStep(`Remove product at index ${index} from cart`)
        const buttons = this.addToCartButtons
        if (buttons[index]) {
            const buttonId = await buttons[index].getAttribute('id')
            if (!buttonId.startsWith('remove-')) {
                throw new Error(`Cannot remove product: button id does not start with 'remove-': ${buttonId}`)
            }
            const name = await this.productNames[index].getText()
            await buttons[index].click()
            allure.addStep(`Removed product ${name}`)
        } else {
            throw new Error(`No product found at index ${index}`)
        }
        allure.endStep('passed')
    }

    async getCartBadgeCount() {
        allure.startStep('Get number of items in the cart badge')
        let count = 0
        if (await this.cart.isExisting()) {
            count = parseInt(await this.cart.getText())
        }
        allure.addStep(`Cart count: ${count}`)
        allure.endStep('passed')
        return count
    }

    async sortProductsBy(optionText) {
        allure.startStep(`Sort products by option: ${optionText}`)
        const dropdown = this.sortDropdown
        await dropdown.selectByVisibleText(optionText)
        allure.endStep('passed')
    }

    async getProductPricesAsNumbers() {
        allure.startStep('Get product prices as numeric values')
        const prices = []
        const productPrices = await $$('.inventory_item_price')
        for (const el of productPrices) {
            const text = await el.getText()
            prices.push(parseFloat(text.replace('$', '')))
        }
        allure.addAttachment('Product prices', JSON.stringify(prices, null, 2), 'application/json')
        allure.endStep('passed')
        return prices
    }
}

module.exports = new InventoryPage()
