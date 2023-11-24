/** @format */

import mongoose, { Schema, Document } from 'mongoose';

interface IRFP extends Document {
	title: string;
	deadline: Date;
	description: string;
	budget: number;
	link: string;
	location: string;
}

const RFPSchema: Schema = new Schema({
	title: { type: String, required: true },
	deadline: { type: Date, required: true },
	description: { type: String, required: false },
	budget: { type: Number, required: false },
	link: { type: String, required: false },
	location: { type: String, required: true },
	category: { type: String, required: false },
	type: { type: String, required: false },
});

const RfpModel = mongoose.model<IRFP>('RFP', RFPSchema);

export default RfpModel;
