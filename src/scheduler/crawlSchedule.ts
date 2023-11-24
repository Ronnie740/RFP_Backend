/** @format */
import startCrawling from '../crawler/webCrawler';
import * as schedule from 'node-schedule';

export default function crawlSchedule() {
	//Start crawler at 6:00 AM
	var rule = new schedule.RecurrenceRule();
	rule.dayOfWeek = [0, new schedule.Range(0, 6)];
	rule.hour = 6;
	rule.minute = 0;
	schedule.scheduleJob(rule, async function () {
		startCrawling().catch((error) => {
			console.error('Crawling error:', error);
		});
	});
}
