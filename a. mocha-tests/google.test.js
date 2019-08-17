/**
 * @name Google search
 * @desc Searches Google.com for a term and checks if the first link matches. This check should fail.
 */

const assert = require('assert').strict
const puppeteer = require('puppeteer')
let browser
let page

const selectors = {
  resultHeader: 'a[ping] h3'
}

before(async () => {
  browser = await puppeteer.launch({ headless: true })
  page = await browser.newPage()
})

describe('Check Google Homepage', () => {
  it('has title "Google"', async () => {
    await page.goto('https://google.com', { waitUntil: 'networkidle0' })
    const title = await page.title()
    assert.equal(title, 'Google')
  }).timeout(10000)

  it('Third search result is my link', async () => {
    await page.type('input[name=q]', 'puppeteer', { delay: 100 })
    await page.click('input[type="submit"]')
    await page.waitForSelector(selectors.resultHeader)
    const links = await page.$$eval(
      selectors.resultHeader,
      anchors => anchors.map(a => a.textContent)
    )
    assert.equal('Puppeteer - Google Developers', links[2])
    // Not sure what the point of this is?
    // assert.equal('This will fail...', links[2])
  }).timeout(10000)
})

after(async () => {
  await browser.close()
})