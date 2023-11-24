/** @format */

import SitesModel from '../../model/sites';
import { Request, Response } from 'express';
import logger from 'winston';
import * as fs from 'fs';
import * as path from 'path';

export async function addSite(req: Request, res: Response) {
	try {
		const { company, link } = req.body;

		if (!company || !link) {
			return res.status(400).json({ error: 'Missing site info' });
		}

		const newSite = new SitesModel({ company, link });
		const savedSite = await newSite.save();

		logger.info(`Site saved: ${savedSite.company}`);

		// Remove spaces from the company value
		const companyWithoutSpaces = company.replace(/\s/g, '');
		// Specify the file name and content
		const fileName: string = `${companyWithoutSpaces}.js`;

		const directoryPath: string = path.join(__dirname, '../../scraper/');
		// Specify the full file path
		const filePath: string = path.join(directoryPath, fileName);

		const fileContent: string = `
		// This is a template JavaScript scrapper file
		const puppeteer = require('puppeteer');

		async function scrapeWebsite(page) {
			await page.goto('https://www.tendersontime.com/kenya-tenders/market-research-tenders/');
			try {
				await page.waitForSelector('#phpdata > div', { visible: true, timeout: 10000 });
				console.log('\\n================================================================');
				console.log('Scrape Website 1');
				console.log('================================================================\\n');

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
				console.log('\\n================================================');
				console.log('End of 1');
				console.log('================================================\\n');
				return jobInfo;
			} catch (error) {
				console.log('Elements with the specified classes not found or not visible within the timeout.');
			}
		}
		`;

		// Check if the file already exists
		if (!fs.existsSync(filePath)) {
			// File doesn't exist, so create a new one
			// Use the fs.writeFile method to create a new file
			fs.writeFile(filePath, fileContent, (err: NodeJS.ErrnoException | null) => {
				if (err) {
					console.error('Error creating file:', err);
				} else {
					console.log('File created successfully!');
				}
			});
		} else {
			console.log('File already exists. Not creating a new one.');
		}

		res.status(201).json(savedSite);
	} catch (error) {
		logger.error('Error saving site:', error);
		res.status(500).json({ error: 'Failed to save site' });
	}
}

export async function getSites(req: Request, res: Response) {
	try {
		const sites = await SitesModel.find();
		res.status(200).json(sites);
	} catch (error) {
		logger.error('Error getting sites:', error);
		res.status(500).json({ error: 'Failed to get sites' });
	}
}
export async function getSiteById(req: Request, res: Response) {
	const id = req.params.id;
	try {
		const sites = await SitesModel.findById(id);
		res.status(200).json(sites);
	} catch (error) {
		logger.error('Error getting sites:', error);
		res.status(500).json({ error: 'Failed to get sites' });
	}
}
export async function deleteSite(req: Request, res: Response) {
	const id = req.params.id;
	try {
		const result = await SitesModel.deleteOne({ _id: id });

		if (result.deletedCount === 0) {
			return res.status(404).json({ error: 'Site not found' });
		}

		res.status(204).json();
	} catch (error) {
		logger.error(error);
		res.status(500).json({ error: 'Server error' });
	}
}
export async function updateSite(req: Request, res: Response) {
	const id = req.params.id;
	console.log('ID', id);
	const { company, link } = req.body;
	try {
		const site = await SitesModel.findById(id);
		if (site) {
			site.company = company;
			site.link = link;
			await site.save(); // Save the changes
			logger.info(site);
			res.status(201).json(site);
		} else {
			res.status(404).json({ error: 'Site not found' });
		}
	} catch (error) {
		logger.error(error);
		res.status(500).json({ error: 'Failed to get sites' });
	}
}
