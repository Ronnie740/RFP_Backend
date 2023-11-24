/** @format */

import { Request, Response } from 'express';
import logger from 'winston';
import NotificationModel from '../../model/notifications';

export async function getNotifications(req: Request, res: Response) {
	try {
		const notifications = await NotificationModel.find();
		res.status(200).json(notifications);
	} catch (error) {
		logger.error(error);
		res.status(500).json({ error: 'Failed to get notifications' });
	}
}

export async function deleteNotification(req: Request, res: Response) {
	const id = req.params.id;
	try {
		const result = await NotificationModel.deleteOne({ _id: id });

		if (result.deletedCount === 0) {
			return res.status(404).json({ error: 'Notification not found' });
		}

		res.status(204).json();
	} catch (error) {
		logger.error(error);
		res.status(500).json({ error: 'Server error' });
	}
}
