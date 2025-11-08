/* eslint-disable no-undef */
const csvReader = require('../utils/csvReader')
const allure = require('@wdio/allure-reporter')
const testData = csvReader.readCSV('./test/testdata/login.csv')
const LoginPage = require('../pageobjects/login.page')
const LoginPageValidator = require('../validations/login.page.validations')
const InventoryPage = require('../pageobjects/inventory.page')
const { baseUrl } = require('../config/allwyn.env.config')

describe('Login Page Tests', () => {

    for (const { description, severity, username, password, expectedResult, expectedError } of testData) {

        it(description, async () => {

            allure.addFeature('User Login')
            allure.addSeverity(severity);
            allure.addDescription('Verify ' + description)            
            
            await browser.reloadSession()
            await LoginPage.open(baseUrl)
            await LoginPage.waitForPageToLoad()
            await LoginPage.login(username, password)
            if (expectedResult === 'success') {
                await InventoryPage.waitForPageToLoad()
            } else {
                await LoginPageValidator.validateErrorMessageIsDisplayed()
                if (expectedError != '') {
                    await LoginPageValidator.validateErrorMessageContainsText(expectedError)
                }                
            }
            
        });
        
    }
});