import mongoose from "mongoose";

const ModuleSchema = new mongoose.Schema(
    {
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        duration: { type: String, required: true },
    },
    { timestamps: true },
)

const Module = mongoose.model("Module", ModuleSchema);
export default Module;
