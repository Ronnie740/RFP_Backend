/** @format */

import main from '../mainScrapper';
import NotificationModel from '../model/notifications';
import RfpModel from '../model/rfp';

export default async function startCrawling() {
	const currentJobs = await RfpModel.find();
	const currentNotifications = await NotificationModel.find();
	let response = '';
	try {
		const result = await main();
		if (result && result.website1 && result.website3) {
			for (const rfpData of result.website1) {
				const { title, deadline, country, link } = rfpData;

				// Check if a job with the same title already exists in the database
				const jobExists = currentJobs.some((job) => job.title === title);

				if (!jobExists) {
					const newRfp = new RfpModel({
						title: title,
						deadline: new Date(deadline),
						link: link,
						location: country,
					});

					try {
						const savedRfp = await newRfp.save();

						// Check if a notification with the same message already exists
						const notificationExists = currentNotifications.some((notification) => notification.message === `New RFP added: ${title}`);

						if (!notificationExists) {
							// Create a new notification for the newly saved RFP
							const newNotification = new NotificationModel({
								message: `New RFP added: ${title}`,
							});

							const savedNotification = await newNotification.save();
							response = `RFP saved: ${savedRfp.title}\n\n  Notification created: ${savedNotification.message}`;
						}
					} catch (err) {
						console.error(`Error saving RFP: ${title}`, err);
						response = `Internal Server Error ${err}`;
					}
				} else {
					response = `RFPs are up to date.`;
				}
			}
			for (const rfpData of result.website3) {
				if (rfpData != undefined) {
					const { title, type, date, location, link, category, description } = rfpData;

					const dateParts = date.split('-');
					const endDateStr = dateParts[1].trim();

					// Parse the end date string into a JavaScript Date object
					const endDate = new Date(endDateStr);
					// Check if a job with the same title already exists in the database
					const jobExists = currentJobs.some((job) => job.title === title);

					if (!jobExists) {
						const newRfp = new RfpModel({
							title: title,
							deadline: endDate,
							link: link,
							location: location,
							type: type,
							category: category,
							description: description,
						});

						try {
							const savedRfp = await newRfp.save();

							// Check if a notification with the same message already exists
							const notificationExists = currentNotifications.some((notification) => notification.message === `New RFP added: ${title}`);

							if (!notificationExists) {
								// Create a new notification for the newly saved RFP
								const newNotification = new NotificationModel({
									message: `New RFP added: ${title}`,
								});

								const savedNotification = await newNotification.save();
								response = `RFP saved: ${savedRfp.title}\n\n  Notification created: ${savedNotification.message}`;
							}
						} catch (err) {
							console.error(`Error saving RFP: ${title}`, err);
							response = `Internal Server Error ${err}`;
						}
					} else {
						response = `RFPs are up to date.`;
					}
				}
			}
		}
		if (response) {
			console.log(response); // Send a single response after all operations are completed
		} else {
			console.log('Success');
		}
	} catch (error) {
		console.error('Error running main function:', error);
	}
}
