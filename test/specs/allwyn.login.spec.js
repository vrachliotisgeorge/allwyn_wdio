/* eslint-disable no-undef */
const { readCSV } = require('../utils/csvReader')
const allure = require('@wdio/allure-reporter')
const testData = readCSV('./test/testdata/login.csv')
const LoginPage = require('../pageobjects/login.page')
const InventoryPage = require('../pageobjects/inventory.page')
const baseUrl = 'https://www.saucedemo.com/'

describe('Login Page Tests', () => {

    for (const { description, severity, username, password, expectedResult, expectedError } of testData) {

        it(description, async () => {
            allure.addSeverity(severity);
            allure.addDescription('Verify ' + description);
            await LoginPage.open(baseUrl)
            await LoginPage.login(username, password)
            if (expectedResult === 'success') {
                await InventoryPage.waitForPageToLoad()
            } else {
                await LoginPage.expectErrorMessageToBeDisplayed()
                if (expectedError != '') {
                    await LoginPage.expectErrorMessageToContain(expectedError);
                }                
            }
        });
        
    }
});
