/** @format */

import mongoose, { Schema, Document } from 'mongoose';

interface ISites extends Document {
	company: string;
	link: string;
}

const SitesSchema: Schema = new Schema({
	company: { type: String, required: true },
	link: { type: String, required: true, unique: true }
});

const SitesModel = mongoose.model<ISites>('Sites', SitesSchema);

export default SitesModel;
