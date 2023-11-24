/** @format */
import { Request, Response } from 'express';
import logger from 'winston';
import RfpModel from '../../model/rfp';

export async function checkAndRemoveExpiredRfps(req: Request, res: Response, next: Function) {
	try {
		const currentDateTime = new Date();
		//Find and remove RFPS with deadlines that have passed
		const expiredRfps = await RfpModel.deleteMany({
			deadline: { $lt: currentDateTime },
		});

		logger.info(`Removed ${expiredRfps.deletedCount} expired RFPS`);

		// Call the next middleware
		next();
	} catch (error) {
		logger.error('Error checking and removing expired RFPS:', error);
		// You can choose to handle the error or pass it to the next middleware
		next(error);
	}
}

export async function getRfps(req: Request, res: Response) {
	try {
		const rfps = await RfpModel.find();
		// logger.info(rfps);
		res.status(200).json(rfps);
	} catch (error) {
		logger.error(error);
		res.status(500).json({ error: 'Rfp not found' });
	}
}
export async function getRfpsById(req: Request, res: Response) {
	const id = req.params.id;
	try {
		const rfp = await RfpModel.findById(id);
		logger.info(rfp);
		res.status(200).json(rfp);
	} catch (error) {
		logger.error(error);
		res.status(500).json({ error: 'Failed to get rfp' });
	}
}
