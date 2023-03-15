const browserObject = require('./login');
const scraperController = require('./pageController');

//Start the browser and create a browser instance
let browserInstance = browserObject.login();

// Pass the browser instance to the scraper controller
scraperController(browserInstance)