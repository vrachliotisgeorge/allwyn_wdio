/* eslint-disable no-undef */
const allure = require('@wdio/allure-reporter')
const csvReader = require('../utils/csvReader')
const TestData = csvReader.readCSV('./test/testdata/login.csv')
const BaseSpec = require('./base.spec')
const LoginPageValidator = require('../validations/login.page.validations')
const InventoryPage = require('../pageobjects/inventory.page')

describe('Login Page Tests', () => {

    for (const { description, severity, username, password, expectedResult, expectedError } of TestData) {

        it(description, async () => {

            allure.addFeature('User Login')
            allure.addSeverity(severity);
            allure.addDescription('Verify ' + description)            
            
            await browser.reloadSession()
            await BaseSpec.loginUser(username, password)
            
            if (expectedResult === 'success') {
                await InventoryPage.waitForPageToLoad()
            } else {
                await LoginPageValidator.verifyErrorMessageIsDisplayed()
                if (expectedError != '') {
                    await LoginPageValidator.verifyErrorMessageContainsText(expectedError)
                }                
            }
            
        });
        
    }
});