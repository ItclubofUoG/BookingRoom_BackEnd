const puppeteer = require("puppeteer");

async function login() {
    const email = '';
    const password = '';

    const browser = await puppeteer.launch({
        headless:false,
        args: [`--window-size=1920,1080`],
        defaultViewport: {
          width:1920,
          height:1080
        }
    });
    const page = await browser.newPage();
    const pages = await browser.pages();
    pages[0].close();
    await page.goto("https://ap.greenwich.edu.vn/", { waitUntil: 'networkidle2' });

    // await page.setViewport({
    //     width: 1200,
    //     height: 800
    //   });

    await page.waitForSelector('#ctl00_mainContent_ddlCampus');
    await page.select('#ctl00_mainContent_ddlCampus','6');

    await page.waitForSelector('.abcRioButtonContentWrapper');
    await page.click('.abcRioButtonContentWrapper');

    // Wait for the new window to open
    const newTarget = await browser.waitForTarget(target => target.opener() === page.target() && target.url().includes('accounts.google.com'));

    // Switch to the new window
    const newPage = await newTarget.page();

    // Fill in the Google login form fields
    await newPage.waitForSelector('#identifierId');
    await newPage.type('#identifierId', email);
    await newPage.click('#identifierNext');
    await newPage.waitForSelector('input[type="password"]', { visible: true });
    await newPage.type('input[type="password"]', password);
    
    // Submit the form
    await newPage.click('#passwordNext');

    // Wait for the login to complete and the new window to close
    // await browser.waitForTarget(target => target.opener() === page.target() && target.url().startsWith('https://ap.greenwich.edu.vn'));

    await page.waitForNavigation();

    // Switch back to the original window
    await page.bringToFront();

    // await page.waitForNavigation();

    // await page.goto("https://ap.greenwich.edu.vn/Schedule/TimeTable.aspx")
    
    // await page.waitForNavigation();

    await console.log("Login successfully");

    return browser;
}

module.exports = {
	login
};