/** @format */

import mongoose, { Schema, Document } from 'mongoose';

interface INotification extends Document {
	message: string;
}

const NotificationSchema: Schema = new Schema({
	message: { type: String, required: true },
	createdAt: {
		type: Date,
		default: Date.now, // Set the default value to the current date and time
		required: true,
	},
});

const NotificationModel = mongoose.model<INotification>('Notifications', NotificationSchema);

export default NotificationModel;
