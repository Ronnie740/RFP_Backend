/** @format */

import { Request, Response } from 'express';
import UserModel from '../../model/user';
import logger from 'winston';

export async function loginUser(req: Request, res: Response) {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ message: 'Missing user info' });
		}

		// Check the database for this user
		let user = await UserModel.findOne({ email });

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		if (user.password !== password) {
			return res.status(400).json({ message: 'Invalid password' });
		}

		// Return a success message
		res.json(user);
	} catch (error) {
		logger.error('Error in loginUser:', error);
		res.status(500).json({ message: 'Internal Server Error' });
	}
}
