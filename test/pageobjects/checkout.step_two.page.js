/* eslint-disable no-undef */
const { $ } = require('@wdio/globals')
const allure = require('@wdio/allure-reporter').default
const Page = require('./page')

class CheckoutStepTwoPage extends Page {

    get title() { return $('.title') }
    get cartItems() { return $$('.cart_item') }
    get itemNames() { return $$('.inventory_item_name') }
    get itemDescriptions() { return $$('.inventory_item_desc') }
    get itemPrices() { return $$('.inventory_item_price') }
    get summarySubtotal() { return $('.summary_subtotal_label') }
    get summaryTax() { return $('.summary_tax_label') }
    get summaryTotal() { return $('.summary_total_label') }
    get finishButton() { return $('#finish') }
    get cancelButton() { return $('#cancel') }

    async waitForPageToLoad() {
        allure.startStep('Wait for Checkout Step Two page to load')
        await browser.waitUntil(
            async () => await this.title.isDisplayed(),
            {
                timeout: 5000,
                interval: 500,
                timeoutMsg: 'Checkout Step Two page did not load within 5s'
            }
        )
        allure.addStep('Checkout Step Two page loaded')
        allure.endStep('passed')
    }

    async getNumberOfCartItems() {
        allure.startStep('Get number of cart items')
        const count = (await this.cartItems).length
        allure.addAttachment('Cart items count', `${count}`, 'text/plain')
        allure.endStep('passed')
        return count
    }

    async getAllCartItemsDetails() {
        allure.startStep('Get details of all cart items')
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

    async getOrderSummary() {
        allure.startStep('Get order summary information')
        const subtotal = await this.summarySubtotal.getText()
        const tax = await this.summaryTax.getText()
        const total = await this.summaryTotal.getText()
        const summary = { subtotal, tax, total }
        allure.addAttachment('Order Summary', JSON.stringify(summary, null, 2), 'application/json')
        allure.endStep('passed')
        return summary
    }

    async clickFinish() {
        allure.startStep('Click Finish button')
        await this.finishButton.click()
        allure.endStep('passed')
    }

    async clickCancel() {
        allure.startStep('Click Cancel button')
        await this.cancelButton.click()
        allure.endStep('passed')
    }
}

module.exports = new CheckoutStepTwoPage()
