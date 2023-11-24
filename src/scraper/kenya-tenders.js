/** @format */
async function scrapeWebsite1(page) {
	await page.goto('https://www.tendersontime.com/kenya-tenders/market-research-tenders/');
	try {
		await page.waitForSelector('#phpdata > div', { visible: true, timeout: 10000 });
		console.log('\n================================================================');
		console.log('Scrape Website 1');
		console.log('================================================================\n');

		const jobInfo = await page.evaluate(() => {
			const listing = document.querySelectorAll('#phpdata > div.listingbox.mt10');
			console.log('Job Info', listing);

			const jobs = [];
			listing.forEach((element) => {
				const title = element.querySelector('div > div > a > p').innerText;
				const deadline = element.querySelector('div > div > div.column.is-3.text-right.mobhide > p').innerText;
				const country = element.querySelector('div > div.columns.is-12.mb0.mobpt10 > div > p > strong').innerText;
				const link = element.querySelector('a').getAttribute('href');
				jobs.push({
					title: title,
					deadline: deadline,
					country: country,
					link: link,
				});
			});
			return jobs;
		});
		console.log(jobInfo);
		console.log('\n================================================');
		console.log('End of 1');
		console.log('================================================\n');
		return jobInfo;
	} catch (error) {
		console.log('Elements with the specified classes not found or not visible within the timeout.');
	}
}

module.exports = scrapeWebsite1;
