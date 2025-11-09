const { expect, browser } = require('@wdio/globals')
const allure = require('@wdio/allure-reporter')
const CheckoutStepTwoPage = require('../pageobjects/checkout.step_two.page')

class CheckoutStepTwoValidator {

    async verifyCheckoutStepTwoPageElements() {
        allure.startStep('Verify Checkout Step Two page elements')
        const items = await CheckoutStepTwoPage.getNumberOfCartItems()
        expect(items).toBeGreaterThan(0)
        await expect(await CheckoutStepTwoPage.summarySubtotal).toBeDisplayed()
        await expect(await CheckoutStepTwoPage.summaryTax).toBeDisplayed()
        await expect(await CheckoutStepTwoPage.summaryTotal).toBeDisplayed()
        await expect(await CheckoutStepTwoPage.finishButton).toBeDisplayed()
        await expect(await CheckoutStepTwoPage.cancelButton).toBeDisplayed()
        allure.addStep('All expected elements are displayed on Checkout Step Two page')
        allure.endStep('passed')
    }    

    async verifyCartItemsMatch(expectedCartItems) {
        allure.startStep('Verify that cart items in Checkout Step Two match cart items from Cart')
        const checkoutItems = await CheckoutStepTwoPage.getAllCartItemsDetails()
        expect(checkoutItems.length).toBe(expectedCartItems.length)
        for (let i = 0; i < checkoutItems.length; i++) {            
            const expected = expectedCartItems[i]
            const actual = checkoutItems[i]
            allure.startStep(`Verify cart item ${actual.name} at index ${i}`)
            await expect(actual.name).toBe(expected.name)
            allure.addStep('Cart Item name verified')
            await expect(actual.price).toBe(expected.price)
            allure.addStep('Cart Item price verified')
            allure.endStep('passed')
        }
        allure.endStep('passed')
    }

    async verifySummaryInformationIsDisplayed() {
        allure.startStep('Verify summary information is displayed')
        await expect(await CheckoutStepTwoPage.paymentInfoLabel).toBeDisplayed()
        await expect(await CheckoutStepTwoPage.shippingInfoLabel).toBeDisplayed()
        await expect(await CheckoutStepTwoPage.itemTotalLabel).toBeDisplayed()
        await expect(await CheckoutStepTwoPage.taxLabel).toBeDisplayed()
        await expect(await CheckoutStepTwoPage.totalLabel).toBeDisplayed()
        allure.endStep('passed')
    }

    async verifyTotalPriceCalculation(expectedCartItems) {
        allure.startStep('Verify that checkout total price is calculated correctly')
        const itemTotalText = await CheckoutStepTwoPage.summarySubtotal.getText()
        const taxText = await CheckoutStepTwoPage.summaryTax.getText()
        const totalText = await CheckoutStepTwoPage.summaryTotal.getText()
        const parsePrice = (text) => parseFloat(text.replace(/[^0-9.]/g, ''))
        const displayedItemTotal = parsePrice(itemTotalText)
        const displayedTax = parsePrice(taxText)
        const displayedTotal = parsePrice(totalText)
        const expectedItemTotal = expectedCartItems
            .map(p => parseFloat(p.price))
            .reduce((acc, val) => acc + val, 0)
        const expectedTotal = parseFloat((expectedItemTotal + displayedTax).toFixed(2))
        allure.addAttachment('Price details', JSON.stringify({
            expectedItemTotal,
            displayedItemTotal,
            displayedTax,
            displayedTotal,
            expectedTotal
        }, null, 2), 'application/json')
        expect(displayedItemTotal).toBeCloseTo(expectedItemTotal, 2)
        expect(displayedTotal).toBeCloseTo(expectedTotal, 2)
        allure.endStep('passed')
    }

    static async verifyActionButtonsAreDisplayed() {
        allure.startStep('Verify Finish and Cancel buttons are displayed')
        await expect(await CheckoutStepTwoPage.finishButton).toBeDisplayed()
        await expect(await CheckoutStepTwoPage.cancelButton).toBeDisplayed()
        allure.endStep('passed')
    }

    async verifyCheckoutCompleted() {
        allure.startStep('Verify that checkout has been completed')
        const url = await browser.getUrl()
        allure.addAttachment('Current URL', url, 'text/plain')
        await expect(url).toContain('checkout-complete')
        allure.endStep('passed')
    }        

}

module.exports = new CheckoutStepTwoValidator()
