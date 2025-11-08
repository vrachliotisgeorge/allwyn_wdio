const { browser } = require('@wdio/globals')

module.exports = class Page {

    open(pageUrl) {
        return browser.url(pageUrl)
    }
}
