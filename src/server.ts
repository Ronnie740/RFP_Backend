/** @format */

import * as dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import * as schedule from 'node-schedule';
import crawlSchedule from './scheduler/crawlSchedule';
import connectDB from './config/db';
import router from './routes/router';
import startCrawling from './crawler/webCrawler';
import cors from 'cors';
import bodyParser from 'body-parser';

dotenv.config();
const app = express();
const port = 4000;

// Connect to MongoDB
connectDB();

// Enable CORS for all routes
app.use(cors());

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialise schuduler to run daily at 6 AM
crawlSchedule();

// Setup routes
app.get('/', (req, res) => {
	res.send('API IS UP!');
});
app.use('/api/', router);

// Error handling middleware
router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(err.stack);
	res.status(500).json({ error: 'Internal Server Error' });
});

startCrawling().catch((error) => {
	console.error('Crawling error:', error);
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
