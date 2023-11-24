/** @format */
async function scrapeWebsite3(page, link) {
	await page.goto(`${link}`);
	// await page.goto('https://ngojobsinafrica.com/job/website-maintenance-consultant-for-adolescents-360-psis-flagship-youth-contraceptive-program/');
	console.log('\n================================================');
	console.log('Scrape Website 3');
	console.log('================================================\n');

	try {
		await page.waitForSelector('.page-heading-info h1', { waitUntil: 'networkidle0' });
		await page.waitForSelector('.page-sub-heading-info p span', { waitUntil: 'networkidle0' });
		await page.waitForSelector('.rw-article__content', { waitUntil: 'networkidle0' });

		const subHeadingInfo = await page.evaluate(() => {
			const title = document.querySelector('.page-heading-info h1').innerText;
			const jobType = document.querySelector('.job-type').innerText;
			const jobLocation = document.querySelector('.job-location').innerText;
			const jobDate = document.querySelector('.job-date').innerText;
			const jobCategory = document.querySelector('.job-category').innerText;
			const jobDescription = document.querySelector('.rw-article__content').innerHTML;
			const productnames = {
				title: title,
				type: jobType,
				location: jobLocation,
				date: jobDate,
				category: jobCategory,
				description: jobDescription,
			};
			return productnames;
		});

		console.log(subHeadingInfo);

		console.log('\n================================================');
		console.log('End of 3');
		console.log('================================================\n');
		return subHeadingInfo;
	} catch (error) {
		console.log('Elements with the specified classes not found or not visible within the timeout.');
	}
}

module.exports = scrapeWebsite3;
