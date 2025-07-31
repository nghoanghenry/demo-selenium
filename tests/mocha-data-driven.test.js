import { Builder, By, until } from 'selenium-webdriver';
import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs';

// Thiết lập chai-as-promised
use(chaiAsPromised);

// Đọc dữ liệu từ file JSON
const usersData = JSON.parse(fs.readFileSync('./data/users_random_500.json', 'utf-8'));

// Test configuration from environment variables
const testConfig = {
    baseUrl: 'https://practicesoftwaretesting.com/',
    maxUsers: process.env.MAX_USERS ? parseInt(process.env.MAX_USERS) : 2,
    headless: process.env.HEADLESS === 'true',
    browser: (process.env.BROWSER || 'chrome').trim().toLowerCase(),
    // Standard desktop screen resolution (can be customized via environment variables)
    screenWidth: process.env.SCREEN_WIDTH ? parseInt(process.env.SCREEN_WIDTH) : 1920,
    screenHeight: process.env.SCREEN_HEIGHT ? parseInt(process.env.SCREEN_HEIGHT) : 1080,
    // Zoom level for better screenshot coverage (0.5 = 50%, 0.75 = 75%, 1.0 = 100%)
    zoomLevel: process.env.ZOOM_LEVEL ? parseFloat(process.env.ZOOM_LEVEL) : 0.5,
    // Timeout configurations (in milliseconds)
    timeouts: {
        implicit: 5000,        // Implicit wait (default: 5s instead of 10s)
        pageLoad: 15000,       // Page load timeout (default: 15s instead of 30s)
        elementWait: 5000,     // Element wait timeout (default: 5s)
        testCase: 20000,       // Individual test case timeout (default: 20s instead of 30s)
        suite: 60000,          // Test suite timeout (default: 60s instead of 120s)
        setup: 45000           // Setup/teardown timeout (default: 45s instead of 90s)
    }
};

console.log('🚀 Test Configuration:', testConfig);

// Hàm tạo driver cho nhiều browser
async function createDriver(browser = 'chrome', headless = false) {
    let driver;
    
    switch (browser.toLowerCase()) {
        case 'chrome':
            const { Options: ChromeOptions } = await import('selenium-webdriver/chrome.js');
            const chromeOptions = new ChromeOptions();
            if (headless) {
                chromeOptions.addArguments('--headless', '--no-sandbox', '--disable-dev-shm-usage');
            }
            chromeOptions.addArguments('--disable-blink-features=AutomationControlled');
            chromeOptions.setUserPreferences({ 'profile.default_content_setting_values.notifications': 2 });
            
            driver = new Builder()
                .forBrowser('chrome')
                .setChromeOptions(chromeOptions)
                .build();
            break;
            
        case 'firefox':
            const { Options: FirefoxOptions } = await import('selenium-webdriver/firefox.js');
            const firefoxOptions = new FirefoxOptions();
            if (headless) {
                firefoxOptions.addArguments('--headless');
            }
            
            driver = new Builder()
                .forBrowser('firefox')
                .setFirefoxOptions(firefoxOptions)
                .build();
            break;
            
        case 'edge':
            const { Options: EdgeOptions } = await import('selenium-webdriver/edge.js');
            const edgeOptions = new EdgeOptions();
            if (headless) {
                edgeOptions.addArguments('--headless');
            }
            
            driver = new Builder()
                .forBrowser('MicrosoftEdge')
                .setEdgeOptions(edgeOptions)
                .build();
            break;
            
        default:
            throw new Error(`Browser ${browser} is not supported`);
    }
    
    await driver.manage().setTimeouts({ 
        implicit: testConfig.timeouts.implicit, 
        pageLoad: testConfig.timeouts.pageLoad 
    });
    
    // Set standard desktop screen resolution (configurable via environment variables)
    await driver.manage().window().setRect({
        width: testConfig.screenWidth,
        height: testConfig.screenHeight,
        x: 0,
        y: 0
    });
    
    // Set zoom level to capture more content in screenshots
    await driver.executeScript(`document.body.style.zoom = '${testConfig.zoomLevel}'`);
    
    console.log(`📺 Screen resolution set to: ${testConfig.screenWidth}x${testConfig.screenHeight}`);
    console.log(`🔍 Zoom level set to: ${Math.round(testConfig.zoomLevel * 100)}% (for better screenshot coverage)`);
    
    return driver;
}

// Hàm chụp màn hình
async function takeScreenshot(driver, testName) {
    try {
        const screenshot = await driver.takeScreenshot();
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `screenshots/${testName}_${testConfig.browser}_${timestamp}.png`;
        
        fs.writeFileSync(filename, screenshot, 'base64');
        console.log(`📸 Screenshot saved: ${filename}`);
        return filename;
    } catch (error) {
        console.log(`❌ Failed to take screenshot: ${error.message}`);
    }
}

describe('🔐 Data-Driven Test - Multi-Browser Support', function () {
    this.timeout(testConfig.timeouts.suite);
    
    let driver;
    const testUsers = usersData.slice(0, testConfig.maxUsers);
    const registeredUsers = [];
    
    before(async function() {
        this.timeout(testConfig.timeouts.setup);
        console.log(`\n🚀 Starting test with ${testUsers.length} users`);
        console.log(`🌐 Browser: ${testConfig.browser}, Headless: ${testConfig.headless}`);
        
        driver = await createDriver(testConfig.browser, testConfig.headless);
        console.log('✅ WebDriver initialized successfully');
    });
    
    after(async function() {
        this.timeout(testConfig.timeouts.setup);
        if (driver) {
            await driver.quit();
            console.log('✅ WebDriver closed successfully');
        }
        console.log(`\n📊 Results: ${registeredUsers.length}/${testUsers.length} users registered successfully`);
    });
    
    afterEach(async function() {
        if (this.currentTest.state === 'failed' && driver) {
            const testName = this.currentTest.title.replace(/[^a-zA-Z0-9]/g, '_');
            await takeScreenshot(driver, testName);
        }
    });

    testUsers.forEach((user, index) => {
        describe(`👤 User ${index + 1}: ${user.firstName} ${user.lastName}`, function () {
            
            it(`✅ Register user: ${user.email}`, async function () {
                this.timeout(testConfig.timeouts.testCase);
                
                await driver.get(testConfig.baseUrl);
                
                // Click Sign In
                const signInBtn = await driver.wait(until.elementLocated(By.css('[data-test="nav-sign-in"]')), testConfig.timeouts.elementWait);
                await signInBtn.click();
                
                // Click Register link
                const registerLink = await driver.wait(until.elementLocated(By.css('[data-test="register-link"]')), testConfig.timeouts.elementWait);
                await registerLink.click();
                
                // Fill registration form
                await driver.wait(until.elementLocated(By.id('first_name')), testConfig.timeouts.elementWait);
                
                await driver.findElement(By.id('first_name')).sendKeys(user.firstName);
                await driver.findElement(By.id('last_name')).sendKeys(user.lastName);
                await driver.findElement(By.id('dob')).sendKeys(user.dob);
                await driver.findElement(By.id('street')).sendKeys(user.street);
                await driver.findElement(By.id('postal_code')).sendKeys(user.postalCode);
                await driver.findElement(By.id('city')).sendKeys(user.city);
                await driver.findElement(By.id('state')).sendKeys(user.state);
                
                // Chọn country
                const countrySelect = await driver.findElement(By.id('country'));
                await countrySelect.findElement(By.css(`option[value="${user.country}"]`)).click();
                
                await driver.findElement(By.id('phone')).sendKeys(user.phone);
                await driver.findElement(By.id('email')).sendKeys(user.email);
                await driver.findElement(By.id('password')).sendKeys(user.password);
                
                // Submit form
                await driver.findElement(By.css('button[type="submit"]')).click();
                
                try {
                    // Check successful redirect
                    await driver.wait(until.urlContains('/auth/login'), testConfig.timeouts.elementWait);
                    const currentUrl = await driver.getCurrentUrl();
                    expect(currentUrl).to.include('/auth/login');
                    
                    registeredUsers.push(user);
                    console.log(`✅ Registration successful: ${user.email}`);
                } catch (error) {
                    // Check if email already exists
                    try {
                        const errorElement = await driver.findElement(By.css('.alert-danger'));
                        const errorText = await errorElement.getText();
                        if (errorText.toLowerCase().includes('email')) {
                            console.log(`⚠️ Email already exists: ${user.email}`);
                            registeredUsers.push(user);
                            return; // Test still passes because email already exists
                        }
                    } catch (e) {
                        // If no error message found, throw original error
                    }
                    throw error;
                }
            });
            
            it(`🔐 Login user: ${user.email}`, async function () {
                this.timeout(testConfig.timeouts.testCase);
                
                // Go to login page
                await driver.get(`${testConfig.baseUrl}auth/login`);
                
                // Fill login information
                await driver.findElement(By.id('email')).sendKeys(user.email);
                await driver.findElement(By.id('password')).sendKeys(user.password);
                
                // Submit login
                await driver.findElement(By.css('[data-test="login-submit"]')).click();
                
                // Check successful login
                await driver.wait(until.urlContains('/account'), testConfig.timeouts.elementWait);
                const currentUrl = await driver.getCurrentUrl();
                expect(currentUrl).to.include('/account');
                
                console.log(`✅ Login successful: ${user.email}`);
                
                // Logout
                await driver.findElement(By.css('[data-test="nav-menu"]')).click();
                await driver.findElement(By.css('[data-test="nav-sign-out"]')).click();
            });
            
            it(`👤 Verify user info: ${user.firstName} ${user.lastName}`, async function () {
                this.timeout(testConfig.timeouts.testCase);
                
                // Login again
                await driver.get(`${testConfig.baseUrl}auth/login`);
                
                await driver.findElement(By.id('email')).sendKeys(user.email);
                await driver.findElement(By.id('password')).sendKeys(user.password);
                await driver.findElement(By.css('[data-test="login-submit"]')).click();
                
                await driver.wait(until.urlContains('/account'), testConfig.timeouts.elementWait);
                
                // Check display name
                const navMenu = await driver.findElement(By.css('[data-test="nav-menu"]'));
                const displayName = await navMenu.getText();
                
                // Check if name contains firstName or lastName
                const nameCheck = displayName.toLowerCase().includes(user.firstName.toLowerCase()) || 
                                displayName.toLowerCase().includes(user.lastName.toLowerCase());
                
                expect(nameCheck, `Display name '${displayName}' should contain '${user.firstName}' or '${user.lastName}'`).to.be.true;
                console.log(`✅ User info correct: ${displayName}`);
                
                // Logout
                await navMenu.click();
                await driver.findElement(By.css('[data-test="nav-sign-out"]')).click();
            });
        });
    });
    
    describe('🚫 Negative Test Cases', function () {
        
        it('❌ Register with invalid email', async function () {
            this.timeout(testConfig.timeouts.testCase);
            
            const invalidUser = {
                ...testUsers[0],
                email: 'invalid-email-format'
            };
            
            await driver.get(testConfig.baseUrl);
            await driver.findElement(By.css('[data-test="nav-sign-in"]')).click();
            await driver.findElement(By.css('[data-test="register-link"]')).click();
            
            await driver.findElement(By.id('first_name')).sendKeys(invalidUser.firstName);
            await driver.findElement(By.id('email')).sendKeys(invalidUser.email);
            await driver.findElement(By.id('password')).sendKeys(invalidUser.password);
            await driver.findElement(By.css('button[type="submit"]')).click();
            
            // Should stay on register page
            const currentUrl = await driver.getCurrentUrl();
            expect(currentUrl).to.include('/register');
        });
        
        it('❌ Login with wrong password', async function () {
            this.timeout(testConfig.timeouts.testCase);
            
            if (registeredUsers.length === 0) {
                this.skip('No users registered successfully');
            }
            
            const user = registeredUsers[0];
            
            await driver.get(`${testConfig.baseUrl}auth/login`);
            await driver.findElement(By.id('email')).sendKeys(user.email);
            await driver.findElement(By.id('password')).sendKeys('wrongpassword123');
            await driver.findElement(By.css('[data-test="login-submit"]')).click();
            
            // Check for error message
            const errorElement = await driver.wait(until.elementLocated(By.css('.alert-danger')), testConfig.timeouts.elementWait);
            const errorText = await errorElement.getText();
            expect(errorText.toLowerCase()).to.include('invalid');
        });
    });
});
