const scraperObject = {
	url: 'https://ap.greenwich.edu.vn/Schedule/TimeTable.aspx',
	async scraper(browser){
        const pages = await browser.pages();
		let page = pages[0];
		console.log(`Navigating to ${this.url}...`);
		await page.goto(this.url);

		// Wait for the required DOM to be rendered
		await page.waitForSelector('.table.table-striped');
		// Get the link to all the programme
		let programmes = await page.$$eval('#ctl00_mainContent_divCampus a', links => links.map(link => link.href));
        //Add current programme of account because when go to TimeTable it go straight here, this link may change depend on account so need to change later
        programmes.unshift(page.url());

        //Data scrapped
        let scrapedData = [];
        

        // Loop through each of those links, open a new page instance and get the relevant data from them
		let getGroup = (link) => new Promise(async(resolve, reject) => {
			let dataObj = {};
			let newPage = await browser.newPage();
			await newPage.goto(link);

            dataObj['group'] = await newPage.$$eval('#ctl00_mainContent_divGroup a', links => links.map(link => link.href));

            //Example code
			// dataObj['bookTitle'] = await newPage.$eval('.product_main > h1', text => text.textContent);
			// dataObj['bookPrice'] = await newPage.$eval('.price_color', text => text.textContent);
			// dataObj['noAvailable'] = await newPage.$eval('.instock.availability', text => {
			// 	// Strip new line and tab spaces
			// 	text = text.textContent.replace(/(\r\n\t|\n|\r|\t)/gm, "");
			// 	// Get the number of stock available
			// 	let regexp = /^.*\((.*)\).*$/i;
			// 	let stockAvailable = regexp.exec(text)[1].split(' ')[0];
			// 	return stockAvailable;
			// });
			// dataObj['imageUrl'] = await newPage.$eval('#product_gallery img', img => img.src);
			// dataObj['bookDescription'] = await newPage.$eval('#product_description', div => div.nextSibling.nextSibling.textContent);
			// dataObj['upc'] = await newPage.$eval('.table.table-striped > tbody > tr > td', table => table.textContent);

			resolve(dataObj);

			await newPage.close();
		});


        let pagePromise = (link) => new Promise(async(resolve, reject) => {
			let dataObj = [];
			let newPage = await browser.newPage();
			// await newPage.goto(link, { waitUntil: 'networkidle2' });
			await newPage.goto(link);

			let numRow = await newPage.$$eval('#ctl00_mainContent_divDetail table tbody tr td:nth-child(2)',items => items.length);
			console.log(numRow);
			for (let row = 1; row <= numRow; row++) {
				let time = await newPage.$eval('#ctl00_mainContent_divDetail table tbody tr:nth-child('+ row +') td:nth-child(2)', text => text.textContent);
				let slot = await newPage.$eval('#ctl00_mainContent_divDetail table tbody tr:nth-child('+ row +') td:nth-child(3)', text => text.textContent);
				let room = await newPage.$eval('#ctl00_mainContent_divDetail table tbody tr:nth-child('+ row +') td:nth-child(4)', text => text.textContent);
				let teacher = await newPage.$eval('#ctl00_mainContent_divDetail table tbody tr:nth-child('+ row +') td:nth-child(5)', text => text.textContent);

				dataObj.push({time,slot,room,teacher});
			}

            resolve(dataObj);

			await newPage.close();
		});

            // let currentPageData = await pagePromise("https://ap.greenwich.edu.vn/Schedule/TimeTable.aspx?campus=7&term=56&group=1622%20-%20TUTOR");
			// scrapedData = scrapedData.concat(currentPageData);

            // currentPageData = await pagePromise("https://ap.greenwich.edu.vn/Schedule/TimeTable.aspx?campus=7&term=56&group=1644%20-%20TUTOR");
			// scrapedData = scrapedData.concat(currentPageData);


		for (link in programmes){
			let groups = await getGroup(programmes[link]);
			console.log(groups);

            // SCRAPPED ALL DATA, not run now because very big data
			for (group in groups){
				//console.log(groups[group]);
				for (link in groups[group]){
					console.log(groups[group][link]);
					if (groups[group][link] != []){
						let currentPageData = await pagePromise(groups[group][link]);
						scrapedData = scrapedData.concat(currentPageData);
					}
				}
			}
		}

		console.log(scrapedData);

        //Example code
        // {
		// 	// Make sure the book to be scraped is in stock
		// 	links = links.filter(link => link.querySelector('.instock.availability > i').textContent !== "In stock")
		// 	// Extract the links from the data
		// 	links = links.map(el => el.querySelector('h3 > a').href)
		// 	return links;
		// });

		await page.close();
	}
}

module.exports = scraperObject;