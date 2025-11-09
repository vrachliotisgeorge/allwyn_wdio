const fs = require('fs');
const path = require('path');
const allure = require('@wdio/allure-reporter').default

exports.config = {
    specs: [
        './test/specs/allwyn.login.spec.js',
        //'./test/specs/allwyn.inventory.spec.js',
        //'./test/specs/allwyn.cart.spec.js',
        //'./test/specs/allwyn.checkout.step_one.spec.js',
        //'./test/specs/allwyn.checkout.step_two.spec.js',
    ],
    exclude: [],
    maxInstances: 1,
    capabilities: [
        {
            browserName: 'chrome',
            maxInstances: 1,
            'goog:chromeOptions': {
                    args: [
                        '--start-maximized',
                        '--disable-extensions',
                        '--disable-notifications',
                        '--disable-blink-features=AutomationControlled',
                        '--disable-infobars',
                    ],
                    excludeSwitches: ['enable-automation'], 
                    useAutomationExtension: false, 
            }        
        }
    ],
    bail: 0,
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    services: ['visual'],
    framework: 'mocha',
    reporters: [
        'spec',
        ['allure', {
            outputDir: 'allure-results',
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: false
        }]
    ],
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000,
    },

    // Hook: after each test
    afterTest: async function(test, context, { error, result, duration, passed, retries }) {
        if (!passed) {
            const screenshot = await browser.takeScreenshot();
            allure.addAttachment('Screenshot on Failure', Buffer.from(screenshot, 'base64'), 'image/png');
        }
    },

    onPrepare: function (config, capabilities) {
        const resultsDir = path.join(__dirname, 'allure-results');
        if (fs.existsSync(resultsDir)) {
            fs.rmSync(resultsDir, { recursive: true, force: true });
            console.log('Allure results folder cleaned.');
        }
    }
};
