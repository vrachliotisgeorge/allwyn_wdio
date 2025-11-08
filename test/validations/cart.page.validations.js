/* eslint-disable no-undef */
const allure = require('@wdio/allure-reporter').default
const CartPage = require('../pageobjects/cart.page')

class CartPageValidations {

    async verifyCartIsDisplayed() {
        allure.startStep('Verify that Cart is displayed')
        await expect(CartPage.cart).toBeDisplayed()
        allure.addStep('Cart is displayed')
        allure.endStep('passed')        
    }

    async verifyCartBadgeIsDisplayed() {
        allure.startStep('Verify that Cart Badge is displayed')
        await expect(CartPage.cartBadge).toBeDisplayed()
        allure.addStep('Cart Badge is displayed')
        allure.endStep('passed')
    }

    async verifyCartBadgeIsNotDisplayed() {
        allure.startStep('Verify that Cart Badge is NOT displayed')
        await expect(CartPage.cartBadge).not.toBeDisplayed()
        allure.addStep('Cart Badge is not displayed')
        allure.endStep('passed')
    }

    async verifyCartContinueShoppingIsDisplayed() {
        allure.startStep('Verify that Cart Continue Shopping button is displayed')
        await expect(CartPage.continueShoppingButton).toBeDisplayed()
        allure.addStep('Cart Continue Shopping button is displayed')
        allure.endStep('passed')
    }

    async verifyCartCheckoutIsDisplayed() {
        allure.startStep('Verify that Cart Checkout button is displayed')
        await expect(CartPage.checkoutButton).toBeDisplayed()
        allure.addStep('Cart Checkout button is displayed')
        allure.endStep('passed')
    }

    async verifyCartItemsCountEquals(expectedCount) {
        allure.startStep(`Verify that the number of items in the cart equals ${expectedCount}`)
        const numItems = await CartPage.getNumberOfItems()
        allure.addStep(`Found ${numItems} items in the Cart`)
        expect(numItems).toEqual(expectedCount)
        allure.endStep('passed')
    }

    async verifyAllCartItemsHaveRequiredDetails() {

        allure.startStep('Verify that all cart items have the required details')

        allure.startStep('Get the number of items in the cart')
        const numItems = await CartPage.getNumberOfItems()
        allure.addStep(`Found ${numItems} items in the cart`)
        expect(numItems).toBeGreaterThan(0)
        allure.endStep('passed')

        const cartItems = await $$('.cart_item')
        for (let i = 0; i < cartItems.length; i++) {
            const item = cartItems[i]
            allure.startStep(`Validate cart item at index ${i}`)
            const qtyEl = await item.$('.cart_quantity')
            const titleEl = await item.$('.inventory_item_name')
            const descEl = await item.$('.inventory_item_desc')
            const priceEl = await item.$('.inventory_item_price')
            const removeButtonEl = await item.$('button.cart_button')
            const qtyText = await qtyEl.getText()
            const title = await titleEl.getText()
            const desc = await descEl.getText()
            const priceText = await priceEl.getText()
            const price = parseFloat(priceText.replace('$', ''))
            const removeButtonDisplayed = await removeButtonEl.isDisplayed()
            const details = { qtyText, title, desc, price, removeButtonDisplayed }
            allure.addAttachment(`Cart Item ${i}`, JSON.stringify(details, null, 2), 'application/json')
            await expect(qtyText).toBe('1')
            await expect(title).toBeTruthy()
            await expect(desc).toBeTruthy()
            await expect(price).toBeGreaterThan(0)
            await expect(removeButtonDisplayed).toBe(true)
            allure.endStep('passed')
        }
        allure.endStep('passed')
    }

    async verifyCartMatchesInventory(expectedProducts) {
        allure.startStep('Verify cart items match inventory items')
        const actualProducts = await CartPage.getAllCartItemsDetails()
        allure.addAttachment('Expected Products (from Inventory)', JSON.stringify(expectedProducts, null, 2), 'application/json')
        allure.addAttachment('Actual Products (from Cart)', JSON.stringify(actualProducts, null, 2), 'application/json')
        await expect(actualProducts.length).toBe(expectedProducts.length)
        for (let i = 0; i < expectedProducts.length; i++) {
            const expected = expectedProducts[i]
            const actual = actualProducts[i]
            allure.startStep(`Compare Product ${i}: ${expected.name}`)
            await expect(actual.name).toBe(expected.name)
            allure.addStep('Actual Name matches Expected Name')
            await expect(actual.price).toBe(expected.price)
            allure.addStep('Actual Price matches Expected Price')
            allure.endStep('passed')
        }
        allure.endStep('passed')
    }    

    async verifyCartUpdatesBadge(expectedCount) {
        allure.startStep(`Verify cart badge updates to ${expectedCount}`)
        const actualCount = await CartPage.getCartBadgeCount()
        expect(actualCount).toBe(expectedCount)
        allure.addStep(`Cart badge correctly updated to ${actualCount}`)
        allure.endStep('passed')
    }

    async verifyStillOnCartPage() {
        allure.startStep('Verify still on Cart page (checkout not possible)')
        const url = await browser.getUrl()
        allure.addAttachment('Current URL', url, 'text/plain')
        await expect(url).toContain('cart.html')
        allure.endStep('passed')
    }    

    async verifyOnCheckoutStepOnePage() {
        allure.startStep('Verify user proceeds to checkout')
        const url = await browser.getUrl()
        allure.addAttachment('Current URL', url, 'text/plain')
        await expect(url).toContain('checkout-step-one')
        allure.endStep('passed')
    }    

}

module.exports = new CartPageValidations()