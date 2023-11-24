/** @format */

const scrapeWebsite1 = require('./scraper/kenya-tenders');
const scrapeWebsite2 = require('./scraper/ngoJobsAfrica_1');
const scrapeWebsite3 = require('./scraper/ngoJobsAfrica_2');

const puppeteer = require('puppeteer');

async function main() {
	const browser = await puppeteer.launch({ headless: true, defaultViewport: null });

	try {
		const page = await browser.newPage();

		// Scrape data from Website 1
		const website1 = await scrapeWebsite1(page);

		// Scrape data from Website 2
		const website2 = await scrapeWebsite2(page);

		//const website3 = await scrapeWebsite2(page);

		let website3 = [];
		for (let i = 0; i < website2.length; i++) {
			// Scrape data from Website 3
			let link = website2[i].link;
			console.log('\n\n Link: \n', link, '\n\n');
			let result = await scrapeWebsite3(page, link);
			website3.push(result);
		}
		//console.log(website3);
		return {
			website1: website1,
			website2: website2,
			website3: website3,
		};
	} catch (error) {
		console.error(error);
	} finally {
		await browser.close();
	}
}

main();

module.exports = main;
