const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

(async function educationPageSearchTest() {
    // Set up Chrome options
    let options = new chrome.Options();
    options.addArguments('--start-maximized');
    
    // Initialize driver
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        // Navigate to education page
        await driver.get('https://your-education-page-url.com');
        
        // Define reusable elements
        const searchInput = By.id('search-input');
        const searchBtn = By.id('search-btn');
        const resultsContainer = By.id('results-container');
        const readingItem = By.className('reading-item');
        
        // Test 1: Basic search with results
        await driver.findElement(searchInput).sendKeys('nutrition');
        await driver.findElement(searchBtn).click();
        
        // Verify results appear quickly
        const startTime = Date.now();
        await driver.wait(until.elementLocated(readingItem), 2000);
        assert.strictEqual(
            Date.now() - startTime < 2000,
            true,
            'Results took longer than 2 seconds to appear'
        );
        
        // Verify relevant results
        const results = await driver.findElements(readingItem);
        assert.ok(results.length > 0, 'No results found for valid query');
        for (let i = 0; i < Math.min(3, results.length); i++) {
            const text = (await results[i].getText()).toLowerCase();
            assert.ok(
                text.includes('nutrition'),
                `Result doesn't contain search term: ${text.slice(0, 30)}...`
            );
        }
        
        // Test 2: Partial word matching
        await driver.findElement(searchInput).clear();
        await driver.findElement(searchInput).sendKeys('nutri');
        await driver.findElement(searchBtn).click();
        
        await driver.wait(until.elementLocated(readingItem), 2000);
        const partialResults = await driver.findElements(readingItem);
        assert.ok(
            partialResults.length >= results.length,
            'Partial search returned fewer results than full term'
        );
        
        // Test 3: Case insensitivity
        await driver.findElement(searchInput).clear();
        await driver.findElement(searchInput).sendKeys('NUTRITION');
        await driver.findElement(searchBtn).click();
        
        const caseResults = await driver.findElements(readingItem);
        assert.strictEqual(
            caseResults.length,
            results.length,
            'Case sensitive results differ'
        );
        
        // Test 4: No results
        await driver.findElement(searchInput).clear();
        await driver.findElement(searchInput).sendKeys('invalid_query_xyz123');
        await driver.findElement(searchBtn).click();
        
        await driver.wait(until.elementTextContains(
            driver.findElement(resultsContainer),
            'No matching'
        ), 2000);
        
        const noResultsMsg = await driver.findElement(resultsContainer).getText();
        assert.ok(
            noResultsMsg.includes('No matching'),
            'Missing no-results message'
        );
        
        console.log('✅ All tests passed!');
        
    } catch (err) {
        console.error('❌ Test failed:', err);
        // Capture screenshot on failure
        await driver.takeScreenshot().then(
            image => require('fs').writeFileSync('failure.png', image, 'base64')
        );
        console.log('Screenshot saved as failure.png');
    } finally {
        // Clean up
        await driver.quit();
    }
})();