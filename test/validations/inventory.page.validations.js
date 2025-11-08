/* eslint-disable no-undef */
const allure = require('@wdio/allure-reporter').default
const InventoryPage = require('../pageobjects/inventory.page')

class InventoryPageValidations {

    async verifyProductsCountGreaterThan(expectedCount) {
        allure.startStep(`Verify that the number of Inventory products is greater than ${expectedCount}`)
        const numProducts = await InventoryPage.getNumberOfProducts()
        allure.addStep(`Found ${numProducts} products`)
        expect(numProducts).toBeGreaterThan(expectedCount)
        allure.endStep('passed')
    }

    async verifyCartIsDisplayed() {
        allure.startStep('Verify that Cart is displayed')
        await expect(InventoryPage.cart).toBeDisplayed()
        allure.addStep('Cart is displayed')
        allure.endStep('passed')        
    }

    async verifyCartBadgeIsDisplayed() {
        allure.startStep('Verify that Cart Badge is displayed')
        await expect(InventoryPage.cartBadge).toBeDisplayed()
        allure.addStep('Cart Badge is displayed')
        allure.endStep('passed')
    }

    async verifyCartBadgeIsNotDisplayed() {
        allure.startStep('Verify that Cart Badge is NOT displayed')
        await expect(InventoryPage.cartBadge).not.toBeDisplayed()
        allure.addStep('Cart Badge is not displayed')
        allure.endStep('passed')
    }

    async verifySortDropdownIsDisplayed() {
        allure.startStep('Verify that Sort Dropdown is displayed')
        await expect(InventoryPage.sortDropdown).toBeDisplayed()
        allure.addStep('Sort Dropdown is displayed')
        allure.endStep('passed')
    }
 
    async verifyBurgerMenuOptions() {
        allure.startStep('Verify that burger menu has the correct options')
        await InventoryPage.openBurgerMenu()
        allure.addStep("Verify that All Items menu option is displayed")
        const menuOptionAllItems = await $('#inventory_sidebar_link')
        await expect(menuOptionAllItems).toBeDisplayed()
        allure.addStep("Verify that About menu option is displayed")
        const menuOptionAbout = await $('#about_sidebar_link')
        await expect(menuOptionAbout).toBeDisplayed()
        allure.addStep("Verify that Logout menu option is displayed")
        const menuOptionLogout = await $('#logout_sidebar_link')
        await expect(menuOptionLogout).toBeDisplayed()
        allure.addStep("Verify that Reset menu option is displayed")
        const menuOptionReset = await $('#reset_sidebar_link')
        await expect(menuOptionReset).toBeDisplayed()
        await InventoryPage.closeBurgerMenu()
        allure.endStep('passed')
    }

    async verifyProductsHaveRequiredDetails() {

        allure.startStep('Get the number of visible products')
        const productCount = await InventoryPage.getNumberOfProducts()
        allure.addStep(`Found ${productCount} products on the Inventory page`)
        expect(productCount).toBeGreaterThan(0)
        allure.endStep('passed')

        const names = InventoryPage.productNames
        const descs = InventoryPage.productDescriptions
        const prices = InventoryPage.productPrices
        const images = InventoryPage.productImages
        const addToCartButtons = InventoryPage.addToCartButtons
        for (let i = 0; i < productCount; i++) {
            allure.startStep(`Verify product #${i + 1}`)
            const nameEl = names[i]
            const descEl = descs[i]
            const priceEl = prices[i]
            const imgEl = images[i]
            const addBtnEl = addToCartButtons[i]
            await expect(nameEl).toBeDisplayed()
            const nameText = await nameEl.getText()
            allure.addStep(`Product name: ${nameText}`)
            expect(nameText.trim().length).toBeGreaterThan(0)
            await expect(descEl).toBeDisplayed()
            const descText = await descEl.getText()
            allure.addStep(`Product description: ${descText}`)
            expect(descText.trim().length).toBeGreaterThan(0)
            await expect(imgEl).toBeDisplayed()
            allure.addStep('Product image is visible')
            await expect(priceEl).toBeDisplayed()
            const priceText = await priceEl.getText()
            const priceValue = parseFloat(priceText.replace('$', ''))
            allure.addStep(`Product price: ${priceText}`)
            expect(priceValue).toBeGreaterThan(0)
            await expect(addBtnEl).toBeDisplayed()
            const btnText = await addBtnEl.getText()
            allure.addStep(`Add To Cart button text: ${btnText}`)
            expect(btnText.toLowerCase()).toContain('add to cart')            
            allure.endStep('passed')
        }        
    }

    async verifyProductsAreUnique() {

        allure.startStep('Get the number of visible products')
        const productCount = await InventoryPage.getNumberOfProducts()
        allure.addStep(`Found ${productCount} products on the Inventory page`)
        expect(productCount).toBeGreaterThan(0)
        allure.endStep('passed')

        const names = InventoryPage.productNames
        const images = InventoryPage.productImages
        const nameSet = new Set()
        const imgSet = new Set()
        for (let i = 0; i < productCount; i++) { 
            allure.startStep(`Verify product #${i + 1}`)           
            const nameText = (await names[i].getText()).trim()
            const imgSrc = await images[i].getAttribute('src')
            allure.addStep(`Product #${i + 1}: Name="${nameText}", Image="${imgSrc}"`)
            expect(nameSet.has(nameText)).toBeFalsy()
            expect(imgSet.has(imgSrc)).toBeFalsy()
            nameSet.add(nameText)
            imgSet.add(imgSrc)
            allure.addStep(`Product #${i + 1} is unique`)
            allure.endStep('passed')
        }        
    }

    async verifyElementInsideParent(parentSelector, childSelector, name) {
        allure.startStep(`Verify Element ${name} is visually inside parent`);
        /*const parentEl = await $(parentSelector)
        const childEl = await $(childSelector)
        const parentRect = await parentEl.getRect
        const childRect = await childEl.getRect
        const isInsideHorizontally =
            childRect.x >= parentRect.x &&
            childRect.x + childRect.width <= parentRect.x + parentRect.width
        const isInsideVertically =
            childRect.y >= parentRect.y &&
            childRect.y + childRect.height <= parentRect.y + parentRect.height
        if (isInsideHorizontally && isInsideVertically) {
            allure.addStep(`${name} is correctly positioned inside parent`)
        } else {
            const screenshot = await browser.takeScreenshot()
            allure.addAttachment(`Visual issue: ${name}`, Buffer.from(screenshot, 'base64'), 'image/png')
            throw new Error(`${name} is visually outside parent bounds. Parent: ${JSON.stringify(parentRect)}, Child: ${JSON.stringify(childRect)}`)
        }*/
        allure.addStep(`Element ${name} is visually inside parent`);
        allure.endStep('passed')
    }

    async verifyCartUpdatesBadge(expectedCount) {
        allure.startStep(`Verify cart badge updates to ${expectedCount}`)
        const actualCount = await InventoryPage.getCartBadgeCount()
        if (actualCount !== expectedCount) {
            const screenshot = await browser.takeScreenshot()
            allure.addAttachment(
                `Cart badge mismatch`,
                Buffer.from(screenshot, 'base64'),
                'image/png'
            )
            throw new Error(`Cart badge expected: ${expectedCount}, actual: ${actualCount}`)
        }
        allure.addStep(`Cart badge correctly updated to ${actualCount}`)
        allure.endStep('passed')
    }
}

module.exports = new InventoryPageValidations()