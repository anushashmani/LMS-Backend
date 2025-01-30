import mongoose from "mongoose";
const { Schema } = mongoose;

const campusSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },

    },
    { timestamps: true }
);

const Campus = mongoose.model("Campus", campusSchema);
export default Campus;
