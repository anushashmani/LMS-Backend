import mongoose from "mongoose";
const { Schema } = mongoose;
const batchSchema = new Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		course: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Course",
			required: true,
		},
	},
	{ timestamps: true }
);

const Batch = mongoose.model("Batch", batchSchema);
export default Batch;
