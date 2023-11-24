/** @format */

// Mongodb connection
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables from the .env file
dotenv.config();

const mongodbConnectionString = process.env.DATABASE_URL || '';

async function connectDB() {
	try {
		await mongoose.connect(mongodbConnectionString, {
			bufferCommands: true,
			dbName: 'rfp_scrapper',
			autoCreate: true,
			user: 'steve',
			pass: 'uGuCUxe3B9uDjc8j',
		});
		console.log('MongoDB connected');
	} catch (error) {
		console.error('MongoDB connection error:', error);
	}
}

export default connectDB;
