import mongoose from "mongoose";
const { Schema } = mongoose;

const sectionSchema = new Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
		batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
		status: { type: String, enum: ['pending', 'ongoing', 'finished'], required: true },
	},
	{ timestamps: true }
);

const Section = mongoose.model("Section", sectionSchema);
export default Section;
