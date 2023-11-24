/** @format */

import { load } from 'cheerio';

export class PageScraper {
	private $: cheerio.Root;

	constructor(pageContent: string) {
		this.$ = load(pageContent);
	}

	getLinks(): string[] {
		const links: string[] = [];
		this.$('a').each((_, element) => {
			const href = this.$(element).attr('href');
			if (href) {
				links.push(href);
			}
		});
		return links;
	}

	getRFPs(): any[] {
		const rfps: any[] = [];
		const e = this.$('.rssapp-card-summary-container');
		if (e) {
			e.each((_, element) => {
				console.log(element);
				const title = this.$(element).find('.rssapp-card-title').text();
				console.log('Title', title);
				const description = this.$(element).find('.rssapp-card-description').text();
				console.log('Description', description);
				const href = this.$(element).find('.rssapp-card-title').attr('href');
				rfps.push({ title, description, href });
			});
		} else {
			console.log('Not Found');
			rfps.push({ notFound: true });
		}
		return rfps;
	}

	getTitle(): string[] {
		const title: string[] = [];
		this.$('.rssapp-card-title a').each((_, element) => {
			const text = this.$(element).text();
			if (text) {
				title.push(text);
			} else if (text.includes('Call for Proposals')) {
				console.log(text);
			}
		});
		return title;
	}
}
