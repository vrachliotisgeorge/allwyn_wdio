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

    async sortProductsBy(optionText) {
        allure.startStep(`Sort products by option: ${optionText}`)
        const dropdown = this.sortDropdown
        await dropdown.selectByVisibleText(optionText)
        allure.endStep('passed')
    }

    async goToCart() {
        allure.startStep('Goto Cart page')
        await this.cart.click()
        allure.endStep('passed')
    }
    
    async getProductDetailsByIndex(index) {
        allure.startStep(`Get product details at index ${index}`)
        const products = await $$('.inventory_item')
        if (index < 0 || index >= products.length) {
            throw new Error(`Invalid product index: ${index}. Total products: ${products.length}`)
        }
        const product = products[index]
        const nameEl = await product.$('.inventory_item_name')
        const descEl = await product.$('.inventory_item_desc')
        const priceEl = await product.$('.inventory_item_price')
        const imageEl = await product.$('img.inventory_item_img')
        const buttonEl = await product.$('button')
        const name = await nameEl.getText()
        const description = await descEl.getText()
        const priceText = await priceEl.getText()
        const price = parseFloat(priceText.replace('$', ''))
        const imageSrc = await imageEl.getAttribute('src')
        const buttonText = await buttonEl.getText()
        const productDetails = {
            index,
            name,
            description,
            price,
            imageSrc,
            buttonText
        }
        allure.addAttachment(
            `Product ${index} details`,
            JSON.stringify(productDetails, null, 2),
            'application/json'
        )
        allure.endStep('passed')
        return productDetails
    }

}

module.exports = new InventoryPage()
