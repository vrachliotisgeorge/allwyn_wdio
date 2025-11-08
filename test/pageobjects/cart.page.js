const { $, $$, browser } = require('@wdio/globals')
const allure = require('@wdio/allure-reporter').default
const Page = require('./page')
const { pageLoadTimeout } = require('../config/allwyn.env.config')

class CartPage extends Page {

    get cart() { return $('.shopping_cart_link') }
    get cartBadge() { return $('.shopping_cart_badge') }
    get cartTitle() { return $('.title') }
    get cartItems() { return $$('.cart_item') }
    get itemNames() { return $$('.inventory_item_name') }
    get itemDescriptions() { return $$('.inventory_item_desc') }
    get itemPrices() { return $$('.inventory_item_price') }
    get continueShoppingButton() { return $('#continue-shopping') }
    get checkoutButton() { return $('#checkout') }

    async waitForPageToLoad() {
        allure.startStep('Wait for Cart Page to fully load')
        const startTime = Date.now()
        await browser.waitUntil(
            async () => (await this.cartTitle.isDisplayed()), {
                timeout: pageLoadTimeout,
                interval: 500,
                timeoutMsg: 'Cart Page did not render in time'
            }
        )
        const duration = Date.now() - startTime
        allure.addStep(`Cart Page Load Duration: ${duration} ms`)
        allure.endStep('passed')
    }

    async clickContinueShopping() {
        allure.startStep('Click Continue Shopping')
        await this.continueShoppingButton.click()
        allure.endStep('passed')
    }

    async clickCheckout() {
        allure.startStep('Click Checkout')
        await this.checkoutButton.click()
        allure.endStep('passed')
    }

    async removeItemByIndex(index) {
        allure.startStep(`Remove item at index ${index}`)
        const items = await this.cartItems
        const removeButton = await items[index].$('[id^="remove-"]')
        if (!await removeButton.isDisplayed()) {
            throw new Error(`Remove button not visible for item at index ${index}`)
        }
        await removeButton.click()
        allure.endStep('passed')
    }

    async getNumberOfItems() {
        const count = (await this.cartItems).length
        allure.addStep(`Cart has ${count} items`)
        return count
    }

    async getAllCartItemsDetails() {
        allure.startStep('Get details of all items in cart')
        const items = []
        const cartItems = await this.cartItems
        for (const item of cartItems) {
            const name = await item.$('.inventory_item_name').getText()
            const desc = await item.$('.inventory_item_desc').getText()
            const priceText = await item.$('.inventory_item_price').getText()
            const price = parseFloat(priceText.replace('$', ''))
            items.push({ name, desc, price })
        }
        allure.addAttachment('Cart items', JSON.stringify(items, null, 2), 'application/json')
        allure.endStep('passed')
        return items
    }

    async getCartBadgeCount() {
        allure.startStep('Get Cart Badge Count')
        let count = 0
        if (await this.cart.isExisting()) {
            count = parseInt(await this.cart.getText())
        }
        allure.addStep(`Cart Badge: ${count}`)
        allure.endStep('passed')
        return count
    }
}

module.exports = new CartPage()
