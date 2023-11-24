/** @format */

import express, { Request, Response } from 'express';
import { addSite, deleteSite, getSiteById, getSites, updateSite } from '../controllers/sites';
import { loginUser } from '../controllers/user';
import { checkAndRemoveExpiredRfps, getRfps, getRfpsById } from '../controllers/rfps';
import { deleteNotification, getNotifications } from '../controllers/notifications';

const router = express.Router();

// Login user
router.post('/login', loginUser);

// Route to Sites
router.post('/sites', addSite);
router.get('/sites', getSites);
router.get('/sites/:id', getSiteById);

// Route to update a specific site based on its ID.
router.put('/sites/:id', updateSite);

// Route to delete a specific site based on its ID.
router.delete('/sites/:id', deleteSite);

// Route to retrieve a list of Request for Proposals (RFPs).
router.get('/data', checkAndRemoveExpiredRfps, getRfps);

// Route to retrieve a specific RFP based on its ID.
router.get('/data/:id', getRfpsById);

router.get('/notifications', getNotifications);
router.delete('/notifications/:id', deleteNotification);

// Catch-all route for handling unavailable routes
router.use('*', (req: Request, res: Response) => {
	res.status(404).json({ error: 'Not Found' });
});
export default router;
