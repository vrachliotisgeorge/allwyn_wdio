/* eslint-disable no-undef */
const allure = require('@wdio/allure-reporter')
const { browser } = require('@wdio/globals')
const { baseUrl } = require('../config/allwyn.env.config')
const LoginPage = require('../pageobjects/login.page')
const LoginPageValidator = require('../validations/login.page.validations')
const InventoryPage = require('../pageobjects/inventory.page')
const InventoryPageValidator = require('../validations/inventory.page.validations')
const CartPage = require('../pageobjects/cart.page')
const CartPageValidator = require('../validations/cart.page.validations')

class BaseSpec {

    async loginUser(username, password) {
        await LoginPage.open(baseUrl)
        await LoginPage.waitForPageToLoad()
        await LoginPage.login(username, password)
    }

    async navigateToInventoryPage(username, password) {
        await LoginPage.open(baseUrl)
        await LoginPage.waitForPageToLoad()
        await LoginPage.login(username, password)
        await InventoryPage.waitForPageToLoad()        
    }

    async getInventoryProductsCount() {
        allure.startStep('Get the number of inventory products')
        const productCount = await InventoryPage.getNumberOfProducts()
        allure.addStep(`Found ${productCount} products in the inventory`)
        expect(productCount).toBeGreaterThan(0)
        allure.endStep('passed')
        return productCount
    }

    async addInventoryProductsToCart(productsToAddCount) {
        allure.startStep(`Add (${productsToAddCount}) inventory products to Cart`)
        const availableProductsCount = await InventoryPage.getNumberOfProducts()
        expect(availableProductsCount).toBeGreaterThanOrEqual(productsToAddCount)
        for (let i = 0; i < productsToAddCount; i++) {
            allure.startStep(`Add product at index ${i}`)
            await InventoryPage.addProductToCartByIndex(i)
            const expectedCount = i + 1
            await InventoryPageValidator.verifyCartBadgeIsDisplayed()
            await InventoryPageValidator.verifyCartUpdatesBadge(expectedCount)
            allure.endStep('passed')
        }
        allure.endStep('passed')
    }

    async removeInventoryProductsFromCart(productsToRemoveCount) {
        allure.startStep(`Remove (${productsToRemoveCount}) inventory products from Cart`)
        for (let i = 0; i < productsToRemoveCount; i++) {
            allure.startStep(`Remove product at index ${i}`)
            const currentBadge = await InventoryPage.getCartBadgeCount()
            await InventoryPage.removeProductFromCartByIndex(i)
            const expectedCount = currentBadge - 1
            if (expectedCount > 0) {
                await InventoryPageValidator.verifyCartBadgeIsDisplayed()
                await InventoryPageValidator.verifyCartUpdatesBadge(expectedCount)
            } else {
                await InventoryPageValidator.verifyCartBadgeIsNotDisplayed()
            }
            allure.endStep('passed')
        }
        allure.endStep('passed')
    }

    async sortInventoryProductsBy(sortOption) {
        allure.startStep(`Select "${sortOption}" in sort dropdown`)
        await InventoryPage.sortProductsBy(sortOption)
        allure.endStep('passed')
    }

    async getAllInventoryProductNames() {
        allure.startStep('Get all Inventory product names')
        const productNames = await InventoryPage.getProductsNames()
        allure.endStep('passed')
        return productNames
    }

    async getAllInventoryProductPrices() {
        allure.startStep('Get all Inventory product prices')
        const prices = await InventoryPage.getProductPricesAsNumbers()
        allure.endStep('passed')
        return prices
    }

    async getInventoryProductsDetails(productCount) {
        allure.startStep(`Get details for (${productCount}) inventory products`)
        const productsDetails = []
        for (let i = 0; i < productCount; i++) {					
            const productDetails = await InventoryPage.getProductDetailsByIndex(i)
            productsDetails.push(productDetails)					
        }
        allure.endStep('passed')
        return productsDetails
    }

    async clearCart() {
        allure.startStep('Remove All Products from Cart')
        const cartItemsCount = await CartPage.getNumberOfItems()
        let expectedCount = cartItemsCount
        for (let i = 0; i < cartItemsCount; i++) {
            await CartPage.removeItemByIndex(0)
            expectedCount--
            if (expectedCount > 0) {
                await CartPageValidator.verifyCartBadgeIsDisplayed()
                await CartPageValidator.verifyCartUpdatesBadge(expectedCount)
            } else {
                await CartPageValidator.verifyCartBadgeIsNotDisplayed()		
            }			
        }				
        await CartPageValidator.verifyCartItemsCountEquals(0)
        allure.endStep('passed')
    }

    async addProductsToCartAndVerify(productsToAddCount) {
        allure.startStep(`Add (${productsToAddCount}) Products to Cart and store their details`)
        await this.addInventoryProductsToCart(productsToAddCount)
        const addedProductsDetails = await this.getInventoryProductsDetails(productsToAddCount)
        allure.endStep('passed')

        await InventoryPage.clickCart()
        await CartPage.waitForPageToLoad()

        allure.startStep('Verify Cart contents + items')
        await CartPageValidator.verifyCartItemsCountEquals(addedProductsDetails.length)
        await CartPageValidator.verifyAllCartItemsHaveRequiredDetails()
        await CartPageValidator.verifyCartMatchesInventory(addedProductsDetails)
        allure.endStep('passed')				
    }

}

module.exports = new BaseSpec()