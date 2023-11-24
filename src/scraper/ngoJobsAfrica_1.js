/** @format */
async function scrapeWebsite2(page) {
	await page.goto('https://ngojobsinafrica.com/jobs/');
	try {
		await page.waitForSelector('article');
		console.log('\n================================================');
		console.log('Scrape Website 2');
		console.log('================================================\n');

		const jobInfo = await page.evaluate(() => {
			const listing = document.querySelectorAll('.loop-item-content');
			console.log('Job Info', listing);

			const jobs = [];
			listing.forEach((element) => {
				const title = element.querySelector('.loop-item-title').innerText;
				const date = element.querySelector('.job-date').innerText;
				const location = element.querySelector('.job-location').innerText;
				const company = element.querySelector('.job-company').innerText;
				const type = element.querySelector('.job-type').innerText;
				const link = element.querySelector('a').getAttribute('href');

				jobs.push({
					title: title,
					date: date,
					location: location,
					company: company,
					type: type,
					link: link,
				});
			});
			return jobs;
		});
		console.log(jobInfo);
		console.log('\n================================================');
		console.log('End of 2');
		console.log('================================================\n');
		return jobInfo;
	} catch (error) {
		console.log('Elements with the specified classes not found or not visible within the timeout.');
	}
}

module.exports = scrapeWebsite2;
