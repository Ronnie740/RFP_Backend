/** @format */

import * as puppeteer from 'puppeteer';

interface JobInfo {
	title: string;
	deadline?: string;
	country?: string;
	link: string;
}

interface Website2JobInfo {
	title: string;
	date: string;
	location: string;
	company: string;
	type: string;
	link: string;
}

interface Website3SubHeadingInfo {
	title: string;
	type: string;
	location: string;
	date: string;
	category: string;
	description: string;
}

async function scrapeWebsite1(page: puppeteer.Page): Promise<JobInfo[]> {
	await page.goto('https://www.tendersontime.com/kenya-tenders/market-research-tenders/');
	try {
		await page.waitForSelector('#phpdata > div', { visible: true, timeout: 10000 });
		console.log('\n================================================================');
		console.log('Scrape Website 1');
		console.log('================================================================\n');

		const jobInfo: JobInfo[] = await page.evaluate(() => {
			const listing = document.querySelectorAll('#phpdata > div.listingbox.mt10');
			console.log('Job Info', listing);

			const jobs: JobInfo[] = [];
			listing.forEach((element) => {
				const title = (element.querySelector('div > div > a > p') as HTMLElement)?.innerText;
				const deadline = (element.querySelector('div > div > div.column.is-3.text-right.mobhide > p') as HTMLElement)?.innerText;
				const country = (element.querySelector('div > div.columns.is-12.mb0.mobpt10 > div > p > strong') as HTMLElement)?.innerText;
				const link = (element.querySelector('a') as HTMLAnchorElement)?.getAttribute('href') ?? '';

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
		return [];
	}
}

async function scrapeWebsite2(page: puppeteer.Page): Promise<Website2JobInfo[]> {
	await page.goto('https://ngojobsinafrica.com/jobs/');
	try {
		await page.waitForSelector('article');
		console.log('\n================================================');
		console.log('Scrape Website 2');
		console.log('================================================\n');

		const jobInfo: Website2JobInfo[] = await page.evaluate(() => {
			const listing = document.querySelectorAll('.loop-item-content');
			console.log('Job Info', listing);

			const jobs: Website2JobInfo[] = [];
			listing.forEach((element) => {
				const title = (element.querySelector('.loop-item-title') as HTMLElement)?.innerText;
				const date = (element.querySelector('.job-date') as HTMLElement)?.innerText;
				const location = (element.querySelector('.job-location') as HTMLElement)?.innerText;
				const company = (element.querySelector('.job-company') as HTMLElement)?.innerText;
				const type = (element.querySelector('.job-type') as HTMLElement)?.innerText;
				const link = (element.querySelector('a') as HTMLAnchorElement)?.getAttribute('href') ?? '';

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
		return [];
	}
}

async function scrapeWebsite3(page: puppeteer.Page, link: string): Promise<Website3SubHeadingInfo | undefined> {
	await page.goto(`${link}`);
	console.log('\n================================================');
	console.log('Scrape Website 3');
	console.log('================================================\n');

	try {
		// Wait for the selectors using Promise.all
		await Promise.all([page.waitForSelector('.page-heading-info h1'), page.waitForSelector('.page-sub-heading-info p span'), page.waitForSelector('.rw-article__content')]);

		const subHeadingInfo: Website3SubHeadingInfo = await page.evaluate(() => {
			const title = (document.querySelector('.page-heading-info h1') as HTMLElement)?.innerText;
			const jobType = (document.querySelector('.job-type') as HTMLElement)?.innerText;
			const jobLocation = (document.querySelector('.job-location') as HTMLElement)?.innerText;
			const jobDate = (document.querySelector('.job-date') as HTMLElement)?.innerText;
			const jobCategory = (document.querySelector('.job-category') as HTMLElement)?.innerText;
			const jobDescription = (document.querySelector('.rw-article__content') as HTMLElement)?.innerHTML;

			return {
				title: title,
				type: jobType,
				location: jobLocation,
				date: jobDate,
				category: jobCategory,
				description: jobDescription,
			};
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

async function main(): Promise<{ website1: JobInfo[]; website2: Website2JobInfo[]; website3: (Website3SubHeadingInfo | undefined)[] }> {
	const browser = await puppeteer.launch({ headless: true, defaultViewport: null });

	try {
		const page = await browser.newPage();

		// Scrape data from Website 1
		const website1 = await scrapeWebsite1(page);

		// Scrape data from Website 2
		const website2 = await scrapeWebsite2(page);

		//const website3 = await scrapeWebsite2(page);

		let website3: (Website3SubHeadingInfo | undefined)[] = [];
		for (let i = 0; i < website2.length; i++) {
			// Scrape data from Website 3
			let link = website2[i].link;
			console.log('\n\n Link: \n', link, '\n\n');
			let result = await scrapeWebsite3(page, link);
			website3.push(result);
		}
		//console.log(website3);
		await browser.close();
		return {
			website1: website1,
			website2: website2,
			website3: website3,
		};
	} catch (error) {
		console.error(error);
		await browser.close();
		return {
			website1: [],
			website2: [],
			website3: [],
		};
	}
}

//main();

export = main;
